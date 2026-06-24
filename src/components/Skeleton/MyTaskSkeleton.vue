<template>
  <div class="d-flex flex-column gap-3 mt-4">
    <div class="skeleton section-title mb-2"></div>

    <div v-for="i in 4" :key="i" class="bg-white p-3 rounded-card">
      <!-- user -->

      <div class="d-flex align-items-center gap-2 mb-3">
        <div class="skeleton avatar"></div>

        <div class="skeleton user"></div>
      </div>

      <!-- priority -->

      <div class="task-meta-row mb-2">
        <div class="skeleton label"></div>

        <div class="skeleton badge"></div>
      </div>

      <!-- date -->

      <div class="task-meta-row mb-3">
        <div class="skeleton label"></div>

        <div class="skeleton date"></div>
      </div>

      <!-- title -->

      <div class="skeleton task-title mb-2"></div>

      <!-- desc -->

      <div class="skeleton desc"></div>
    </div>
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

.section-title {
  width: 180px;
  height: 22px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user {
  width: 120px;
  height: 13px;
}

.task-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  width: 80px;
  height: 14px;
}

.badge {
  width: 60px;
  height: 22px;
  border-radius: 20px;
}

.date {
  width: 70px;
  height: 14px;
}

.task-title {
  width: 150px;
  height: 18px;
}

.desc {
  width: 90%;
  height: 12px;
}
</style>
