 
import { defineStore } from "pinia";
import api from "@/api/https";
import { ref } from "vue";

export const useActivityStore = defineStore("activity", () => {
  //data member
  const teamActivity = ref([]);

  const getTeamActivity = async (workspace_id, team_id) => {
    try {
      const url = `/workspace/${workspace_id}/team/${team_id}/activities`;
      const res = await api.get(url);
      teamActivity.value = res.data || [];
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Can't Get Team Activity");
    }
  };
  // return
  return {
    teamActivity,
    getTeamActivity,
  };
});
