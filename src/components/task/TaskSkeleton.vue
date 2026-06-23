<template>
  <n-scrollbar style="max-height: 100%">
    <!-- HEADER SKELETON -->
    <template v-if="showHeader">
      <div class="position-sticky top-0 z-1 header pt-4 pb-2 bg-body">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <!-- title -->
          <div>
            <div class="skeleton header-title mb-2"></div>
            <div class="skeleton header-desc"></div>
          </div>

          <!-- buttons -->
          <div class="d-flex gap-2">
            <div class="skeleton header-btn"></div>

            <div class="skeleton header-btn primary"></div>
          </div>
        </div>

        <!-- tabs -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <div v-for="i in 6" :key="i" class="skeleton tab"></div>
        </div>
      </div>
    </template>

    <!-- TASK CARDS -->
    <div class="task-grid text-nowrap">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white rounded-card border border-0"
        style="padding: 20px; min-height: 220px"
      >
        <!-- user -->
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <div class="skeleton avatar"></div>

            <div class="skeleton user-text"></div>
          </div>

          <div class="skeleton type"></div>
        </div>

        <!-- meta -->

        <div class="meta-grid mb-4">
          <div v-for="x in 6" :key="x" class="meta-item d-flex flex-column gap-2">
            <div class="d-flex align-items-center gap-1">
              <div class="skeleton icon"></div>

              <div class="skeleton label"></div>
            </div>

            <div class="skeleton value"></div>
          </div>
        </div>

        <!-- title -->
        <div class="skeleton card-title mb-3"></div>

        <!-- description -->
        <div class="skeleton desc small"></div>
      </div>
    </div>
  </n-scrollbar>
</template>

<script setup>
defineProps({
  showHeader: {
    type: Boolean,
    default: true,
  },
});
</script>

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

.header-title {
  width: 180px;
  height: 22px;
}

.header-desc {
  width: 250px;
  height: 14px;
}

.header-btn {
  width: 80px;
  height: 34px;
  border-radius: 10px;
}

.header-btn.primary {
  width: 110px;
}

.tab {
  width: 110px;
  height: 32px;
  border-radius: 20px;
}

/* card */

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-text {
  width: 110px;
  height: 13px;
}

.type {
  width: 65px;
  height: 28px;
  border-radius: 20px;
}

.icon {
  width: 15px;
  height: 15px;
  border-radius: 5px;
}

.label {
  width: 55px;
  height: 14px;
}

.value {
  width: 75px;
  height: 22px;
}

.card-title {
  width: 170px;
  height: 20px;
}

.desc {
  width: 85%;
  height: 13px;
}

.desc.small {
  width: 55%;
}
</style>
