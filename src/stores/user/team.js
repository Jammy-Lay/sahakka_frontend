import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTeamStore = defineStore("team", () => {
  let getTeamSection = ref([]);
  let getTeamByWorkspace = ref([]);
  let getTeamById = ref({});
  let getMember = ref({});

  const getTeamSectionStore = async (team_id) => {
    try {
      const res = await api.get(`/team/${team_id}/sections`);
      getTeamSection.value = res.data.data;
      //   console.log(getTeamSection.value);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get team section failed");
    }
  };

  const getTeamByWorkspaceStore = async (workspace_id) => {
    try {
      const res = await api.get(`/workspace/${workspace_id}/teams`);
      getTeamByWorkspace.value = res.data.data.team;
      // console.log(getTeamByWorkspace.value);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get team failed");
    }
  };

  const getTeamByIdStore = async (workspace_id, team_id) => {
    try {
      const res = await api.get(`/workspace/${workspace_id}/team/${team_id}`);
      getTeamById.value = res.data.data;
      getMember.value = res.data.data.members.filter(
        (user) => user.role !== "owner",
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get team failed");
    }
  };

  const createTeam = async (workspace_id, title, description) => {
    try {
      const res = await api.post(`/workspace/${workspace_id}/team`, {
        title,
        description,
      });

      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Create team failed");
    }
  };
  const updateTeam = async (workspace_id, team_id, title, description) => {
    try {
      const res = await api.put(`/workspace/${workspace_id}/team/${team_id}`, {
        title,
        description,
      });

      // console.log(res.data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Update team failed");
    }
  };
  const deleteTeam = async (workspace_id, team_id) => {
    try {
      const res = await api.delete(
        `/workspace/${workspace_id}/team/${team_id}`,
      );

      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Delete team failed");
    }
  };

  return {
    getTeamSection,
    getTeamSectionStore,
    getTeamByWorkspace,
    getTeamByWorkspaceStore,
    getTeamById,
    getMember,
    getTeamByIdStore,
    createTeam,
    updateTeam,
    deleteTeam,
  };
});
