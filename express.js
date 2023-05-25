const express = require('express');
const app = express();

const http = require('http');
const socketIO = require('socket.io');

// Create an array to store tray streams
let trayStreams = [];

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint to retrieve tray streams
app.get('/streams', (req, res) => {
  res.send(trayStreams);
});

// Socket.io connection handling
io.on('connection', socket => {
  // Log when a user is connected, along with their machine ID and socket ID
  console.log('A user connected', socket.handshake.headers.machineid, socket.id);

  // Add the new tray stream to the trayStreams array
  trayStreams.push({
    machineId: socket.handshake.headers.machineid,
    streamId: socket.id,
  });

  // Listen for 'stream' event and broadcast the received image to all connected clients
  socket.on('stream', image => {
    io.emit(socket.id, image, socket.id);
    console.log('Image received', socket.id);
  });

  // Listen for 'connection_id' event and log the connection ID
  socket.on('connection_id', connectionId => {
    console.log('Connection ID:', connectionId);
  });

  // Listen for 'disconnect' event and remove the disconnected user from trayStreams array
  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    trayStreams = trayStreams.filter(item => item.streamId !== socket.id);
  });
});

// Start the server and listen on port 3080
server.listen(3080, () => {
  console.log('Server listening on port 3080');
});
