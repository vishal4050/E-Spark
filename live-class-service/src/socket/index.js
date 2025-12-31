import { liveSocket } from "./live.socket.js";
import { socketAuth } from "../middlewares/socketAuth.js";

export const initSocket = (io) => {
  io.use(socketAuth);
  liveSocket(io);
};
