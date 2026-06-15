import { defineStore } from "pinia";
import api from "@/api/https";
import { ref } from "vue";

export const useActivityStore = defineStore("activity", () => {
  //data member
  const taskActivity = ref([]);
  const teamActivity = ref([]);

  // method
  const getTaskActivity = async (workspace_id, team_id, task_id) => {
    try {

      const url = `/workspace/${workspace_id}/team/${team_id}/task/${task_id}/activities`;
      const res = await api.get(url);
      taskActivity.value = res.data || [];
      return res.data;

    } catch (err) {
      throw new Error(err.response?.data?.message || "Can't Get Task Activity");
    }
  };
  
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

  // Helper method to format activity data
  const formatActivity = (activity) => {
    const activityTypes = {
      'create': { class: 'bg-green text-green', icon: '+', text: 'Create' },
      'assign': { class: 'bg-blue text-blue', icon: '+', text: 'Assign' },
      'update': { class: 'bg-orange text-orange', icon: '+', text: 'Update' },
      'delete': { class: 'bg-red text-red', icon: '-', text: 'Delete' },
      'complete': { class: 'bg-purple text-purple', icon: '✓', text: 'Complete' }
    };
    
    const type = activity.type?.toLowerCase() || 'update';
    const config = activityTypes[type] || activityTypes.update;
    
    return {
      id: activity.id,
      buttonText: config.text,
      buttonIcon: config.icon,
      buttonClass: config.class,
      userName: activity.user?.name || activity.user_name || 'Unknown User',
      userAvatar: activity.user?.avatar || '/src/assets/image/default-avatar.jpg',
      timeAgo: formatTimeAgo(activity.created_at),
      description: activity.description || activity.message || 'No description',
      rawData: activity
    };
  };

  // Helper to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Debug method to check API connection
  const testApiConnection = async (workspace_id, team_id) => {
    try {

      const testUrl = `/workspace/${workspace_id}/team/${team_id}/activities`;
      
      const res = await api.get(testUrl);
      return true;

    } catch (err) {
      return false;
    }
  };

  // return
  return {
    taskActivity,
    teamActivity,
    getTaskActivity,
    getTeamActivity,
    formatActivity,
    formatTimeAgo,
    testApiConnection
  };
});