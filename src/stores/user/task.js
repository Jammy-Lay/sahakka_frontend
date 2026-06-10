import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  let getTaskByTeam = ref([]);

  const getTaskByTeamStore = async (workspace_id, team_id, status = "") => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/tasks?status=${status}`,
        { workspace_id, team_id, status },
      );
      getTaskByTeam.value = res.data.data.tasks;
      // console.log(getTaskByTeam.value);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get task failed");
    }
  };

  return { getTaskByTeam, getTaskByTeamStore };
});
