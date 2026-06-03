<template>
  <div>
    <input
      :type="inputType"
      class="form-control bg-transparent fs-text ps-7 py-2"
      :placeholder="inputPlaceholder"
      v-model="model"
      :disabled="isDisabled"
    />
  </div>
</template>

<script setup>
const model = defineModel();
defineProps({
  inputType: {
    type: String,
    default: "text",
  },
  inputPlaceholder: {
    type: String,
    default: "",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped></style>
