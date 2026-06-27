<script setup>
import { onMounted } from "vue";
import { initSocket } from "./services/socketService";

onMounted(() => {
  initSocket();
});
</script>

<template>
  <div>
      <router-view />
  </div>
</template>
