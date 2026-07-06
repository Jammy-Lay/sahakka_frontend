<template>
  <div class="how-it-work-card rounded-4 p-5 bg-white d-flex flex-column gap-4" >
    <div class="w-100">
      <img class="w-100" :src="img" alt="">
    </div>
    <h2 :style="{color: color}" class="fw-bold">{{ t1 }}</h2>
    <p class="fs-5">{{ t2 }}</p>
  </div>
</template>

<script setup>
  defineProps({
    img: String,
    color: String,
    t1: String,
    t2: String
  })
</script>

<style scoped>
  .how-it-work-card {
    width: 470px;
  }
</style>