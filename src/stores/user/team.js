import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTeamStore = defineStore("team", () => {
  let getTeamSection = ref([]);
  let getTeamByWorkspace = ref([]);

  const getTeamSectionStore = async (team_id) => {
    try {
      const res = await api.get(`/api/team/${team_id}/sections`);
      getTeamSection.value = res.data.data;
      //   console.log(getTeamSection.value);
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamByWorkspaceStore = async (workspace_id) => {
    try {
      const res = await api.get(`/api/workspace/${workspace_id}/teams`);
      getTeamByWorkspace.value = res.data.data.team;
      console.log(getTeamByWorkspace.value);
    } catch (error) {
      console.log(error);
    }
  };

  return { getTeamSection, getTeamSectionStore, getTeamByWorkspace, getTeamByWorkspaceStore };
});
