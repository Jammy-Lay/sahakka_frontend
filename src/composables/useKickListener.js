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

  const handleKickedFromTeam = async ({ workspace_id, team_id }) => {
    const currentWorkspaceId = route.params.workspace_id;
    const currentTeamId = route.params.team_id;

    // refresh workspace + team data
    await workspaceStore.getMyWorkspaceStore();
    await teamStore.getTeamByWorkspaceStore(workspace_id);

    const remainingTeams = teamStore.getTeamByWorkspace;

    if (remainingTeams.length > 0) {
      if (String(currentTeamId) === String(team_id)) {
        router.push(
          `/workspace/${workspace_id}/team/${remainingTeams[0].team_id}/tasks`,
        );
      }
    } else {
      await redirectToFallback();
    }
  };

  const handleKickedFromWorkspace = async ({ workspace_id }) => {
    const currentWorkspaceId = route.params.workspace_id;

    await workspaceStore.getMyWorkspaceStore();

    // only redirect if currently in the affected workspace
    if (String(currentWorkspaceId) === String(workspace_id)) {
      await redirectToFallback();
    }
  };

  const redirectToFallback = async () => {
    const fallbackWorkspace = myWorkspaces.value[0];

    if (!fallbackWorkspace) {
      router.push("/no-workspace");
      return;
    }

    await teamStore.getTeamByWorkspaceStore(fallbackWorkspace.workspace_id);
    const firstTeam = teamStore.getTeamByWorkspace[0];

    if (!firstTeam) {
      router.push("/no-workspace");
      return;
    }

    router.push(
      `/workspace/${fallbackWorkspace.workspace_id}/team/${firstTeam.team_id}/tasks`,
    );
  };

  const startListening = (userId) => {
    socket.on("kicked-from-team", handleKickedFromTeam);
    socket.on("kicked-from-workspace", handleKickedFromWorkspace);
  };

  const stopListening = () => {
    socket.off("kicked-from-team", handleKickedFromTeam);
    socket.off("kicked-from-workspace", handleKickedFromWorkspace);
  };

  return { startListening, stopListening };
}
