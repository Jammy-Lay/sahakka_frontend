<template>
  <div class="analyze-page">
    <!-- Header -->
    <div class="row pt-3 g-4 align-items-center">
      <div class="col-lg-8 col-md-6">
        <h5 class="page-heading mb-0">Team Analytics</h5>
      </div>
      <div class="col-lg-4 col-md-6 d-flex justify-content-end">
        <div class="skeleton filter-btn"></div>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="row pt-3 g-4">
      <div class="col-lg-4" v-for="i in 3" :key="i">
        <div class="stat-card">
          <div class="skeleton stat-value mb-2"></div>
          <div class="skeleton stat-label"></div>
        </div>
      </div>

      <!-- Chart -->
      <div class="col-lg-12">
        <div class="chart-card">
          <div class="skeleton chart-title mb-3"></div>
          <div class="chart-wrap d-flex align-items-center justify-content-center">
            <div class="skeleton chart-circle"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="row pt-3 g-4">
      <div class="col-lg-12">
        <div class="users-card">
          <div class="skeleton-row skeleton-header">
            <div class="skeleton cell-sm"></div>
            <div class="skeleton cell-md"></div>
            <div class="skeleton cell-lg"></div>
            <div class="skeleton cell-md"></div>
          </div>

          <div v-for="i in 6" :key="i" class="skeleton-row">
            <div class="skeleton rank-icon"></div>

            <div class="d-flex align-items-center gap-2">
              <div class="skeleton user-avatar"></div>
              <div class="skeleton user-name"></div>
            </div>

            <div class="skeleton email"></div>

            <div class="skeleton pill"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.analyze-page {
  padding: 10px 0;
}

.page-heading {
  font-size: 18px;
  font-weight: 700;
}

.stat-card {
  border-radius: 10px;
  padding: 18px;
  background: #fff;
}

.chart-card {
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}

.chart-wrap {
  position: relative;
  height: 320px;
}

.users-card {
  background: #fff;
  border-radius: 12px;
  padding: 8px;
}

/* ============ shimmer base ============ */
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

/* ============ header ============ */
.filter-btn {
  width: 180px;
  height: 36px;
  border-radius: 999px;
}

/* ============ stat cards ============ */
.stat-value {
  width: 60px;
  height: 26px;
}

.stat-label {
  width: 90px;
  height: 13px;
}

/* ============ chart ============ */
.chart-title {
  width: 140px;
  height: 16px;
}

.chart-circle {
  width: 260px;
  height: 260px;
  border-radius: 50%;
}

/* ============ table ============ */
.skeleton-row {
  display: grid;
  grid-template-columns: 56px 1.5fr 2fr 1.5fr;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.skeleton-header {
  background: #f9fafb;
}

.cell-sm {
  width: 24px;
  height: 14px;
}

.cell-md {
  width: 100px;
  height: 14px;
}

.cell-lg {
  width: 140px;
  height: 14px;
}

.rank-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  width: 100px;
  height: 14px;
}

.email {
  width: 160px;
  height: 14px;
}

.pill {
  width: 100px;
  height: 20px;
  border-radius: 999px;
}
</style>