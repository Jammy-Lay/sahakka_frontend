<template>
  <div class="col-lg-6 col-12">
    <div class="skeleton-card">
      <!-- My workspace -->

      <div class="skeleton section-title mb-3"></div>

      <div v-for="i in 3" :key="i" class="workspace-item mb-3">
        <div class="skeleton avatar"></div>

        <div class="flex-grow-1">
          <div class="skeleton name mb-2"></div>

          <div class="skeleton meta"></div>
        </div>

        <div class="skeleton arrow"></div>
      </div>

      <!-- invited workspace -->

      <div class="skeleton section-title mb-3 mt-5"></div>

      <div v-for="i in 3" :key="i" class="workspace-item mb-3">
        <div class="skeleton avatar"></div>

        <div class="flex-grow-1">
          <div class="skeleton name mb-2"></div>

          <div class="skeleton meta"></div>
        </div>

        <div class="skeleton arrow"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  height: 100%;
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

/* title */

.section-title {
  width: 180px;
  height: 32px;
}

/* workspace */

.workspace-item {
  display: flex;
  align-items: center;
  gap: 12px;

  background: #f5f5f5;
  padding: 14px;

  border-radius: 12px;
}

.avatar {
  width: 52px;
  height: 52px;

  border-radius: 10px;
}

.name {
  width: 150px;
  height: 18px;
}

.meta {
  width: 120px;
  height: 13px;
}

.arrow {
  width: 28px;
  height: 28px;

  border-radius: 50%;
}

.divider {
  width: 100%;
  height: 1px;
  background: #eee;
}
</style>
