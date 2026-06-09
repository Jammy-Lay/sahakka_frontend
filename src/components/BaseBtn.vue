<template>
  <button :disabled="loading" class="btn bg-btn text-white px-2 py-1 rounded-btn text-nowrap">
    <component v-if="icon" :is="icon" size="14" class="me-1" />
    
    <span v-if="loading " class="spinner-border spinner-border-sm me-2"></span>
    {{ loading ? "Loading..." : btnName }}
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
  loading: {
    type: Boolean,
    default: false,
  }
});
</script>
