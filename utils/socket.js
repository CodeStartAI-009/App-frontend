// app/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://app-backend-psi.vercel.app/api"; // your backend
export const socket = io(SOCKET_URL, { transports: ["websocket"], autoConnect: false });

export function connectSocket(userId) {
  if (!userId) return;
  socket.connect();
  socket.emit("register", userId);
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}
