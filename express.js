const express = require('express');
const app = express();

const http = require('http');
const socketIO = require('socket.io');

trayStreams = [];

const server = http.createServer(app);
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

app.get('/streams', (req, res) => {
  console.log(trayStreams)
  res.send(trayStreams);
});

io.on('connection', socket => {
  console.log('A user connected',socket.handshake.headers.machineid, socket.id);
  trayStreams.push({
    "machineId":socket.handshake.headers.machineid,
    "streamId":socket.id
  })
  socket.on('stream', image => {
    io.emit('faheem', image, socket.id);
    console.log("Image received ",socket.id)
  });
  socket.on('connection_id', connectionId => {
    console.log('Connection ID:', connectionId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    trayStreams = trayStreams.filter(item => item.streamId !== socket.id);
  });
});

server.listen(3080, () => {
  console.log('Server listening on port 3080');
});
