const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // console.log('data',connectedClients)

  // Store client ID and socket connection
  connectedClients.set(socket.id, socket);
 
  socket.on('start-screen-sharing', (clientId, data) => {
    // Broadcast the received stream data to other clients
    connectedClients.forEach((clientSocket, id) => {
      if (id !== clientId) {
        clientSocket.emit('stream-data', id, data);
      }
    });
    console.log('Screen sharing start by client:', socket.id);
    console.log('data',connectedClients)
  });

  socket.on('stop-screen-sharing', () => {
    // Handle stop-screen-sharing event
    console.log('Screen sharing stopped by client:', socket.id);
  });
  

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

const port = 3500; // Replace with the desired port number
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
