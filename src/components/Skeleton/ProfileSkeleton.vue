<template>
  <div class="col-lg-6 col-12">
    <div class="skeleton-card">
      <div class="d-flex align-items-center gap-3">
        <div class="skeleton avatar"></div>

        <div>
          <div class="skeleton title mb-2"></div>
          <div class="skeleton text mb-2"></div>
          <div class="skeleton small"></div>
        </div>
      </div>
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
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 14px;
}

.title {
  width: 150px;
  height: 22px;
}

.text {
  width: 120px;
  height: 14px;
}

.small {
  width: 90px;
  height: 12px;
}
</style>
