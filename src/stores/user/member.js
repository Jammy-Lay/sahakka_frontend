import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";
import { UseWorkspaceStore } from "./workspace";

export const useMemberStore = defineStore("members", () => {
  let getAllMemberInWorkspace = ref([]);
  let getAllMemberInTeam = ref([]);
  let loading = ref(true);
  let selectedTeamId = ref(null);

  const handleMemberJoined = (data) => {
    const workspace_id = router.currentRoute.value.params.workspace_id;
    const team_id = router.currentRoute.value.params.team_id;
    if (!workspace_id || data.workspace_id != workspace_id) return;

    const workspaceStore = UseWorkspaceStore();
    const currentWorkspace = workspaceStore.getAllWorkspace.find(
      (w) => w.workspace_id == workspace_id,
    );
    
    const isOwner = currentWorkspace?.my_role === "owner";

    if (isOwner) {
      getAllMemberInWorkspaceStore(workspace_id);
    }

    if (team_id) getAllMemberInTeamStore(workspace_id, team_id);
  };

  const getAllMemberInWorkspaceStore = async (workspace_id) => {
    try {
      loading.value = true;
      const res = await api.get(`/workspace/${workspace_id}/members`);
      getAllMemberInWorkspace.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get members failed");
    } finally {
      loading.value = false;
    }
  };

  const updateRole = async (workspace_id, team_id, user_id, role) => {
    try {
      await api.put(
        `/workspace/${workspace_id}/team/${team_id}/member/${user_id}/role`,
        role,
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Update role failed");
    }
  };

  const removeFromWorkspace = async (workspace_id, user_id) => {
    try {
      await api.delete(`/workspace/${workspace_id}/member/${user_id}`);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Remove member failed");
    }
  };

  const getAllMemberInTeamStore = async (workspace_id, team_id) => {
    try {
      loading.value = true;
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/members`,
      );
      getAllMemberInTeam.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get members failed");
    } finally {
      loading.value = false;
    }
  };

  const removeFromTeam = async (workspace_id, team_id, user_id) => {
    try {
      await api.delete(
        `/workspace/${workspace_id}/team/${team_id}/member/${user_id}`,
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Remove member failed");
    }
  };

  return {
    getAllMemberInWorkspace,
    getAllMemberInTeam,
    getAllMemberInWorkspaceStore,
    updateRole,
    removeFromWorkspace,
    getAllMemberInTeamStore,
    removeFromTeam,
    loading,
    handleMemberJoined,
    selectedTeamId,
  };
});
