import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";

export const useTeamStore = defineStore("team", () => {
  let getTeamSection = ref([]);
  let getTeamByWorkspace = ref([]);
  let getTeamById = ref({});
  let getMember = ref([]);
  let getActivityTeam = ref([]);
  let loading = ref(true);
  let teamDetailLoading = ref(true);
  let activityLoading = ref(true);

  const handleMemberJoined = (data) => {
    const workspace_id = router.currentRoute.value.params.workspace_id;
    const team_id = router.currentRoute.value.params.team_id;
    if (!workspace_id || data.workspace_id != workspace_id) return;

    getTeamByWorkspaceStore(workspace_id, true);
    if (team_id) getTeamByIdStore(workspace_id, team_id);
  };

  const handleProfileUpdated = ({ user_id, name, avatar }) => {
    const patchMembers = (teamObj) => {
      if (!teamObj?.members) return;
      const i = teamObj.members.findIndex(
        (m) => String(m.user_id) === String(user_id),
      );
      if (i !== -1) {
        if (name !== undefined) teamObj.members[i].name = name;
        if (avatar !== undefined) teamObj.members[i].avatar = avatar;
      }
    };

    const patchArray = (arr) => {
      if (!Array.isArray(arr)) return;
      const i = arr.findIndex((m) => String(m.user_id) === String(user_id));
      if (i !== -1) {
        if (name !== undefined) arr[i].name = name;
        if (avatar !== undefined) arr[i].avatar = avatar;
      }
    };

    getTeamByWorkspace.value.forEach(patchMembers);
    patchMembers(getTeamById.value);
    patchArray(getMember.value);
  };

  const getTeamSectionStore = async (team_id) => {
    try {
      const res = await api.get(`/team/${team_id}/sections`);
      getTeamSection.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get team section failed");
    }
  };

  const getTeamByWorkspaceStore = async (workspace_id, silent = false) => {
    try {
      if (!silent) loading.value = true;
      const res = await api.get(`/workspace/${workspace_id}/teams`);
      getTeamByWorkspace.value = res.data.data.team;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get team failed");
    } finally {
      if (!silent) loading.value = false;
    }
  };

  const getTeamByIdStore = async (workspace_id, team_id) => {
    try {
      teamDetailLoading.value = true;
      const res = await api.get(`/workspace/${workspace_id}/team/${team_id}`);
      getTeamById.value = res.data.data;
      getMember.value = res.data.data.members.filter(
        (user) => user.role !== "owner",
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || "Get team failed");
    } finally {
      teamDetailLoading.value = false;
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

  const getActivityTeamStore = async (workspace_id, team_id) => {
    try {
      activityLoading.value = true;
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/activities`,
      );
      getActivityTeam.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Delete team failed");
    } finally {
      activityLoading.value = false;
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
    loading,
    getActivityTeamStore,
    getActivityTeam,
    activityLoading,
    handleMemberJoined,
    handleProfileUpdated,
  };
});
