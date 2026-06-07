<template>
  <div>
    <input
      :type="inputType"
      class="base-input form-control"
      :class="inputClass"
      :style="inputStyle"
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
  inputClass: {
    type: String,
    default: "",
  },
  inputStyle: {
    type: [String, Object],
    default: "",
  },
});
</script>

<style scoped>
.base-input {
  border: 1.5px solid #e4e4e7;
  transition: border-color 0.2s ease;
  box-shadow: none !important;
}

.base-input:focus {
  border-color: grey !important;
  box-shadow: none !important;
  outline: none !important;
}

input.base-input:disabled,
input.base-input[disabled] {
  background-color: #fff !important;
  cursor: not-allowed;
}
</style>
