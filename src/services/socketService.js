import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { useMemberStore } from "@/stores/user/member";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useDocumentStore } from "@/stores/user/document";
import { socket, connectSocket, disconnectSocket } from "@/utils/socket";
import router from "@/router";

let initialized = false;

export const initSocket = () => {
  if (initialized) return;
  initialized = true;

  const taskStore = useTaskStore();
  const teamStore = useTeamStore();
  const memberStore = useMemberStore();
  const workspaceStore = UseWorkspaceStore();
  const documentStore = useDocumentStore();

  socket.off("task-created");
  socket.off("task-updated");
  socket.off("task-deleted");
  socket.off("member-joined");
  socket.off("team-member-removed");
  socket.off("workspace-updated");
  socket.off("role-updated");
  socket.off("team-updated");
  socket.off("document-created");
  socket.off("document-updated");
  socket.off("document-deleted");

  socket.on("task-created", (data) => taskStore.handleTaskCreated(data));
  socket.on("task-updated", (data) => taskStore.handleTaskUpdated(data));
  socket.on("task-deleted", (data) => taskStore.handleTaskDeleted(data));

  socket.on("document-created", (data) =>
    documentStore.handleDocumentCreated(data),
  );
  socket.on("document-updated", (data) =>
    documentStore.handleDocumentUpdated(data),
  );
  socket.on("document-deleted", (data) =>
    documentStore.handleDocumentDeleted(data),
  );

  socket.on("member-joined", (data) => {
    memberStore.handleMemberJoined(data);
    teamStore.handleMemberJoined(data);
    workspaceStore.handleMemberJoined(data);
  });

  socket.on("team-member-removed", async (data) => {
    await teamStore.getTeamByWorkspaceStore(data.workspace_id);
    await teamStore.getTeamByIdStore(data.workspace_id, data.team_id);
    await memberStore.getAllMemberInTeamStore(data.workspace_id, data.team_id);
  });

  socket.on("workspace-updated", async (data) => {
    await workspaceStore.getMyWorkspaceStore();
  });

  socket.on("role-updated", async (data) => {
    await workspaceStore.getMyWorkspaceStore();
    await teamStore.getTeamByWorkspaceStore(data.workspace_id);
    const team_id = router.currentRoute.value.params.team_id;
    if (team_id) {
      await teamStore.getTeamByIdStore(data.workspace_id, team_id);
    }
    if (memberStore.selectedTeamId) {
      await memberStore.getAllMemberInTeamStore(
        data.workspace_id,
        memberStore.selectedTeamId,
      );
    }
  });

  socket.on("team-updated", async (data) => {
    await teamStore.getTeamByWorkspaceStore(data.workspace_id);
    await teamStore.getTeamByIdStore(data.workspace_id, data.team_id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      disconnectSocket();
    }
  });

  connectSocket();
};
