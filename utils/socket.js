import { io } from "socket.io-client";
export const socket = io("https://app-backend-kyhh.onrender.com", {
  transports: ["websocket"],
  autoConnect: false,
});

export function connectSocket(userId) {
  socket.connect();
  socket.emit("register", userId);
}
