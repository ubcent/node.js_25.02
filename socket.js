const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Socket has been connected');

  socket.on('message', (msg) => {
    msg.timestamp = new Date();
    // TODO: save msg into db
    socket.broadcast.emit('message', msg);
    socket.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Socket has been disconnected');
  });
});

server.listen(8888, () => {
  console.log('Server has been started');
});