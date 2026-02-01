const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve client folder
app.use(express.static(__dirname + "/../client"));

// Store all strokes globally
let strokes = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing strokes to the new user
  socket.emit("init", strokes);

  // When a user draws a stroke
  socket.on("stroke", (stroke) => {
    strokes.push(stroke);              // save stroke
    socket.broadcast.emit("stroke", stroke); // send to other users
  });

  // Undo last stroke
  socket.on("undo", () => {
    if (strokes.length > 0) {
      strokes.pop();
      io.emit("reset", strokes);       // reset all clients
    }
  });

  // Clear all strokes
  socket.on("clear", () => {
    strokes = [];
    io.emit("clear");                  // clear all clients
  });

  // Live cursor movement
  socket.on("cursor", (data) => {
    socket.broadcast.emit("cursor", data);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.broadcast.emit("userDisconnect", socket.id); // remove cursor from others
  });
});

// Start server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
