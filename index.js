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
app.use(function(req, res, next) {
  req.property = 'Hello';
  console.log('use');
  next();
});

app.all('/news', (req, res, next) => {
  console.log('all');
  next();
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

async function fetchNews(url) {
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

app.get('/users', async (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.send('Hello from homepage');
});

app.get('/news', async (req, res) => {
  const news = await fetchNews('https://www.rbc.ru/');
  res.render('news', {news: news.map((item, idx) => ({ ...item, idx: idx + 1 }))});
});

app.get('/news/:id', async (req, res) => {
  const news = await fetchNews('https://www.rbc.ru/');
  res.render('item', news[req.params.id - 1]);
});

app.post('/users', (req, res) => {
  console.log(req.body);
  res.send('OK');
});

app.listen(8888);