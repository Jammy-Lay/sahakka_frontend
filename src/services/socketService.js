import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { useMemberStore } from "@/stores/user/member";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useDocumentStore } from "@/stores/user/document";
import { socket, connectSocket, disconnectSocket } from "@/utils/socket";
import router from "@/router";
import { useSubmissionStore } from "@/stores/user/submission";
import { useAuthStore } from "@/stores/auth";

let initialized = false;

export const initSocket = () => {
  if (initialized) return;
  initialized = true;

  const taskStore = useTaskStore();
  const teamStore = useTeamStore();
  const memberStore = useMemberStore();
  const workspaceStore = UseWorkspaceStore();
  const documentStore = useDocumentStore();
  const submissionStore = useSubmissionStore();

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
  socket.off("submission-created");
  socket.off("submission-updated");
  socket.off("connect");

  socket.on("connect", () => {
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id) {
      socket.emit("join-workspace", { workspace_id, team_id });
    }
  });

  socket.on("task-created", async (data) => {
    taskStore.handleTaskCreated(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("task-updated", async (data) => {
    taskStore.handleTaskUpdated(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("task-deleted", async (data) => {
    taskStore.handleTaskDeleted(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("document-created", async (data) => {
    documentStore.handleDocumentCreated(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("document-updated", async (data) => {
    documentStore.handleDocumentUpdated(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("document-deleted", async (data) => {
    documentStore.handleDocumentDeleted(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("member-joined", async (data) => {
    memberStore.handleMemberJoined(data);
    teamStore.handleMemberJoined(data);
    workspaceStore.handleMemberJoined(data);
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (workspace_id && team_id)
      await teamStore.getActivityTeamStore(workspace_id, team_id);
  });

  socket.on("team-member-removed", async (data) => {
    const authStore = useAuthStore();
    const currentUserId = authStore.getMe?.user_id;

    if (String(currentUserId) === String(data.user_id)) return;
    else {
      const { workspace_id, team_id } = router.currentRoute.value.params;
      if (
        String(workspace_id) !== String(data.workspace_id) ||
        String(team_id) !== String(data.team_id)
      )
        return;

      await teamStore.getTeamByWorkspaceStore(data.workspace_id);
      await teamStore.getTeamByIdStore(data.workspace_id, data.team_id);
      await memberStore.getAllMemberInTeamStore(
        data.workspace_id,
        data.team_id,
      );
      await teamStore.getActivityTeamStore(data.workspace_id, data.team_id);
    }
  });

  socket.on("workspace-updated", async (data) => {
    const { workspace_id, team_id } = router.currentRoute.value.params;
    await workspaceStore.getMyWorkspaceStore();
    if (String(data.workspace_id) === String(workspace_id) && team_id) {
      await teamStore.getActivityTeamStore(data.workspace_id, team_id);
    }
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
    await teamStore.getTeamByWorkspaceStore(data.workspace_id, true);
    await teamStore.getTeamByIdStore(data.workspace_id, data.team_id);
    await teamStore.getActivityTeamStore(data.workspace_id, data.team_id);
  });

  socket.on("submission-created", async (data) => {
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (
      String(workspace_id) === String(data.workspace_id) &&
      String(team_id) === String(data.team_id)
    ) {
      await submissionStore.getAllSubmissionByTeamStore(
        data.workspace_id,
        data.team_id,
      );
      await taskStore.getTaskByTeamStore(
        data.workspace_id,
        data.team_id,
        "",
        true,
      );
      await taskStore.getActivityTeamStore(data.workspace_id, data.team_id);
    }
  });

  socket.on("submission-updated", async (data) => {
    const { workspace_id, team_id } = router.currentRoute.value.params;
    if (
      String(workspace_id) === String(data.workspace_id) &&
      String(team_id) === String(data.team_id)
    ) {
      await taskStore.getTaskByTeamStore(
        data.workspace_id,
        data.team_id,
        "",
        true,
      );
      await taskStore.getMyTaskStore(data.workspace_id, data.team_id, "", true);
      await taskStore.getSummaryTaskStore(
        data.workspace_id,
        data.team_id,
        true,
      );
      await teamStore.getTeamByWorkspaceStore(data.workspace_id, true);
      await taskStore.getActivityTeamStore(data.workspace_id, data.team_id);
    }
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    if (err.message === "Unauthorized" || err.message === "Invalid token") {
      disconnectSocket();
    }
  });

  connectSocket();
};
