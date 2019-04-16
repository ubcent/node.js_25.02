const express = require('express');
const bodyParser = require("body-parser");
const consolidate = require('consolidate');

const app = express();
const indexRouter = require('./routes');
const taskRouter = require('./routes/task');
const taskAPIRouter = require('./routes/API/task');
const authAPIRouter = require('./routes/API/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', 'lesson-5/views');

app.use('/', indexRouter);
app.use('/task', taskRouter);

app.use('/api/auth', authAPIRouter);
app.use('/api/task', taskAPIRouter);

app.listen(8080);
