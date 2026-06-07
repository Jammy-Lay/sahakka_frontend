import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api/https";

export const useAuthStore = defineStore("auth", () => {
  let user = ref({});
  let token = ref(localStorage.getItem("token"));
  let isLoggedIn = computed(() => !!token.value);
  let ForgotEmail = ref("");
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

  const logout = async () => {
    try {
      await api.delete("/api/logout");
      user.value = {};
      getMe.value = {};
      token.value = null;
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    }
  };

  const getMeStore = async () => {
    try {
      const res = await api.get("/api/getMe");
      getMe.value = res.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.post("/api/register", { email, password, name });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/api/forgot-password", { email });
      ForgotEmail.value = email;
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Forgot password failed");
    }
  };
  const otp = async (email, otp) => {
    try {
      const res = await api.post("/api/verify-otp", { email, otp });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Otp verification failed");
    }
  };
  const resetPassword = async (email, new_password, confirm_password) => {
    if (new_password != confirm_password) {
      throw new Error("Passwords do not match");
    }

    try {
      const res = await api.post("/api/reset-password", {
        email,
        new_password,
        confirm_password,
      });
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Reset password failed";
      console.error("Auth Service Error:", errorMessage);
      throw new Error(errorMessage);
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
    forgotPassword,
    resetPassword,
    otp,
    ForgotEmail,
    register,
  };
});
