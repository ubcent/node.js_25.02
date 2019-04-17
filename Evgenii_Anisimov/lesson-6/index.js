const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');

const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const { User } = require('./models');

const bCrypt = require('bcrypt-nodejs');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoose.connect('mongodb://127.0.0.1:3001/test', { useNewUrlParser: true });

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(cookieParser());
app.use(session({ keys: ['secret'] }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username }).lean();
    if(user && isValidPassword(user, password)) {
        delete user.password;
        return done(null, user);
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).lean();
    delete user.password;
    done(null, user);
});

const authHandler = passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/userCreate'
});

//Форма авторизации
app.get('/auth', jsonParser, (req, res) => {
    res.render('auth');
});

//Данные авторизации
app.post('/auth', urlencodedParser, authHandler);

//Форма добавления пользователя
app.get('/userCreate', jsonParser, async (req, res) => {
    res.render('userCreate')
});

//Данные добавленного пользователя
app.post('/userCreate', urlencodedParser, async (req, res) => {
    let user = new User();    
    user.name = req.body.name;
    user.age = req.body.age;
    user.username = req.body.username;
    user.password = createHash(req.body.password);   
    user = await user.save();
    res.render('auth');
});

const mustBeAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/userCreate');
    }  
};

app.all('/users', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);

app.get('/users', jsonParser, async(req, res) => {
    const users = await User.find();
    res.render('userList', { users});
});

app.get('/user/settings', jsonParser, (req, res) => {
    res.send('User settings');
});


const createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

app.listen(5000);
