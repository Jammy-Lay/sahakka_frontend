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
    await teamStore.getTeamByWorkspaceStore(workspace_id);
    const teams = teamStore.getTeamByWorkspace;

    if (teams && teams.length > 0) {
      router.push(`/workspace/${workspace_id}/team/${teams[0].team_id}/tasks`);
      return true;
    }
    return false;
  };

  const redirectToFallbackWorkspace = async () => {
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
  };

  const handleKickedFromTeam = async ({ workspace_id, team_id }) => {
    const currentWorkspaceId = route.params.workspace_id;
    const currentTeamId = route.params.team_id;

    if (String(currentWorkspaceId) !== String(workspace_id)) return;

    await workspaceStore.getMyWorkspaceStore();
    await teamStore.getTeamByWorkspaceStore(workspace_id);

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
  };

  const handleTeamDeleted = async ({ workspace_id, team_id }) => {
    const currentWorkspaceId = route.params.workspace_id;
    const currentTeamId = route.params.team_id;

    const isViewingDeletedTeam =
      String(currentWorkspaceId) === String(workspace_id) &&
      String(currentTeamId) === String(team_id);

    if (!isViewingDeletedTeam) return;

    await workspaceStore.getMyWorkspaceStore();
    await teamStore.getTeamByWorkspaceStore(workspace_id);

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
  };

  const handleKickedFromWorkspace = async ({ workspace_id }) => {
    const currentWorkspaceId = route.params.workspace_id;

    if (String(currentWorkspaceId) !== String(workspace_id)) return;

    await redirectToFallbackWorkspace();
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
