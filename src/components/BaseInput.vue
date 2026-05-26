<template>
  <div>
    <div class="position-relative text-secondary mb-2">
      <input
        :type="inputType"
        class="form-control bg-transparent fs-text ps-7 py-2"
        :placeholder="inputPlaceholder"
        v-model="model"
        :disabled="isDisabled"
      />
      <component
        :is="inputIcon"
        size="20"
        class="position-absolute icon-input tran-y"
      />
    </div>
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
  inputIcon: {
    type: String,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.tran-y {
  transform: translateY(-50%);
}

.icon-input {
  position: absolute;
  top: 50%;
  left: 18px;
  font-size: 18px;
}

.icon-eye {
  position: absolute;
  top: 50%;
  right: 18px;
  font-size: 18px;
  cursor: pointer;
}
</style>
