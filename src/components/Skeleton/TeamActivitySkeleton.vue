<template>
  <div class="mt-4">
    <!-- header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <div class="skeleton title mb-2"></div>

        <div class="skeleton subtitle"></div>
      </div>

      <div class="skeleton filter-btn"></div>
    </div>

    <!-- activity -->

    <div class="activity-date-label mb-3">
      <div class="skeleton date-icon"></div>

      <div class="skeleton date-text"></div>
    </div>

    <div class="row gy-1 gx-3">
      <div v-for="i in 8" :key="i" class="col-lg-6">
        <div class="activity-card rounded-card">
          <!-- tag -->

          <div class="skeleton act-tag mb-3"></div>

          <!-- user -->

          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center gap-2">
              <div class="skeleton avatar"></div>

              <div class="skeleton username"></div>
            </div>

            <div class="skeleton time"></div>
          </div>

          <!-- note -->

          <div class="skeleton note mb-2"></div>

          <div class="skeleton note short"></div>
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

/* header */

.title {
  width: 180px;
  height: 22px;
}

.subtitle {
  width: 250px;
  height: 14px;
}

.filter-btn {
  width: 80px;
  height: 34px;
  border-radius: 12px;
}

/* date */

.date-icon {
  width: 14px;
  height: 14px;
  border-radius: 30%;
}

.date-text {
  width: 90px;
  height: 14px;
}

.activity-date-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* card */

.activity-card {
  background: white;
  padding: 14px;
  min-height: 130px;
}

.act-tag {
  width: 70px;
  height: 22px;
  border-radius: 20px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.username {
  width: 90px;
  height: 14px;
}

.time {
  width: 45px;
  height: 12px;
}

.note {
  width: 90%;
  height: 13px;
}

.note.short {
  width: 60%;
}
</style>
