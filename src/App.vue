<script setup>
import { NNotificationProvider } from "naive-ui";
// import { onMounted } from "vue";
// import { initSocket } from "../services/socketService";

// onMounted(() => {
//   initSocket();
// });
</script>

<template>
  <div>
    <n-notification-provider>
      <router-view />
    </n-notification-provider>
  </div>
</template>
