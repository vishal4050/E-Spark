import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.TEST_JWT; // use a valid JWT

const socket = io("http://localhost:5001", {
  query: { token }
});

socket.on("connect", () => {
  console.log("✅ Connected with id:", socket.id);

  // Start class (only instructor)
  socket.emit("start-class", { classId: "math101" });

  // Send chat
  socket.emit("chat-message", { classId: "math101", message: "Hello class!" });
});

socket.on("class-started", () => console.log("Class started!"));
socket.on("chat-message", (msg) => console.log("Chat:", msg));
socket.on("user-joined", (data) => console.log("User joined:", data));
socket.on("user-left", (data) => console.log("User left:", data));
socket.on("class-ended", () => console.log("Class ended!"));

socket.on("connect_error", (err) => console.log("❌ Connect error:", err.message));
socket.on("disconnect", () => console.log("🔴 Disconnected"));
