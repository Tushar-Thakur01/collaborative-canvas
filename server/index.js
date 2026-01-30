const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Track connected users
let userCount = 0;

io.on('connection', (socket) => {
  // 1. Increment Count
  userCount++;
  console.log(`User Connected: ${socket.id} (Total: ${userCount})`);
  
  // 2. Broadcast new count to everyone immediately
  io.emit("user_count", userCount);

  // Handle Code Changes
  socket.on("send_code", (data) => {
    socket.broadcast.emit("receive_code", data);
  });

  // Handle Pins
  socket.on("send_pin", (data) => {
    socket.broadcast.emit("receive_pin", data);
  });

  // Handle Cursors
  socket.on("send_cursor", (data) => {
    socket.broadcast.emit("receive_cursor", data);
  });

  // 3. Handle Disconnect (Decrement Count)
  socket.on('disconnect', () => {
    userCount--;
    console.log(`User Disconnected (Total: ${userCount})`);
    io.emit("user_count", userCount);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING ON PORT 3001");
});