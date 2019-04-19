const express = require('express');
const bodyParser = require("body-parser");
const consolidate = require('consolidate');
const http = require('http');
const socketIO = require('socket.io');
const {Task} = require('./models');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const indexRouter = require('./routes');
const taskRouter = require('./routes/task');
const taskAPIRouter = require('./routes/API/task');
const authAPIRouter = require('./routes/API/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', 'lesson-8/views');

app.use('/', indexRouter);
app.use('/task', taskRouter);

app.use('/api/auth', authAPIRouter);
app.use('/api/task', taskAPIRouter);

io.on('connection', (socket) => {
    console.log('Socket has been connected');

    socket.on('newTask', async (newTask) => {
        newTask.id = await Task.add(newTask);
        socket.broadcast.emit('newTask', newTask);
        socket.emit('newTask', newTask);
    });

    socket.on('disconnect', () => {
        console.log('Socket has been disconnected');
    });
});

server.listen(8888, () => {
    console.log('Server has been started');
});
