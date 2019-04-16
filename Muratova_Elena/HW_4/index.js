var request = require('request');
var cheerio = require('cheerio');
const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
var cookieParser =  require ('cookie-parser');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    console.log('Оп тут - гланвя');
    res.sendFile(__dirname + "/form.html");
});

function sendRequest(url) {
    return new Promise((resolve, reject) => {
      request(url, (err, req, body) => {
        if(err) {
          reject(err);
        }
        resolve(cheerio.load(body));
      });
    })
  }

var text;
var cookie;

app.post('/', function(req, res) {
    text = req.body;
    res.redirect("/news");
    return text;
});

app.use(cookieParser());
app.use(function (req, res, next) {
    // check if client sent cookie
    cookie = req.cookies;
    res.cookie('site', text.site, { maxAge: 900000, httpOnly: true });
    res.cookie('number_news', text.number_news, { maxAge: 900000, httpOnly: true });
    console.log('В куках ' + cookie.site,  cookie.number_news);
    next();
  });

app.get('/news', async (req, res) => {
    console.log('Оп тут');
    //console.log(req.cookies);
    console.log(cookie.site);
    if (text.site === 'Новости Мурино') {
        const news = await fetchNews('https://ok-inform.ru/tags/%D0%9C%D1%83%D1%80%D0%B8%D0%BD%D0%BE.html');

        async function fetchNews(url) {
            console.log('Пук');
            let news = [];
            const $newsPage = await sendRequest(url);
            $newsPage('.ok-articles-wide-list li').each(function () {
                let a = {};
                a.title = $newsPage(this).find('a').text();
                a.content = $newsPage(this).find('p').text();
                news.push(a);
            });
            news.length = text.number_news;
            return news;
        }
        res.render('news', {news});
    } else {
        const news = await fetchNews('https://www.rbc.ru/');

        async function fetchNews(url) {
            const $newsPage = await sendRequest(url);
            const newsHeads = Array.prototype.slice.call($newsPage('.main__feed__link'), 0)
                                .map(item => ({ title: $newsPage(item).text().replace(/\n/g, '').trim(), href: $newsPage(item).attr('href') }));
            
            const news = await Promise.all(newsHeads.map(async item => {
              const $item = await sendRequest(item.href);
              const content = $item('.article__text__overview').eq(0).text().replace(/\n/g, '').trim();
              return { ...item, content };
            }));
            news.length = text.number_news;
            return news;
        }

        res.render('news', {news});
    }
    
  });

app.listen(3000);