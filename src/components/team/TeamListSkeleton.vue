<template>
  <div class="px-3">
    <div class="d-flex align-items-center justify-content-between py-3 mb-1">
      <!-- title -->
      <div class="skeleton title"></div>

      <!-- button -->
      <div class="skeleton new-btn"></div>
    </div>

    <n-scrollbar style="max-height: 635px">
      <div class="d-flex flex-column gap-2">
        <!-- repeat team cards -->
        <div v-for="i in 3" :key="i" class="card py-2 px-3 rounded-btn">
          <!-- top -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="w-100">
              <!-- team name -->
              <div class="skeleton team-title mb-2"></div>

              <!-- description -->
              <div class="skeleton team-desc"></div>
            </div>

            <!-- option -->
            <div class="skeleton option"></div>
          </div>

          <!-- progress -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="skeleton percent"></div>

            <div class="skeleton progress"></div>
          </div>

          <!-- avatars -->
          <div class="d-flex align-items-center">
            <div v-for="x in 3" :key="x" class="skeleton avatar"></div>
          </div>
        </div>
      </div>
    </n-scrollbar>
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
  width: 45px;
  height: 16px;
}

.new-btn {
  width: 90px;
  height: 20px;
  border-radius: 8px;
}

/* team card */

.team-title {
  width: 90px;
  height: 14px;
  border-radius: 6px;
}

.team-desc {
  width: 160px;
  height: 10px;
  border-radius: 5px;
}

.option {
  width: 30px;
  height: 10px;
  border-radius: 8px;
}

/* progress */

.percent {
  width: 25px;
  height: 12px;
  border-radius: 5px;
}

.progress {
  width: 100%;
  height: 5px;
  border-radius: 5px;
}

/* avatar */

.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
</style>
