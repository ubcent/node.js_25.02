const path = require('path');
const mysql = require('mysql');
const express = require('express');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')

const passportmodule = require('../passport/passport');
const passport = passportmodule.passport;
const authHandler = passportmodule.authHandler;

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views'));

app.use('/assets', express.static('./static'));
app.use(bodyParser.urlencoded({extended: false}));

const Task = require('../models/task');
const User = require('../models/user');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth', (req, res) => {
    res.render('loginform');
});

app.post('/user', authHandler);

const mustBeAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect('/auth');
}

app.use('/', mustBeAuthenticated);

app.get('/user', (req, res) => {
    res.redirect('/user/' + req.user.username);
});
app.get('/user/:id', (req, res) => {
    const tasks = Task.getAll(req.user._id);
    tasks.then((data) => {
        json.forEach(function (element) {
            if (element.status == 'done') {
                element.status = null;
            }
        });
        res.render('user', {tasks: json, textId: data[0]});
    });
});

app.get('/user/settings', (req, res) => {
    res.send('TODO USER SETTING');
});

app.get('/', (req, res) => {
    res.redirect('/auth');
});

app.post('/add', (req, res) => {
    Task.add({id: null, content: req.body.task, status: 'pending', priority: 0, userid: req.user._id});
    res.redirect('/user');
});

app.get('/remove/:id', (req, res) => {
    Task.remove(req.params.id);
    res.redirect('back');
});

app.get('/complete/:id', (req, res) => {
    Task.complete(req.params.id);
    res.redirect('/user');
});

app.get('/task/:id', (req, res) => {
    const task = Task.getById(req.params.id);
    task.then((data) => {
        res.render('task', {task: data});
    });
});

let taskId = 0;

app.get('/update/:id', (req, res) => {
    const task = Task.getById(req.params.id);
    taskId = req.params.id;
    task.then((data) => {
        res.render('update', {textTask: data[0]});
    });
});

app.post('/update', (req, res) => {
    Task.update([req.body.task, taskId]);
    res.redirect('/user');
});

app.listen(8888, () => {
    console.log('Server has been started at http://localhost:8888');
});

module.exports = app;