import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api/https";

export const useAuthStore = defineStore("auth", () => {
  let user = ref({});
  let token = ref(localStorage.getItem("token"));
  let isLoggedIn = computed(() => !!token.value);
  // console.log(isLoggedIn);

  let getMe = ref({});

  async function login(email, password) {
    try {
      const res = await api.post("/api/login", { email, password });
      user.value = res.data.data;
      console.log(user.value);
      token.value = res.data.data.token;
      localStorage.setItem("token", token.value);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  }

  function logout() {
    user.value = {};
    getMe.value = {};
    token.value = null;
    localStorage.removeItem("token");
  }

  const getMeStore = async () => {
    try {
      const res = await api.get("/api/getMe");
      getMe.value = res.data.data;
      // console.log(getMe.value);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    getMe,
    getMeStore,
  };
});
