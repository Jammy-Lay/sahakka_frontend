<template >
  <n-button :round="isRounded" @click="action" :type="type">
    <component :is="icon" size="20"></component>
  </n-button>
</template>

<script setup>
  defineProps({
    isRounded: Boolean,
    icon: {
      type: [Object, Function],
      required: true
    },
    action : Function,
    type: String
  });
</script>

<style scoped>
  
</style>