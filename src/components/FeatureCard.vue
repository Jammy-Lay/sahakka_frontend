<template>
  <div class="feature-card bg-white rounded-5 d-flex flex-column gap-4 p-4">
    <div class="feature-icon w-fit rounded-pill">
      <component :is="icon" size="30" stroke-width="2" :color="color"/>
    </div>
    <div class="d-flex flex-column" style="gap: 24px">
      <p class="m-0 fw-bold" :style="{color: color}">{{ t1 }}</p>
      <h2 class="fs-2 m-0 fw-medium">{{ t2 }}</h2>
      <p class="fs-5 m-0 fw-medium text-muted">{{ t3 }}</p>
    </div>
  </div>
</template>

<script setup>

  defineProps({
    icon: {
      type: [Object, Function],
      required: true
    },
    color: {
      type: String,
      default: 'black'
    },
    t1: String,
    t2: String,
    t3: String
  });

</script>

<style scoped>

  .feature-card {
    height: 100%;
  }

  .feature-icon {
    background-color: hsl(from var(--bs-secondary) h s l / 0.1);
    padding: 10px 30px;
  }

</style>