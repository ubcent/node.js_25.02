const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
var ever = require('ever');
var jade = require('jade');
const cookieParser = require('cookie-parser');
const jsdom = require ( 'jsdom') ;   
const session = require('express-session')
const { JSDOM } =  jsdom ; 
const passportmodule = require('./passport/passport');
const passport = passportmodule.passport;
const authHandler = passportmodule.authHandler;
const hmac = require('hmac');
const {Task, User} = require('./public');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))
app.use(passport.initialize());
app.use(passport.session());
  
app.get('/auth', (req, res) => {
    res.render('auth');
});

app.post('/auth', authHandler);

const mustBeAuthenticated = (req, res, next) => {
  if(req.user) {
    return next();
  } 
  res.redirect('/auth');
}

app.use('/auth', mustBeAuthenticated);

app.get('/', async (req, res) => { 
    const tasks = Task.getAll();
    tasks.then(data=>{
        heroList = data;
        res.render('todo', {heroList});
        return data;
    })      
});

app.post('/add', function(req, res) {
    const text = req.body.newTask;
    const new_tasks = Task.add(text);
    new_tasks.then(data=>{
    }).catch(e =>{
        console.log(e)
    })
    res.redirect('back');
});

app.post('/completed', function(req, res) {
    const info_done = req.body;
    Task.complete(info_done).then(data=>{
    }).catch(e =>{
        console.log(e)
    })
    res.redirect('back');
});

app.post('/delete', function(req, res) {
    Task.delete(req.body).then(data=>{
    }).catch(e =>{
        console.log(e)
    })
    res.redirect('back');
});

app.post('/update', function(req, res) {
    Task.update(req.body).then(data=>{
    }).catch(e =>{
        console.log(e)
    })
    res.redirect('back');
});

app.listen(3000);