const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const {passport} = require('./libs/passport');

const app = express();

app.engine('hbs', hbs({ 
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: __dirname + '/views/',
    partialsDir: __dirname + '/views/partials/',
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ keys: ['secret'] }));
app.use(passport.initialize());
app.use(passport.session());
  
app.get('/', require('./routes/main').get);

app.get('/auth', require('./routes/auth').get);
app.post('/auth', require('./routes/auth').post);

app.get('/auth/vkontakte', require('./routes/auth/vk').get);
app.get('/auth/vkontakte/callback', require('./routes/auth/vk').callback, (req, res) => {
    res.redirect('/user');
});

app.get('/signUp', require('./routes/auth/signUp').get);
app.post('/signUp', require('./routes/auth/signUp').post);

app.get('/news', require('./routes/news').get);
app.post('/news', require('./routes/news').post);

app.get('/news/:id', require('./routes/item').get);
app.post('/news/add', require('./routes/addNews').post);

app.all('/user', require('./routes/user').all);
app.all('/user/*', require('./routes/user').all);
app.get('/user', require('./routes/user').get);
  
app.listen(8888);