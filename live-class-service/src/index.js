import express from "express";
import http from "http";
import { Server } from "socket.io";
import { liveSocket } from "./socket/live.socket.js";
import { socketAuth } from "./middlewares/socketAuth.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔥 STEP 3 — REGISTER AUTH MIDDLEWARE
socketAuth(io);

// 🔥 STEP 4 — REGISTER SOCKET LOGIC AFTER AUTH
liveSocket(io);

server.listen(process.env.PORT || 5001, () => {
  console.log("🚀 Live class server running on 5001");
});
