<template>
  <div>
    <!-- reviewer -->
    <div class="d-flex align-items-center gap-2 mb-3">
      <div class="skeleton avatar-lg"></div>

      <div class="d-flex flex-column gap-2 flex-grow-1">
        <div class="skeleton reviewer-line"></div>
      </div>
    </div>

    <!-- feedback card -->
    <div class="bg-accent rounded-card p-3">
      <div class="skeleton feedback-title mb-3"></div>

      <div class="d-flex flex-column gap-2">
        <div class="skeleton feedback-line w-100"></div>
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

/* Reviewer */

.avatar-lg {
  width: 34px;
  height: 34px;
  border-radius: 50%;
}

.reviewer-line {
  width: 240px;
  height: 14px;
}

/* Feedback */

.feedback-title {
  width: 80px;
  height: 15px;
}

.feedback-line {
  height: 13px;
}
</style>
