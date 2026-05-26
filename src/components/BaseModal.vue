<template>
  <div>
    <div
      class="modal d-block"
      tabindex="-1"
      aria-hidden="true"
      style="background: rgba(0, 0, 0, 0.3)"
      @click.self="$emit('closeModal')"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content px-2">
          <div class="modal-header border-0">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div :class="`modal-footer border-0 d-flex ${position}`">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('closeModal')"
            >
              {{ closeText }}
            </button>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  closeText: {
    type: String,
    default: "Cancel",
  },
  position: {
    type: String,
    default: "",
  },
});
defineEmits(["closeModal"]);
</script>

<style scoped></style>
