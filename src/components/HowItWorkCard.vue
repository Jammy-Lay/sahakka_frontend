<template>
  <div class="how-it-work-card rounded-4 p-5 bg-white d-flex flex-column gap-4">
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
    cursor: grab;
    user-select: none;
    transition: all 300ms ease;
    
    &:hover {
      box-shadow: 0 0 20px rgb(0, 0, 0, 0.1);
      scale: 1.05;
    }
    &:active {
      cursor: grabbing;
    }
    img {
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    }
  }
</style>