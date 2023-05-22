const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*', // Update with the domain of your Angular application
    methods: ['GET', 'POST']
  }
});

// Rest of your server code


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit a custom event to inform the client about the stream URL
  socket.emit('streamURL', 'http://localhost:3090');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3090;

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
