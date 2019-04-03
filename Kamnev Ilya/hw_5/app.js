const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/usernews', { useNewUrlParser: true });

const app = express();

app.engine('hbs', hbs({ 
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: __dirname + '/views/',
    partialsDir: __dirname + '/views/partials/',
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
  
app.get('/', require('./routes/main').get);

app.get('/news', require('./routes/news').get);
app.post('/news', require('./routes/news').post);

app.get('/news/:id', require('./routes/item').get);

app.post('/news/add', require('./routes/add').post);

app.listen(8888);