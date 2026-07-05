import { socket } from "@/utils/socket";
import { useRouter, useRoute } from "vue-router";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useTeamStore } from "@/stores/user/team";
import { storeToRefs } from "pinia";

export function useKickListener() {
  const router = useRouter();
  const route = useRoute();
  const workspaceStore = UseWorkspaceStore();
  const teamStore = useTeamStore();
  const { myWorkspaces } = storeToRefs(workspaceStore);

  const redirectToFirstTeam = async (workspace_id) => {
    try {
      await teamStore.getTeamByWorkspaceStore(workspace_id);
      const teams = teamStore.getTeamByWorkspace;

      if (teams && teams.length > 0) {
        router.push(
          `/workspace/${workspace_id}/team/${teams[0].team_id}/tasks`,
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error(
        `[useKickListener] redirectToFirstTeam failed for workspace ${workspace_id}:`,
        err,
      );
      return false; // treat as "no usable team here", keep the fallback loop going
    }
  };

  const redirectToFallbackWorkspace = async () => {
    try {
      await workspaceStore.getMyWorkspaceStore();
      const workspaces = myWorkspaces.value;

      if (!workspaces || workspaces.length === 0) {
        router.push("/no-workspace");
        return;
      }

      for (const ws of workspaces) {
        const redirected = await redirectToFirstTeam(ws.workspace_id);
        if (redirected) return;
      }

      router.push("/no-workspace");
    } catch (err) {
      console.error(
        "[useKickListener] redirectToFallbackWorkspace failed:",
        err,
      );
      router.push("/no-workspace"); // fail-safe: always land somewhere instead of hanging
    }
  };

  const handleKickedFromTeam = async ({ workspace_id, team_id }) => {
    try {
      await workspaceStore.getMyWorkspaceStore();
      await teamStore.getTeamByWorkspaceStore(workspace_id);

      const currentWorkspaceId = route.params.workspace_id;
      const currentTeamId = route.params.team_id;

      if (String(currentWorkspaceId) !== String(workspace_id)) return;
      if (String(currentTeamId) !== String(team_id)) return;

      const remainingTeams = teamStore.getTeamByWorkspace;
      const filteredTeams = remainingTeams?.filter(
        (t) => String(t.team_id) !== String(team_id),
      );

      if (filteredTeams && filteredTeams.length > 0) {
        router.push(
          `/workspace/${workspace_id}/team/${filteredTeams[0].team_id}/tasks`,
        );
      } else {
        await redirectToFallbackWorkspace();
      }
    } catch (err) {
      console.error("[useKickListener] handleKickedFromTeam failed:", err);
      await redirectToFallbackWorkspace();
    }
  };

  const handleTeamDeleted = async ({ workspace_id, team_id }) => {
    try {
      await workspaceStore.getMyWorkspaceStore();
      await teamStore.getTeamByWorkspaceStore(workspace_id);

      const currentWorkspaceId = route.params.workspace_id;
      const currentTeamId = route.params.team_id;

      const isViewingDeletedTeam =
        String(currentWorkspaceId) === String(workspace_id) &&
        String(currentTeamId) === String(team_id);

      if (!isViewingDeletedTeam) return;

      const remainingTeams = teamStore.getTeamByWorkspace;
      const filteredTeams = remainingTeams?.filter(
        (t) => String(t.team_id) !== String(team_id),
      );

      if (filteredTeams && filteredTeams.length > 0) {
        router.push(
          `/workspace/${workspace_id}/team/${filteredTeams[0].team_id}/tasks`,
        );
      } else {
        await redirectToFallbackWorkspace();
      }
    } catch (err) {
      console.error("[useKickListener] handleTeamDeleted failed:", err);
      await redirectToFallbackWorkspace();
    }
  };

  const handleKickedFromWorkspace = async ({ workspace_id }) => {
    try {
      await workspaceStore.getMyWorkspaceStore();

      const currentWorkspaceId = route.params.workspace_id;
      if (String(currentWorkspaceId) !== String(workspace_id)) return;

      await redirectToFallbackWorkspace();
    } catch (err) {
      console.error("[useKickListener] handleKickedFromWorkspace failed:", err);
      router.push("/no-workspace");
    }
  };

  const startListening = () => {
    socket.on("kicked-from-team", handleKickedFromTeam);
    socket.on("kicked-from-workspace", handleKickedFromWorkspace);
    socket.on("team-deleted", handleTeamDeleted);
  };

  const stopListening = () => {
    socket.off("kicked-from-team", handleKickedFromTeam);
    socket.off("kicked-from-workspace", handleKickedFromWorkspace);
    socket.off("team-deleted", handleTeamDeleted);
  };

  return { startListening, stopListening };
}
