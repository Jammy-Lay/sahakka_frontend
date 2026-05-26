// import { socket } from "@/utils/socket";
// import { useTaskStore } from "@/stores/task";

// let initialized = false;

// export const initSocket = () => {
//   if (initialized) return;
//   initialized = true;

//   const taskStore = useTaskStore();

//   socket.off("task-update");

//   socket.on("task-update", (data) => {
//     taskStore.handleTaskUpdate(data);
//   });
// };
