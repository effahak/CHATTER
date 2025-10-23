import { Server } from "socket.io";
import express from "express";
import http from "http";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
}); // io = socket server

io.use(socketAuthMiddleware);
const userSocketMap = {}; // dict in form userId:socketId

io.on("connection", (socket) => {
  console.log("A user connected : ", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //sends an event to all connected users: shows all online users

  //listen for disconnection from client-end
  socket.on("disconnect", () => {
    console.log("A user disconnected : ", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
