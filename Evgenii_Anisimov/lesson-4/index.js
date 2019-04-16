const express = require('express');
const app = express();
const request = require('request');
const cheerio = require('cheerio');
const consolidate = require('consolidate');
const path = require('path');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

function sendRequest(url) {
  return new Promise ((resolve, reject) => {
    request(url, (err, req, body) => {
      if(err) {
        reject(err);
      }
      resolve(cheerio.load(body));
    });
  })
}

async function fetchNews(url, desc) {
  const $newsPage = await sendRequest(url);
  const news = Array.prototype.slice.call($newsPage(desc), 0)
    .map(item => ({title: $newsPage(item).text().replace(/\n/g, '').trim(),
      href: $newsPage(item).attr('href')
    }));
  return news;
};

app.get('/', async(req, res) => {
  const news = await fetchNews('https://www.rbc.ru/', '.main__feed__link');
  res.render('index', {news: news.map((item, idx) => ({...item, idx: idx + 1})
  )});
});

app.post('/', urlencodedParser, async (req, res) => {
    if(!req.body) return res.sendStatus(400);   
    const dataSite = req.body.site;
    const arrDataSite = dataSite.split(';');
    console.log(arrDataSite[1]);
    const news = await fetchNews(arrDataSite[0], arrDataSite[1]);
    res.render('index', {news: news.map((item, idx) => ({...item, idx: idx + 1})
  )});
});

app.listen(3000);
