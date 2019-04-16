const express = require('express');
const consolidate = require('consolidate');

const app = express();
const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', 'lesson-4/views');

app.use('/', indexRouter);
app.use('/news', newsRouter);

app.listen(8080);
