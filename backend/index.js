import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
      methods: ["GET", "POST"]
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  let currentRooms = null;
  let currentUser = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRooms) {
      socket.leave(currentRooms);
      rooms.get(currentRooms)?.delete(currentUser);
      io.to(currentRooms).emit("user joined", Array.from(rooms.get(currentRooms) || []));
    }

    currentRooms = roomId;
    currentUser = userName;
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userName);

    io.to(roomId).emit("user joined", Array.from(rooms.get(roomId)));
    console.log(`${userName} joined room: ${roomId}`);
  });

  socket.on("leave", ({ roomId, userName }) => {
    socket.leave(roomId);
    rooms.get(roomId)?.delete(userName);
    io.to(roomId).emit("user joined", Array.from(rooms.get(roomId) || []));
  });

  socket.on("text-changed", ({ roomId, content }) => {
    socket.to(roomId).emit("text-changed", { content });
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("typing", userName);
  });

  socket.on("disconnect", () => {
    if (currentRooms && currentUser) {
      rooms.get(currentRooms)?.delete(currentUser);
      io.to(currentRooms).emit("user joined", Array.from(rooms.get(currentRooms) || []));
    }
  });
});
app.get("/",(req,res)=>{
  res.send("Api is running")
})

const Port = process.env.PORT || 5000;

server.listen(Port, () => {
  console.log(`Server started on port ${Port}`);
});
