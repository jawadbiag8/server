const child_process = require('child_process');
const socketIOClient = require('socket.io-client');

// FFmpeg command to capture screen and encode it
const ffmpegCommand = 'ffmpeg -f gdigrab -framerate 30 -i desktop -vf "scale=1280:-1" -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p -f rawvideo -';

// Socket.IO server URL
const socketIOServerURL = 'http://localhost:3080';

// Create a WebSocket connection to the Socket.IO server
const socket = socketIOClient(socketIOServerURL);

// Spawn FFmpeg process
const ffmpegProcess = child_process.spawn(ffmpegCommand, [], { shell: true });

// Handle FFmpeg process output (raw video stream)
ffmpegProcess.stdout.on('data', (data) => {
  // Send the video stream to the Socket.IO server
  socket.emit('stream', data);
});

// Handle Socket.IO connection errors
socket.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
});

// Handle Socket.IO disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});
