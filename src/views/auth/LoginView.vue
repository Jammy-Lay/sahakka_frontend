<template>
  <div class="min-vh-100 overflow-hidden">
    <div class="row g-0">
      <div class="col-lg-6">
        <img
          src="../../assets/image/style 1.png"
          alt=""
          class="object-fit-cover w-100 vh-100 d-none d-lg-block"
        />
      </div>
      <div class="col-lg-6">
        <div class="d-flex justify-content-center align-items-center min-vh-100 p-5">
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
              <label class="mb-2 text-dark required">Email</label>
              <BaseInput
                input-style="padding: 12px 0"
                input-class="ps-3 rounded-btn text-dark fs-15"
                input-placeholder="Enter email"
                v-model="email"
              />
              <p v-if="err.email" class="text-danger mt-1 fs-14">{{ err.email }}</p>

              <div :class="err.email ? 'mt-3' : 'mt-4'">
                <label class="mb-2 text-dark required">Password</label>
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
import { reactive, ref, watch } from "vue";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { isEmail, require, validates } from "@/utils/validate";
import { notify } from "@/utils/toast";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useTeamStore } from "@/stores/user/team";
import BaseInput from "@/components/BaseInput.vue";
import Logo from "@/assets/image/image.png";
import { useInviteStore } from "@/stores/user/invite";

const email = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();
const toast = notify(router);
const isLoading = ref(false);
const showPassword = ref(false);

const auth = useAuthStore();
const workspaceStore = UseWorkspaceStore();
const teamStore = useTeamStore();
const inviteStore = useInviteStore();

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

    const decoded = jwtDecode(auth.token);

    if (decoded.role === "admin") {
      toast.success("Signin Successfully", "/admin/dashboard");
      return;
    }

    const inviteToken = route.query.invite;
    if (inviteToken) {
      router.push(`/invite?token=${inviteToken}`);
      return;
    }

    const userId = decoded.id;
    const lastVisited = JSON.parse(localStorage.getItem(`lastVisited_${userId}`));

    await workspaceStore.getMyWorkspaceStore();

    if (lastVisited?.workspace_id && lastVisited?.team_id) {
      const workspaceStillValid = workspaceStore.getAllWorkspace.find(
        (w) => String(w.workspace_id) === String(lastVisited.workspace_id)
      );

      if (workspaceStillValid) {
        await teamStore.getTeamByWorkspaceStore(lastVisited.workspace_id);
        const teamStillValid = teamStore.getTeamByWorkspace.find(
          (t) => String(t.team_id) === String(lastVisited.team_id)
        );

        if (teamStillValid) {
          toast.success(
            "Signin Successfully",
            `/workspace/${lastVisited.workspace_id}/team/${lastVisited.team_id}/tasks`
          );
          return;
        }
      }

      localStorage.removeItem(`lastVisited_${userId}`);
    }

    const workspace = workspaceStore.getAllWorkspace[0];
    if (!workspace) {
      toast.success("Signin Successfully", "/no-workspace");
      return;
    }

    await teamStore.getTeamByWorkspaceStore(workspace.workspace_id);
    const team = teamStore.getTeamByWorkspace[0];

    if (!team) {
      toast.success("Signin Successfully", "/no-workspace");
      return;
    }

    toast.success(
      "Signin Successfully",
      `/workspace/${workspace.workspace_id}/team/${team.team_id}/tasks`
    );
  } catch (error) {
    if (error.message === "Email not verify") {
      router.push("/not-verify");
    }
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
