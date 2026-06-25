import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMemberStore = defineStore("members", () => {
  let getAllMemberInWorkspace = ref([]);
  let getAllMemberInTeam = ref([]);

  const getAllMemberInWorkspaceStore = async (workspace_id) => {
    try {
      const res = await api.get(`/workspace/${workspace_id}/members`);
      getAllMemberInWorkspace.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get members failed");
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
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/members`,
      );
      getAllMemberInTeam.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get members failed");
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
  };
});
