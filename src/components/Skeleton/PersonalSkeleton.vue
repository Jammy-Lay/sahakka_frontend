<template>
  <div class="col-lg-6 col-12">
    <div class="skeleton-card">
      <div class="skeleton heading mb-3"></div>
      <div class="skeleton description mb-3"></div>

      <div class="skeleton input mb-2"></div>

      <div class="skeleton button"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e2e2;
  border-radius: 8px;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);

  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.heading {
  width: 200px;
  height: 25px;
}

.description {
  width: 190px;
  height: 18px;
}

.input {
  width: 100%;
  height: 55px;
}

.button {
  width: 100%;
  height: 38px;
}
</style>
