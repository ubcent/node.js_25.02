const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/test');

const {User} = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ keys: ['secret'] }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({username});
  if(user && user.password === password) { // заменить на сравнение пароля с использование хэша
    delete user.password;
    return done(null, user); // удалить из юзера значимую информацию (пароли и пр)
  } else {
    return done(null, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // удалить из юзера значимую информацию (пароли и пр)
});

const authHandler = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/auth',
});

app.post('/auth', authHandler);
app.get('/auth', (req, res) => {
  res.send('TODO: Login form');
});

const mustBeAuthenticated = (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect('/auth');
  }
}

app.all('/user', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);

app.get('/user', (req, res) => {
  res.send('User'); // SOAP
});

app.get('/user/settings', (req, res) => {
  res.send('User settings');
});

app.listen(8888);