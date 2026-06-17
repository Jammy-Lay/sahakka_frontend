<template>
  <div class="d-flex align-items-center gap-2">
    <!-- avatar -->
    <div class="skeleton avatar"></div>

    <!-- workspace name -->
    <div class="skeleton workspace-text"></div>

    <!-- arrow -->
    <div class="skeleton chevron"></div>
  </div>
</template>

<style scoped>

/* same shimmer */
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
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f0f0f0 50%,
    #e2e2e2 75%
  );
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


/* avatar like your img */
.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}


/* workspace name */
.workspace-text {
  width: 120px;
  height: 13px;
  border-radius: 6px;
}


/* fake chevron */
.chevron {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}
</style>