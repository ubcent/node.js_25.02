const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const consolidate = require('consolidate');
const path = require('path');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.resolve(__dirname, 'node_modules')));

async function fetchHabrNews(url) {
    const $ = await sendRequest(url);
    const textArray = $('.post__text');
    let news = [];

    $('.post__title_link').each(function (i, element) {
        news.push({
            title: element.childNodes[0].data,
            content: textArray[i].childNodes.reduce((acc, item) => {
                if (item.data != undefined) {
                    acc = acc + item.data.trim();
                }
                return acc;
            }, []),
        })
    });

    return news;
}

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, req, body) => {
            if (err) {
                reject(err);
            }

            resolve(cheerio.load(body));
        });
    })
}

async function fetchRBCNews(url) {
    const $newsPage = await sendRequest(url);
    const newsHeads = Array.prototype.slice.call($newsPage('.main__feed__link'), 0)
        .map(item => ({ title: $newsPage(item).text().replace(/\n/g, '').trim(), href: $newsPage(item).attr('href') }));

    const news = await Promise.all(newsHeads.map(async item => {
        const $item = await sendRequest(item.href);
        const content = $item('.article__text__overview').eq(0).text().replace(/\n/g, '').trim();

        return { ...item, content };
    }));

    return news;
}

app.get('/news', async (req, res) => {
    res.render('news', null);
});

app.get('/news/:type/:id', async (req, res) => {
    if (req.params.type == 1) {
        const news = await fetchRBCNews('https://www.rbc.ru/');
        res.render('item', news[req.params.id - 1]);
    } else if (req.params.type == 2) {
        const news = await fetchHabrNews('https://habr.com/ru/');
        res.render('item', news[req.params.id - 1]);
    }
});

app.post('/news', async (req, res) => {
    if (req.body.src == 1) {
        const news = await fetchRBCNews('https://www.rbc.ru/');
        res.render('news-list', { news: news.map((item, idx) => ({ ...item, idx: "1/" + (idx + 1) })) });
    } else if (req.body.src == 2) {
        const news = await fetchHabrNews('https://habr.com/ru/');
        res.render('news-list', { news: news.map((item, idx) => ({ ...item, idx: "2/" + (idx + 1) })) });
    }
});

app.listen(8888);