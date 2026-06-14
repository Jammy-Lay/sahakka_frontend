import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  let getTaskByTeam = ref([]);
  let getIssueTask = ref([]); // bug, improvement
  let getTask = ref([]); // task, feature
  let getTaskActivity = ref([]);
  let getSummaryTask = ref({});

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

  const createTask = async (workspace_id, team_id, form) => {
    try {
      await api.post(`/workspace/${workspace_id}/team/${team_id}/task`, form);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Create task failed");
    }
  };

  const getTaskActivityStore = async (workspace_id, team_id, task_id) => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/task/${task_id}/activities`,
      );
      getTaskActivity.value = res.data.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Get task activity failed",
      );
    }
  };

  const updateTask = async (workspace_id, team_id, task_id, form) => {
    try {
      await api.put(
        `/workspace/${workspace_id}/team/${team_id}/task/${task_id}`,
        form,
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Update task failed");
    }
  };

  const getSummaryTaskStore = async (workspace_id, team_id) => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/my-tasks/summary`,
      );
      getSummaryTask.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get summary task failed");
    }
  };

  return {
    getTaskByTeam,
    getIssueTask,
    getTask,
    getTaskActivity,
    getSummaryTask,
    getTaskByTeamStore,
    createTask,
    getTaskActivityStore,
    updateTask,
    getSummaryTaskStore,
  };
});
