<!-- src/views/NoWorkspaceView.vue -->
<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center">
    <div class="text-center">
      <h4 class="fw-semibold mb-2">No Workspace Found</h4>
      <p class="text-muted mb-4">You don't have a workspace yet. Ask your friend to invite you or create one.</p>
      <button class="btn btn-outline-secondary" @click="handleLogout">Sign out</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>