import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api/https";

export const useAuthStore = defineStore("auth", () => {
  let user = ref(null);
  let token = ref(localStorage.getItem("token"));
  let isLoggedIn = computed(() => !!token.value);
  console.log(isLoggedIn);

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });

      user.value = res.data.data.user;
      token.value = res.data.data.token;
      localStorage.setItem("token", token.value);
      loginSuccess.value = true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  }

  return { user, token, isLoggedIn, login };
});
