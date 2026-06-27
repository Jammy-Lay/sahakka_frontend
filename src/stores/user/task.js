import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";

export const useTaskStore = defineStore("task", () => {
  let getTaskByTeam = ref([]);
  let getIssueTask = ref([]);
  let getTask = ref([]);
  let getTaskActivity = ref({});
  let getSummaryTask = ref({});
  let getMyTask = ref([]);
  let getMyIssueTask = ref([]);
  let getMyDailyTask = ref([]);
  let tasksByTeam = ref({});
  let loading = ref(true);
  let tabLoading = ref(false);
  let summaryLoading = ref(true);
  let myTaskLoading = ref(true);

  // Refetch summary and my tasks using current route params
  const refetchOnSocket = () => {
    const workspace_id = router.currentRoute.value.params.workspace_id;
    const team_id = router.currentRoute.value.params.team_id;
    if (!workspace_id || !team_id) return;
    getSummaryTaskStore(workspace_id, team_id, true);
    getMyTaskStore(workspace_id, team_id, "", true);
  };

  const getTaskByTeamStore = async (
    workspace_id,
    team_id,
    status = "",
    silent = false,
    isTabChange = false,
  ) => {
    try {
      if (!silent && !isTabChange) loading.value = true;
      if (isTabChange) tabLoading.value = true;
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/tasks?status=${status}`,
      );
      const tasks = res.data.data.tasks;
      getTaskByTeam.value = tasks;
      getIssueTask.value = tasks.filter((t) =>
        ["bug", "improvement"].includes(t.type),
      );
      getTask.value = tasks.filter((t) => ["task", "feature"].includes(t.type));
      if (!status) tasksByTeam.value[team_id] = tasks;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get task failed");
    } finally {
      if (!silent && !isTabChange) loading.value = false;
      if (isTabChange) tabLoading.value = false;
    }
  };

  const prefetchTeamTasks = async (workspace_id, team_id) => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/tasks`,
      );
      tasksByTeam.value[team_id] = res.data.data.tasks;
    } catch {
      tasksByTeam.value[team_id] = [];
    }
  };

  const createTask = async (workspace_id, team_id, form) => {
    try {
      await api.post(`/workspace/${workspace_id}/team/${team_id}/task`, form);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Create task failed");
    }
  };

  const deleteTask = async (workspace_id, team_id, task_id) => {
    try {
      await api.delete(
        `/workspace/${workspace_id}/team/${team_id}/task/${task_id}`,
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Delete task failed");
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

  const getSummaryTaskStore = async (workspace_id, team_id, silent = false) => {
    try {
      if (!silent) summaryLoading.value = true;
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/my-tasks/summary`,
      );
      getSummaryTask.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get summary task failed");
    } finally {
      if (!silent) summaryLoading.value = false;
    }
  };

  const getMyTaskStore = async (
    workspace_id,
    team_id,
    status = "",
    silent = false,
    isTabChange = false,
  ) => {
    try {
      if (!silent && !isTabChange) myTaskLoading.value = true;
      if (isTabChange) tabLoading.value = true;
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/my-tasks?status=${status}`,
      );
      const tasks = res.data.data;
      getMyTask.value = tasks;
      getMyIssueTask.value = tasks.filter((t) =>
        ["bug", "improvement"].includes(t.type),
      );
      getMyDailyTask.value = tasks.filter((t) =>
        ["task", "feature"].includes(t.type),
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get my task failed");
    } finally {
      if (!silent && !isTabChange) myTaskLoading.value = false;
      if (isTabChange) tabLoading.value = false;
    }
  };

  const handleTaskCreated = (newTask) => {
    getTaskByTeam.value.unshift(newTask);
    if (["bug", "improvement"].includes(newTask.type))
      getIssueTask.value.unshift(newTask);
    if (["task", "feature"].includes(newTask.type))
      getTask.value.unshift(newTask);
    refetchOnSocket();
  };

  const handleTaskUpdated = (updatedTask) => {
    const updateList = (list) => {
      const i = list.value.findIndex((t) => t.id === updatedTask.id);
      if (i !== -1) list.value[i] = updatedTask;
    };
    updateList(getTaskByTeam);
    updateList(getIssueTask);
    updateList(getTask);
    updateList(getMyTask);
    updateList(getMyIssueTask);
    updateList(getMyDailyTask);
    refetchOnSocket();
  };

  const handleTaskDeleted = ({ task_id }) => {
    const filterOut = (list) =>
      (list.value = list.value.filter((t) => t.id !== task_id));
    filterOut(getTaskByTeam);
    filterOut(getIssueTask);
    filterOut(getTask);
    filterOut(getMyTask);
    filterOut(getMyIssueTask);
    filterOut(getMyDailyTask);
    refetchOnSocket();
  };

  return {
    getTaskByTeam,
    getIssueTask,
    getTask,
    getTaskActivity,
    getSummaryTask,
    getMyTask,
    getMyIssueTask,
    getMyDailyTask,
    tasksByTeam,
    loading,
    tabLoading,
    summaryLoading,
    myTaskLoading,
    getTaskByTeamStore,
    prefetchTeamTasks,
    createTask,
    deleteTask,
    getTaskActivityStore,
    updateTask,
    getSummaryTaskStore,
    getMyTaskStore,
    handleTaskCreated,
    handleTaskUpdated,
    handleTaskDeleted,
  };
});
