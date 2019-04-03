const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
var ever = require('ever');
var request = require('request');
var cheerio = require('cheerio');
const events = require('events');
const eventEmitter = new  events.EventEmitter();;
var jade = require('jade');
const jsdom = require ( 'jsdom') ;   
const { JSDOM } =  jsdom ; 



const {Task} = require('./public');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', async (req, res) => { 
    let tasks = Task.getAll();
    tasks.then(data=>{
        heroList = data;
        res.render('todo', {heroList});
        return data;
    })      
});

app.post('/add', function(req, res) {
    let text = req.body.newTask;
    let new_tasks = Task.add(text);
    new_tasks.then(data=>{
    }).catch(e=>{
        console.log(e)
    })
    res.redirect('back');
});

app.post('/completed', function(req, res) {
    var info_done = req.body;
    Task.complete(info_done).then(data=>{
    }).catch(e=>{
        console.log(e)
    })
    res.redirect('back');
});

app.post('/delete', function(req, res) {
    Task.delete(req.body).then(data=>{
    }).catch(e=>{
        console.log(e)
    })
    res.redirect('back');
});

app.post('/update', function(req, res) {
    Task.update(req.body).then(data=>{
    }).catch(e=>{
        console.log(e)
    })
    res.redirect('back');
});

app.listen(3000);