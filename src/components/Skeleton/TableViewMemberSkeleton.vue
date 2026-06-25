<template>
  <div class="bg-white rounded-card">
    <div
      class="d-flex justify-content-between align-items-center border rounded-top-4 py-3 px-4 bg-accent fw-bold fs-13"
    >
      <div class="col-3">Name</div>
      <div class="col-3">Email</div>
      <div class="col-2">Join</div>
      <div class="col-2">Role</div>
      <div class="col-2 text-end text-md-center">Kick Member</div>
    </div>

    <div class="d-flex flex-column">
      <div
        v-for="i in 4"
        :key="i"
        class="d-flex align-items-center justify-content-between py-3 px-4 border-bottom last-border-none"
      >
        <div class="col-3 d-flex align-items-center gap-2">
          <div class="skeleton table-avatar"></div>
          <div class="skeleton table-text-name"></div>
        </div>

        <div class="col-3">
          <div class="skeleton table-text-email"></div>
        </div>

        <div class="col-2">
          <div class="skeleton table-text-date"></div>
        </div>

        <div class="col-2">
          <div class="skeleton table-badge"></div>
        </div>

        <div class="col-2 d-flex justify-content-end justify-content-md-center">
          <div class="skeleton table-btn-kick"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove the bottom border on the last item to match typical clean tables */
.last-border-none:last-child {
  border-bottom: none !important;
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

.table-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.table-text-name {
  width: 100px;
  height: 16px;
}

.table-text-email {
  width: 160px;
  height: 14px;
}

.table-text-date {
  width: 90px;
  height: 14px;
}

.table-badge {
  width: 80px;
  height: 26px;
  border-radius: 20px; 
}

.table-btn-kick {
  width: 75px;
  height: 32px;
  border-radius: 20px;
}
</style>