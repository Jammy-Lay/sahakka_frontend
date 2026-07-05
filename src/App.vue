<script setup>
import { onMounted, onUnmounted } from "vue";
import { initSocket } from "./services/socketService";
import { useKickListener } from "@/composables/useKickListener";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);
const { startListening, stopListening } = useKickListener();

onMounted(async () => {
  initSocket();
  await authStore.getMeStore();
  if (getMe.value?.user_id) {
    startListening();
  }
});

onUnmounted(() => {
  stopListening();
});
</script>

<template>
  <div>
      <router-view />
  </div>
</template>