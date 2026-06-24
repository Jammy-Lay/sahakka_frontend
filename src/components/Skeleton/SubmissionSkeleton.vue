<template>
  <div>
    <!-- title -->
    <div class="pt-4 pb-2 bg-body">
      <div class="d-flex align-items-start justify-content-between mb-2">
        <div class="skeleton section-title"></div>
      </div>
    </div>

    <!-- cards -->
    <div class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="i in 9" :key="i">
        <div class="bg-white rounded-card p-3">
          <!-- header -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex gap-2 align-items-center">
              <div class="skeleton avatar"></div>

              <div class="skeleton user-name"></div>
            </div>

            <div class="skeleton status"></div>
          </div>

          <!-- date -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="skeleton icon"></div>
            <div class="skeleton date-text"></div>
          </div>

          <!-- task title -->
          <div class="skeleton task-title mb-2"></div>

          <!-- message -->
          <div class="skeleton message mb-3"></div>

          <!-- button -->
          <div class="skeleton button ms-auto"></div>
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

/* title */
.section-title {
  width: 120px;
  height: 22px;
}

/* user */
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-name {
  width: 90px;
  height: 14px;
}

/* status badge */
.status {
  width: 85px;
  height: 30px;
  border-radius: 20px;
}

/* date */
.icon {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.date-text {
  width: 150px;
  height: 13px;
}

/* content */
.task-title {
  width: 170px;
  height: 16px;
}

.message {
  width: 90%;
  height: 35px;
}

/* button */
.button {
  width: 75px;
  height: 25px;
  border-radius: 12px;
}
</style>
