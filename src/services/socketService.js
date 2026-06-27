import { useTaskStore } from "@/stores/user/task";
import { socket, connectSocket, disconnectSocket } from "@/utils/socket";

let initialized = false;

export const initSocket = () => {
  if (initialized) return;
  initialized = true;

  const taskStore = useTaskStore();

  socket.off("task-created");
  socket.off("task-updated");
  socket.off("task-deleted");

  socket.on("task-created", (data) => taskStore.handleTaskCreated(data));
  socket.on("task-updated", (data) => taskStore.handleTaskUpdated(data));
  socket.on("task-deleted", (data) => taskStore.handleTaskDeleted(data));

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      disconnectSocket();
    }
  });

  connectSocket();
};
