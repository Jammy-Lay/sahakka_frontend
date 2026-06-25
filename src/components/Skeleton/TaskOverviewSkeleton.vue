<template>
  <div class="col-lg-6 col-12">
    <div class="skeleton-card">
      <!-- header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="skeleton title"></div>

        <div class="skeleton filter"></div>
      </div>

      <!-- summary -->
      <div class="summary-box mb-4">
        <div>
          <div class="skeleton label mb-2"></div>

          <div class="skeleton number mb-2"></div>

          <div class="skeleton sub-text"></div>
        </div>

        <div class="skeleton circle"></div>
      </div>

      <!-- priority -->
      <div class="d-flex justify-content-between mb-3">
        <div class="skeleton priority-title"></div>

        <div class="skeleton priority-count"></div>
      </div>

      <div v-for="i in 4" :key="i" class="bar-row mb-3">
        <div class="skeleton bar-label"></div>

        <div class="skeleton progress ms-auto"></div>

        <div class="skeleton count"></div>
      </div>

      <!-- approved rejected -->
      <div class="row g-2 mt-3">
        <div v-for="i in 2" :key="i" class="col-6">
          <div class="status-card bg-accent">
            <div class="skeleton status-title mb-3"></div>

            <div class="d-flex justify-content-between align-items-center">
              <div class="skeleton status-number"></div>

              <div class="skeleton mini-circle"></div>
            </div>
          </div>
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

/* header */

.title {
  width: 170px;
  height: 22px;
}

.filter {
  width: 70px;
  height: 32px;
  border-radius: 20px;
}

/* summary */

.summary-box {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  width: 90px;
  height: 16px;
}

.number {
  width: 120px;
  height: 45px;
}

.sub-text {
  width: 150px;
  height: 14px;
}

.circle {
  width: 95px;
  height: 95px;
  border-radius: 50%;
}

/* priority */

.priority-title {
  width: 100px;
  height: 18px;
}

.priority-count {
  width: 60px;
  height: 12px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  width: 60px;
  height: 12px;
}

.progress {
  height: 7px;
  width: 380px;
}

.count {
  width: 50px;
  height: 12px;
}

/* status */

.status-card {
  border-radius: 12px;
  padding: 14px;
}

.status-title {
  width: 130px;
  height: 18px;
}

.status-number {
  width: 80px;
  height: 30px;
}

.mini-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
