const path = require('path');
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const fetchRBC = require('./parsers/rbc.js');
const fetchHabr = require('./parsers/habr.js');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// мидл
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const news = await fetchRBC('https://www.rbc.ru/');
    res.render('app', {news: news.map((item, idx) => ({ ...item, idx: idx + 1 }))});
});

app.get('/habr', async (req, res) => {
    const news = await fetchHabr('https://habr.com/ru/news/');
    res.render('app', {news: news.map((item, idx) => ({ ...item, idx: idx + 1 }))});
});

app.listen(81);