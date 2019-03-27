const path = require('path');

const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const consolidate = require('consolidate');
const url = require('url');
let urlQuery;
let jsonNews;

const app = express();
const port = 9999;

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('news', path.resolve(__dirname, 'views'));

function sendRequest(url, selector, category) {
    let allNews = [];
    let id = 0;
    request(url, (err, res, html) => {
        if (err) console.log(`Не удалось получить страницу из за следующей ошибки:  ${err}`);

        const $ = cheerio.load(html);
        // collect the necessary data
        $(selector).each(function () {
            let news = {category};
            news.id = ++id;
            news.time = $(this).find('.story__date').text().split('\n')[1];
            news.title = $(this).find('.story__title').text();
            news.description = $(this).find('.story__text').text();
            allNews.push(news);
        });
        // write to json
        fs.writeFile(`news/${category}.json`, JSON.stringify(allNews), function (err) {
            if (err) {
                throw err;
            }
        });

    });
}

app.use('/assets', express.static('./static'));

app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    urlQuery = url.parse(req.url, true).query;
    next();
});

const urlYandex = {
    'sport': ['https://news.yandex.ru/sport.html?from=rubric', '.story'],
    'business': ['https://news.yandex.ru/business.html?from=rubric', '.story'],
    'politic': ['https://news.yandex.ru/politics.html?from=rubric', '.story']
};


app.get('/', (req, res) => {
    // parsing initial news
    sendRequest(urlYandex['sport'][0], urlYandex['sport'][1], 'sport');
    jsonNews = JSON.parse(fs.readFileSync('news/sport.json', 'utf8'))
    res.render('news', jsonNews);
});

app.get('/news-list', (req, res) => {
    // set cookie
    const cookieStr = `{"category": "${urlQuery.resource}"}`;
    res.cookie('newsForm', cookieStr);

    // get cookie
    let cookieNewsFrom = {category: null};
    if (req.cookies['newsForm']) {
        cookieNewsFrom = JSON.parse(req.cookies['newsForm']);
        cookieNewsFrom = cookieNewsFrom.category;
    } else {
        cookieNewsFrom = urlQuery.resource;
    }
    if (cookieNewsFrom === null) {
        cookieNewsFrom = urlQuery.resource;
    }

    sendRequest(urlYandex[cookieNewsFrom][0], urlYandex[cookieNewsFrom][1], cookieNewsFrom);
    jsonNews = JSON.parse(fs.readFileSync(`news/${cookieNewsFrom}.json`, 'utf8'));
    res.render('news', jsonNews);
});

// start server
app.listen(port, () => {
    console.log(`Server has been started http://localhost:${port}`);
});


