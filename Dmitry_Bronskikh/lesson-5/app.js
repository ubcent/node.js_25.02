const express = require('express');
const bodyParser = require("body-parser");
const consolidate = require('consolidate');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const indexRouter = require('./routes/index');
const taskRouter = require('./routes/task');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', 'lesson-5/views');

app.use('/', indexRouter);
app.use('/task', taskRouter);

app.listen(8080);
