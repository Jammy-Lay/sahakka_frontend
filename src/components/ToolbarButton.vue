<template >
  <button @click="action" class="d-flex align-items-stretch gap-1">
    <component :is="icon" size="20" stroke-width="2"/>
    <!-- <span>{{ type }}</span> -->
  </button>
</template>

<script setup>
  defineProps({
    isRounded: Boolean,
    icon: {
      type: [Object, Function],
      required: true
    },
    action : Function,
    type: String,
  });
</script>

<style scoped>
  span {
    font-size: 0.875rem;
    text-wrap: nowrap;
  }
</style>