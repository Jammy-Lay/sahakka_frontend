<template>
  <div>
    <!-- title -->
    <div class="skeleton team-title mb-2"></div>

    <!-- description -->
    <div class="skeleton team-desc"></div>
  </div>
</template>

<style scoped>
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

/* h2 */
.team-title {
  width: 140px;
  height: 20px;
  border-radius: 8px;
}

/* description */
.team-desc {
  width: 220px;
  height: 12px;
  border-radius: 8px;
}
</style>
