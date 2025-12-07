import { io } from "socket.io-client";
import { API_BASE_URL } from "../services/api";

export const socket = io(API_BASE_URL, { autoConnect: false });

export function connectSocket(userId) {
  socket.connect();
  socket.emit("register", userId);
}
