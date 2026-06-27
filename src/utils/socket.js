import { io } from "socket.io-client";

const isDev = import.meta.env.DEV;
const SOCKET_URL = isDev ? "/" : (import.meta.env.VITE_SOCKET_URL || "http://localhost:3000");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};