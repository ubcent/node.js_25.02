const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const consolidate = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');

const Task = require('./task');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use('/assets', express.static('./static'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/todo', (req, res) => {
    getTodo(req, res);
});

app.post('/todo', (req, res) => {
    addTodo(req, res);
});

function getTodo(req, res) {
    const tasks = Task.getAll();

    tasks.then(
        result => {
            res.render('todo', {
                title: 'Ваши дела',
                todolist: result
            });
        },
        error => console.log(error.message)
    );
}

function addTodo(req, res) {
    const unixtime = Math.round(new Date().getTime() / 1000);

    const task = Task.add({
        title: req.body.tit,
        descr: req.body.descr,
        datka: unixtime
    });

    task.then(
        result => {
            console.log(result);
            getTodo(req, res);
        },
        error => console.log(error.message)
    );
}


app.listen(8888, () => {
    console.log('Server has been started');
});
