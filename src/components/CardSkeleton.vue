<template>
  <div class="card border-0 position-relative mt-5 bg-transparent">
    <!-- author -->
    <div class="author ps-3 pt-2 d-flex align-items-center gap-3 bg-light">
      <div class="skeleton circle"></div>
      <div class="d-flex flex-column gap-2 fw-bold">
        <div class="skeleton text-sm"></div>
        <div class="skeleton text-xs"></div>
      </div>
    </div>

    <!-- image -->
    <div class="item bg-light pt-5 pb-1 px-5" style="height: 280px">
      <div class="skeleton image"></div>
    </div>

    <!-- title -->
    <div class="detail bg-light py-4 d-flex justify-content-center">
      <div class="skeleton text-md"></div>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 45%;
  height: 50px;
  border-bottom-left-radius: 30px;
  box-shadow: -30px 25px 0 #f8f9fa;
  z-index: 0;
}

.card::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: calc(45% - 6px);
  height: 45px;
  border-radius: 30px;
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f0f0f0 50%,
    #e2e2e2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.author {
  width: 55%;
  height: 50px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  position: relative;
  z-index: 2;
}

.item {
  border-top-right-radius: 30px;
  position: relative;
  z-index: 2;
}

.detail {
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 5px 0 #42b883;
  position: relative;
  z-index: 2;
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
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f0f0f0 50%,
    #e2e2e2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.image {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.text-sm {
  width: 60px;
  height: 12px;
}

.text-xs {
  width: 40px;
  height: 10px;
}

.text-md {
  width: 80px;
  height: 14px;
}
</style>
