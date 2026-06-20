<template>
  <n-scrollbar style="max-height: 100%">
    <div class="task-grid text-nowrap">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-card border border-0"
        style="padding: 20px; min-height: 220px"
      >
        <!-- top user -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div class="d-flex align-items-center gap-2">
            <div class="skeleton avatar"></div>

            <div class="skeleton user-text"></div>
          </div>

          <!-- type -->
          <div class="skeleton type"></div>
        </div>

        <!-- meta grid -->
        <div class="meta-grid mb-4">
          <div v-for="x in 6" :key="x" class="meta-item d-flex flex-column gap-2">
            <!-- label -->
            <div class="skeleton label"></div>

            <!-- value -->
            <div class="skeleton value"></div>
          </div>
        </div>

        <!-- title -->
        <div class="skeleton task-title mb-3"></div>

        <!-- description -->
        <div class="skeleton desc mb-1"></div>
      </div>
    </div>
  </n-scrollbar>
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

/* user */

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-text {
  width: 100px;
  height: 12px;
}

.type {
  width: 60px;
  height: 28px;
  border-radius: 20px;
}

/* meta */

.label {
  width: 55px;
  height: 14px;
  border-radius: 8px;
}

.value {
  width: 70px;
  height: 20px;
  border-radius: 8px;
}

/* title */

.task-title {
  width: 180px;
  height: 18px;
  border-radius: 8px;
}

.desc {
  width: 80%;
  height: 12px;
  border-radius: 8px;
}

</style>
