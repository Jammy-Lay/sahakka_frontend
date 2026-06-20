import api from "@/api/https";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const UseWorkspaceStore = defineStore("workspace", () => {
  let loading = ref(true);
  let myWorkspaces = ref([]);
  let joinedWorkspaces = ref([]);
  let getAllWorkspace = ref([]);
  let currentWorkspaceId = ref(null);
  let lastVisitedTeam = ref(
    JSON.parse(localStorage.getItem("lastVisitedTeam")) ?? {},
  );

  const currentWorkspace = computed(() => {
    return (
      getAllWorkspace.value.find(
        (w) => w.workspace_id == currentWorkspaceId.value,
      ) ?? null
    );
  });

  const setLastVisitedTeam = (workspace_id, team_id, user_id) => {
    lastVisitedTeam.value[workspace_id] = team_id;
    localStorage.setItem(
      "lastVisitedTeam",
      JSON.stringify(lastVisitedTeam.value),
    );

    // only save with userId, no fallback needed
    if (user_id) {
      localStorage.setItem(
        `lastVisited_${user_id}`,
        JSON.stringify({ workspace_id, team_id }),
      );
    }

    // clean up old key forever
    localStorage.removeItem("lastVisited");
  };

  const getMyWorkspaceStore = async () => {
    try {
      loading.value = true;
      const res = await api.get("/getMyWorkspace");
      const data = res.data.data;
      myWorkspaces.value = data.filter((w) => w.my_role === "owner");
      joinedWorkspaces.value = data.filter(
        (w) => w.my_role === "member" || w.my_role === "moderator",
      );
      getAllWorkspace.value = data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get Workspace failed");
    } finally {
      loading.value = false;
    }
  };

  const leaveWorkspace = async (workspace_id, user_id) => {
    try {
      await api.delete(`/workspace/${workspace_id}/leave/${user_id}`);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get Workspace failed");
    }
  };

  return {
    loading,
    myWorkspaces,
    joinedWorkspaces,
    getAllWorkspace,
    currentWorkspaceId,
    currentWorkspace,
    lastVisitedTeam,
    setLastVisitedTeam,
    getMyWorkspaceStore,
    leaveWorkspace
  };
});
