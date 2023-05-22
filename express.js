const express = require('express');
const app = express();

const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('A user connected', socket.id);

  socket.on('stream', image => {
    io.emit(socket.id, image, socket.id);
    console.log("Image received ",socket.id)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

server.listen(3080, () => {
  console.log('Server listening on port 3080');
});
