import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSubmissionStore = defineStore("submission", () => {
  let getAllSubmissionByTeam = ref([]);
  let loading = ref(true);

  const getAllSubmissionByTeamStore = async (workspace_id, team_id) => {
    try {
      loading.value = true;
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/submissions`,
      );
      //   console.log(res);
      getAllSubmissionByTeam.value = res.data.data.submissions;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get submissions failed");
    } finally {
      loading.value = false;
    }
  };

  const submitTask = async (workspace_id, team_id, task_id, form) => {
    try {
      await api.post(
        `/workspace/${workspace_id}/team/${team_id}/task/${task_id}/submit`,
        form,
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get submissions failed");
    }
  };

  const updateSubmission = async (
    workspace_id,
    team_id,
    submission_id,
    form,
  ) => {
    try {
      await api.put(
        `/workspace/${workspace_id}/team/${team_id}/submission/${submission_id}/status`,
        form,
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get submissions failed");
    }
  };

  return {
    getAllSubmissionByTeam,
    getAllSubmissionByTeamStore,
    loading,
    submitTask,
    updateSubmission
  };
});
