<template>
  <div class="min-vh-100 overflow-hidden">
    <div class="row g-0">
      <div class="col-lg-6">
        <img
          src="../assets/image/style 1.png"
          alt=""
          class="object-fit-cover w-100 vh-100"
        />
      </div>
      <div class="col-lg-6">
        <div class="d-flex justify-content-center align-items-center min-vh-100">
          <div style="width: 468px">
            <div class="d-flex align-items-center gap-2 mb-4">
              <n-avatar :src="Logo" :size="60" class="bg-white" />
              <h3 class="mb-0 fw-bold">Sahakka</h3>
            </div>

            <h3 class="fw-semibold" style="margin-bottom: 12px">
              Log in to your account
            </h3>
            <h6 class="text-mute mb-6">Enter your account to complete your work.</h6>

            <form @submit.prevent="handleLogin">
              <label class="mb-2 text-dark">Email</label>
              <BaseInput
                input-style="padding: 12px 0"
                input-class="ps-3 rounded-btn text-dark fs-15"
                input-placeholder="Enter email"
                v-model="email"
              />
              <p v-if="err.email" class="text-danger mt-1 fs-14">{{ err.email }}</p>

              <div :class="err.email ? 'mt-3' : 'mt-4'">
                <label class="mb-2 text-dark">Password</label>
                <div class="position-relative">
                  <BaseInput
                    :input-type="showPassword ? 'text' : 'password'"
                    input-style="padding: 12px 0"
                    input-class="ps-3 pe-5 rounded-btn text-dark fs-15"
                    input-placeholder="Enter password"
                    v-model="password"
                  />
                  <span
                    class="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="!showPassword" :size="18" color="#aaa" />
                    <EyeOff v-else :size="18" color="#aaa" />
                  </span>
                </div>
                <p v-if="err.password" class="text-danger mt-1 fs-14">
                  {{ err.password }}
                </p>
              </div>

              <div :class="err.password ? 'mt-3' : 'mt-4'">
                <router-link to="/forgot-password" class="text-dark text-decoration-none">
                  Forgot password?
                </router-link>
              </div>

              <button
                type="submit"
                class="btn bg-btn w-100 mt-4 rounded-btn py-2"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
                {{ isLoading ? "Signing..." : "Sign in" }}
              </button>
            </form>
            <div class="d-flex mt-4 justify-content-center gap-2">
              <p class="text-dark mb-0">Don't have an account?</p>
              <router-link to="/register" class="text-decoration-none"
                >Sign up</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, h } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { isEmail, require, validates } from "@/utils/validate";
import { notify } from "@/utils/toast";
import { useNotification, NButton, NAvatar } from "naive-ui";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useTeamStore } from "@/stores/user/team";
import BaseInput from "@/components/BaseInput.vue";
import Logo from "@/assets/image/image.png";

const notification = useNotification();
const nRef = ref(null);

const email = ref("");
const password = ref("");
const router = useRouter();
const toast = notify(router);
const isLoading = ref(false);
const showPassword = ref(false);
import { jwtDecode } from "jwt-decode";

const auth = useAuthStore();
const workspaceStore = UseWorkspaceStore();
const teamStore = useTeamStore();

const err = reactive({
  email: "",
  password: "",
});

function validate() {
  err.email = validates(email.value, [
    (v) => require(v, "Email is require"),
    (v) => isEmail(v, "Please enter a valid email address."),
  ]);

  err.password = require(password.value, "Password is require");

  return !err.email && !err.password;
}

watch(email, (val) => {
  err.email = validates(val, [
    (v) => require(v, "Email is require"),
    (v) => isEmail(v, "Please enter a valid email address."),
  ]);
});

watch(password, (val) => {
  err.password = require(val, "Password is require");
});

async function handleLogin() {
  if (!validate()) return;

  isLoading.value = true;

  try {
    await auth.login(email.value, password.value);

    // Decode token
    const decoded = jwtDecode(auth.token);

    // console.log("Decoded Token:", decoded);

    // Admin
    if (decoded.role === "admin") {
      toast.success("Signin Successfully", "/admin/dashboard");
      return;
    }

    // Normal User
    const lastVisited = JSON.parse(localStorage.getItem("lastVisited"));

    if (lastVisited) {
      const { workspace_id, team_id } = lastVisited;

      toast.success(
        "Signin Successfully",
        `/workspace/${workspace_id}/team/${team_id}/tasks`
      );

      return;
    }

    await workspaceStore.getMyWorkspaceStore();

    const workspace = workspaceStore.myWorkspaces[0];

    if (workspace) {
      await teamStore.getTeamByWorkspaceStore(workspace.workspace_id);

      const team = teamStore.getTeamByWorkspace[0];

      if (team) {
        router.push(`/workspace/${workspace.workspace_id}/team/${team.team_id}/tasks`);
      }
    }
  } catch (error) {
    const msg = error.message || "";

    if (msg.toLowerCase().includes("email not verify")) {
      nRef.value = notification.warning({
        title: "Email Not Verified",
        content: "Your email hasn't been verified yet. Please check your inbox.",
        duration: 0,
        avatar: () => h(NAvatar, { size: "small", round: true, src: Logo }),
        action: () =>
          h("div", { class: "d-flex gap-2" }, [
            h(
              NButton,
              {
                type: "default",
                size: "small",
                style: "border-radius: 8px;",
                onClick: () => {
                  nRef.value?.destroy();
                  nRef.value = null;
                  window.open("https://mail.google.com", "_blank");
                },
              },
              { default: () => "Go to Mail" }
            ),
            h(
              NButton,
              {
                type: "default",
                size: "small",
                style: "border-radius: 8px;",
                onClick: () => {
                  nRef.value?.destroy();
                  nRef.value = null;
                  router.push("/verify-email?status=resend");
                },
              },
              { default: () => "Resend Link" }
            ),
          ]),
        onClose: () => {
          nRef.value = null;
        },
      });
    } else {
      toast.error(msg || "Sign in fail");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
