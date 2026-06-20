<template>
  <div>
    <div class="skeleton section-title mb-3 mt-4"></div>

    <div class="d-flex flex-column gap-3">
      <!-- circle progress -->

      <div
        v-for="i in 2"
        :key="i"
        class="bg-white p-3 rounded-card d-flex justify-content-between align-items-center"
      >
        <div>
          <div class="skeleton card-head mb-2"></div>

          <div class="skeleton card-sub"></div>
        </div>

        <div class="skeleton progress-circle"></div>
      </div>

      <!-- approved rejected -->

      <div class="d-flex gap-3">
        <div v-for="i in 2" :key="i" class="bg-white p-2 rounded-card w-50">
          <div class="skeleton mini-header mb-3"></div>

          <div class="d-flex gap-2">
            <div class="skeleton progress-line"></div>

            <div class="skeleton percent"></div>
          </div>
        </div>
      </div>

      <!-- priority -->

      <div class="bg-white p-3 rounded-card">
        <div class="skeleton card-head mb-4"></div>

        <div v-for="i in 4" :key="i" class="d-flex justify-content-between mb-3">
          <div class="d-flex gap-2 align-items-center">
            <div class="skeleton dot"></div>

            <div class="skeleton priority-text"></div>
          </div>

          <div class="skeleton count"></div>
        </div>
      </div>
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

.divider {
  width: 100%;
  height: 1px;
}

.time-text {
  width: 45px;
  height: 18px;
}

.time-pill {
  width: 70px;
  height: 28px;
  border-radius: 20px;
}

.section-title {
  width: 180px;
  height: 22px;
}

.card-head {
  width: 120px;
  height: 16px;
}

.card-sub {
  width: 80px;
  height: 13px;
}

.progress-circle {
  width: 75px;
  height: 75px;
  border-radius: 50%;
}

.mini-header {
  width: 100%;
  height: 35px;
}

.progress-line {
  width: 130px;
  height: 6px;
}

.percent {
  width: 30px;
  height: 12px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.priority-text {
  width: 70px;
  height: 13px;
}

.count {
  width: 35px;
  height: 13px;
}
</style>
