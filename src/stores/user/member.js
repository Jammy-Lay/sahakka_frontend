import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMemberStore = defineStore('members', () => {
  
  const getAllMembers = ref([]);
  const getAllMembersByTeam = ref([]);
  const myWorkspace = ref([]);
  const myCurrentWorkspace = ref({})
  
  const getAllWorkSpaceMembers = async (workdspace_id) => {
    try {
      const res = await api.get(`/workspace/${workdspace_id}/members`);
      console.log(res)
      getAllMembers.value = res.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Get workspace members failed");
    }
  }

  const getAllTeamMembers = async (workspace_id, team_id) => {
    try {
      const res = await api.get(`/workspace/${workspace_id}/team/${team_id}/members`);
      getAllMembersByTeam.value = res.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Get team members failed");
    }
  }

  const getMyWorkspace = async (workspace_id) => {
    try {
      const res = await api.get('/getMyWorkspace');
      
      myWorkspace.value = res.data.data;
      [myCurrentWorkspace.value] = res.data.data?.filter(e => e.workspace_id === Number(workspace_id))
    } catch (error) {
      throw new Error(error.response?.data?.message || "Get my workspace failed");
    }
  }

  const updateRole = async (workspace_id, team_id, user_id, role) => {
    try {
      const res = await api.put(`/workspace/${workspace_id}/team/${team_id}/member/${user_id}/role`, { role });
      
      console.log(res)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Change role failed");
    }
  }
  
  return {
    getAllMembers,
    getAllMembersByTeam,
    myWorkspace,
    myCurrentWorkspace,
    getAllWorkSpaceMembers,
    getAllTeamMembers,
    getMyWorkspace,
    updateRole
  }
})