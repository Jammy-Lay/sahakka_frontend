import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  let getTaskByTeam = ref([]);
  let getIssueTask = ref([]); // bug, improvement
  let getTask = ref([]); // task, feature

  const getTaskByTeamStore = async (workspace_id, team_id, status = "") => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/tasks?status=${status}`,
      );
      const tasks = res.data.data.tasks;

      getTaskByTeam.value = tasks;

      // bug + improvement → getTaskByType
      getIssueTask.value = tasks.filter((t) =>
        ["bug", "improvement"].includes(t.type),
      );

      // task + feature → getTaskByFeature
      getTask.value = tasks.filter((t) => ["task", "feature"].includes(t.type));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get task failed");
    }
  };


  return {
    getTaskByTeam,
    getIssueTask,
    getTask,
    getTaskByTeamStore,
  };
});
