import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api/https";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import { decodeToken } from "@/utils/jwt.js";

export const useAuthStore = defineStore("auth", () => {
  let user = ref({});
  let loading = ref(true);
  let token = ref(localStorage.getItem("token"));
  let isLoggedIn = computed(() => !!token.value);


  let getMe = ref({});

  async function login(email, password) {
    try {
      const res = await api.post("/login", { email, password });
      user.value = res.data.data;
      token.value = res.data.data.token;
      localStorage.setItem("token", token.value);
      connectSocket();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Sign in failed");
    }
  }

  const logout = async () => {
    try {
      await api.delete("/logout");
    } catch (err) {
      throw new Error(err.response?.data?.message || "Logout failed");
    } finally {
      user.value = {};
      getMe.value = {};
      token.value = null;
      localStorage.removeItem("token");
      disconnectSocket();
    }
  };

  const getMeStore = async () => {
    loading.value = true;
    try {
      const res = await api.get("/getMe");
      getMe.value = res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed");
    } finally{
      loading.value = false;
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.post("/register", { email, password, name });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Sign up failed");
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post("/forgot-password", { email });
      sessionStorage.setItem("forgot_email", email);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Invalid Email");
    }
  };

  const resentOtp = async (email) => {
    try {
      await api.post("/resend-otp", { email });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Resent OTP verification failed",
      );
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      await api.post("/verify-otp", { email, otp });
    } catch (err) {
      throw new Error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const resetPassword = async (email, new_password, confirm_password) => {
    try {
      await api.post("/reset-password", {
        email,
        new_password,
        confirm_password,
      });
    } catch (err) {
      throw new Error(err.response?.data?.message || "Reset password failed");
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
    resentOtp,
    verifyOtp,
    register,
    loading
  };
});
