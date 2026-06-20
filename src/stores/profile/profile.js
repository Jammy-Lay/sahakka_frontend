import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api/https";

export const useProfileStore = defineStore("profile", () => {
  let user = ref({});
  const myWorkspaces = ref([]);
  let WorkspaceMember = ref({});
  let joinedWorkspaces = ref([]);
  let getAllWorkspace  = ref({});
  // let count_team = ref({});
  // let count_member = ref({});
  let token = ref(localStorage.getItem("token"));
  // let isLoggedIn = computed(() => !!token.value);
  const getProfile = async () => {
    try {
      const res = await api.get("/getMe", { token });
      user.value = res.data.data;
      // console.log(res.data);
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed");
    }
  };
  const UpdateName = async (name) => {
    try {
      const res = await api.put("/change-name", { name });
      user.value.name = name;
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed");
    }
  };
  const GetTaskSummary = async (workspace_id, team_id) => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/my-tasks/summary`,
      );

      console.log("Task API:", res.data);
      return res.data.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const GetMyWorkspace = async () => {
    try {
      const res = await api.get("/getMyWorkspace");
      const data = res.data.data;
      myWorkspaces.value = data.filter((w) => w.my_role === "owner");
      joinedWorkspaces.value = data.filter(
        (w) => w.my_role === "member" || w.my_role === "moderator",
      );
      getAllWorkspace.value = data;
    } catch (error) {
      console.log(error);
    }
  };
  const GetWorkspaceMember = async (workspace_id) => {
    try {
      const res = await api.get(`/workspace/${workspace_id}/teams`, {
        token,
      });
      WorkspaceMember.value = res.data.data;
      return res.data.data  ;
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed");
    }
  };
  const ChangePassword = async (
    currentPassword,
    newPassword,
    confirmPassword,
  ) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    try {
      const res = await api.post(`/change-password`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      console.log(res.data.data);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed");
    }
  };
  const UpdateAvatar = async (formData) => {
    try {
      const response = await api.put("/change-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update avatar");
    }
  };
  return {
    user,
    myWorkspaces,
    WorkspaceMember,
    joinedWorkspaces,
    getAllWorkspace,
    getProfile,
    UpdateName,
    GetTaskSummary,
    GetMyWorkspace,
    GetWorkspaceMember,
    ChangePassword,
    UpdateAvatar,
  };
import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGetProfile = defineStore("profile", () => {
    let loading = ref(true)
    async function changeProfile(avatar) {
        loading.value = true;
        try {
            await api.put("/change-avatar", avatar);
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something is wrong");
        } finally {
            loading.value = false;
        }
    }

    async function changeName(name) {
        loading.value = true;
        try {
            await api.put("/change-name", name);
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something is wrong");
        } finally{
            loading.value = false;
        }
    }
    async function resetAvatar() {
        loading.value = true;
        try {
            await api.delete("/delete-avatar");
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something went wrong");
        } finally{
            loading.value = false;
        }
    }
    return {
        changeProfile,
        resetAvatar,
        changeName,
        loading
    };
});
