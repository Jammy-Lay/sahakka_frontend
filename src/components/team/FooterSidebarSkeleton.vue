<template>
  <div class="sidebar-footer d-flex align-items-center gap-2 p-2">
    <!-- avatar -->
    <div class="skeleton avatar flex-shrink-0"></div>

    <!-- name + email -->
    <div class="d-flex flex-column gap-2 overflow-hidden">
      <!-- name -->
      <div class="skeleton name"></div>

      <!-- email -->
      <div class="skeleton email"></div>
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

/* avatar same as img */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* username */
.name {
  width: 80px;
  height: 12px;
  border-radius: 6px;
}

/* email */
.email {
  width: 130px;
  height: 10px;
  border-radius: 5px;
}
</style>
