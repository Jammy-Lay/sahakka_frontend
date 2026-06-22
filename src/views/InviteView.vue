<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center bg-body">
    <div class="text-center bg-white p-5 rounded-4" style="width: 460px">
      <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
        <img src="../assets/image/image.png" alt="" style="width: 60px; height: 60px" />
        <h3 class="fw-bold mb-0">Sahakka</h3>
      </div>

      <h4 class="fw-semibold">You got invited</h4>
      <p class="text-mute fs-14">You have been invited to join this team.</p>
      <button
        v-if="showButton"
        class="btn bg-btn w-100 rounded-btn py-2"
        @click="joinTeam"
      >
        Join Team
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useInviteStore } from "@/stores/user/invite";
import { notify } from "@/utils/toast";

const route = useRoute();
const router = useRouter();
const toast = notify(router);

const auth = useAuthStore();
const inviteStore = useInviteStore();

const token = ref("");
const loading = ref(false);
const showButton = ref(false);

const status = computed(() => route.query.status || "");

onMounted(() => {
  token.value = route.query.token;

  if (status.value) {
    return;
  }

  if (!token.value) {
    router.push("/");
    return;
  }

  if (!auth.token) {
    router.push(`/login?invite=${token.value}`);

    return;
  }

  showButton.value = true;
});

async function joinTeam() {
  try {
    loading.value = true;

    const result = await inviteStore.joinInvite(token.value);

    toast.success(
      "Joined successfully",
      `/workspace/${result.data.workspace_id}/team/${result.data.team_id}/tasks`
    );
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}
</script>
