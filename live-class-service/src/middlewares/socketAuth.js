import jwt from "jsonwebtoken";

export const socketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        console.log("❌ No token in socket auth");
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded; // 🔥 THIS IS THE KEY
      console.log("🔐 Socket Authenticated:", decoded);

      next();
    } catch (err) {
      console.log("❌ Socket auth failed:", err.message);
      next(new Error("Authentication failed"));
    }
  });
};
