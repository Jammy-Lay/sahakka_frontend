<template>
  <button class="btn bg-btn text-white px-2 rounded-btn text-nowrap">
    <component v-if="icon" :is="icon" size="14" class="me-1" />
    {{ btnName }}
  </button>
</template>

<script setup>
defineProps({
  btnName: {
    type: String,
    default: "Btn Name",
  },
  icon: {
    type: [Object, Function, String],
    default: null,
  },
});
</script>
