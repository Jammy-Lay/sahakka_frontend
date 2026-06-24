<template>
  <main class="main bg-body">
    <div class="page-header">
      <h1 class="page-title">Password setting</h1>
      <p class="page-sub text-muted">Change password</p>
    </div>

    <!-- Security Tip Banner -->
    <div class="security-tip-banner">
      <alert-circle size="16" class="tip-icon" />
      <span>Security Tip: Use a unique password not used on other sites.</span>
    </div>

    <!-- Password Card Centering Layout Wrapper -->
    <div class="form-container">
      <div class="card password-card">
        <h2 class="card-title-form">Change password</h2>

        <form @submit.prevent="handleChangePassword">
          <!-- Old Password -->
          <div class="form-group">
            <label class="form-label">Current password</label>
            <input
              type="password"
              class="text-input"
              v-model="form.currentPassword"
              placeholder="current password"
            />
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label class="form-label">New password</label>
            <input
              type="password"
              class="text-input"
              v-model="form.newPassword"
              placeholder="New password"
              @input="validatePassword"
            />
          </div>

          <!-- Password Requirements Indicators -->
          <div class="requirements-box">
            <div class="requirement-item" :class="{ met: validation.length }">
              <CircleCheck size="14" class="status-icon" />
              <span>At least 8 characters</span>
            </div>
            <div class="requirement-item" :class="{ met: validation.number }">
              <CircleCheck size="14" class="status-icon" />
              <span>Contains a number</span>
            </div>
            <div class="requirement-item" :class="{ met: validation.special }">
              <CircleCheck size="14" class="status-icon" />
              <span>Contains a special character (!@#$%^&*)</span>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="form-group">
            <label class="form-label">Confirm new password</label>
            <input
              type="password"
              class="text-input"
              v-model="form.confirmPassword"
              placeholder="Confirm new password"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="save-btn font-medium"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            />
            {{ isLoading ? "Changing..." : "Change password" }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useProfileStore } from "@/stores/profile/profile";
import { notify } from "@/utils/toast";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const profileStore = useProfileStore();
const toast = notify(router);
let isLoading = ref(false);

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const validation = reactive({
  length: false,
  number: false,
  special: false,
});

const validatePassword = () => {
  validation.length = form.newPassword.length >= 8;
  validation.number = /\d/.test(form.newPassword);
  validation.special = /[!@#$%^&*]/.test(form.newPassword);
};

const handleChangePassword = async () => {
  isLoading.value = true;
  try {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Password is required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await profileStore.ChangePassword(
      form.currentPassword,
      form.newPassword,
      form.confirmPassword
    );
    toast.success("Password changed successfully");

    form.currentPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";
  } catch (err) {
    toast.error(err.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Main View Area ── */
.main {
  flex: 1;
  padding: 32px 40px;
  height: 100%;
  overflow-y: auto;
}

.page-title {
  font-size: 30px;
  font-weight: 500;
  color: #09090b;
  line-height: 100%;
  letter-spacing: -2.5%;
}

.page-sub {
  font-size: 16px;
  font-weight: 400;
  color: #71717a;
  margin-top: 4px;
  margin-bottom: 20px;
}

/* ── Mockup Banner ── */
.security-tip-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  color: #71717a;
  margin-bottom: 40px;
  width: 100%;
}

.tip-icon {
  color: #f59e0b;
  flex-shrink: 0;
}

/* ── Centered Card Module Layout ── */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 60px;
}

.password-card {
  background: #ffffff;
  width: 100%;
  max-width: 460px;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.card-title-form {
  font-size: 24px;
  font-weight: 500;
  color: #09090b;
  margin-bottom: 24px;
  letter-spacing: -0.6px;
  line-height: 24px;
}

/* ── Forms Infrastructure ── */
.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 400;
  color: #1e1e1e;
  margin-bottom: 8px;
}

.text-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 400;
  color: #18181b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #ffffff;
}

.text-input:focus {
  border-color: #d9d9d9;
}

.text-input::placeholder {
  color: #b3b3b3;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 100%;
}

/* ── Requirement Checklists ── */
.requirements-box {
  margin: -6px 0 20px 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  /* Default inactive grey/blue state */
  transition: color 0.2s ease;
}

.status-icon {
  color: #cbd5e1;
  fill: #f1f5f9;
  transition: color 0.2s, fill 0.2s;
}

/* When parameters met */
.requirement-item.met {
  color: #4b5563;
}

.requirement-item.met .status-icon {
  color: #22c55e;
  fill: #f0fdf4;
}

/* ── Forgot link Layout ── */
.forgot-password-wrap {
  margin-bottom: 24px;
  text-align: left;
}

.forgot-link {
  font-size: 13px;
  font-weight: 500;
  color: #18181b;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* ── Primary Action Button ── */
.save-btn {
  width: 100%;
  padding: 14px;
  background: #171717;
  color: #fafafa;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s;
}

.save-btn:hover {
  background: #262626;
}
</style>
