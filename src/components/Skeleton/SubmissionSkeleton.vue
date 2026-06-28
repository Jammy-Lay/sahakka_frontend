<template>
  <div class="pb-3">
    <!-- header -->
    <div class="pt-4 pb-2 bg-body">
      <div class="d-flex align-items-start justify-content-between mb-3">
        <div class="skeleton title"></div>
      </div>

      <!-- tabs -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <div class="skeleton tab-long"></div>
        <div v-for="i in 3" :key="i" class="skeleton tab"></div>
      </div>
    </div>

    <!-- cards -->
    <div class="row g-3">
      <div class="col-md-6 col-lg-4" v-for="i in 9" :key="i">
        <div class="bg-white rounded-card p-3">
          <!-- user header -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex gap-2 align-items-center">
              <div class="skeleton avatar"></div>
              <div class="skeleton username"></div>
            </div>

            <div class="skeleton status"></div>
          </div>

          <!-- date -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="skeleton icon"></div>
            <div class="skeleton date"></div>
          </div>

          <!-- task -->
          <div class="skeleton task mb-2"></div>

          <!-- message -->
          <div class="skeleton message mb-3"></div>

          <!-- review button -->
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

/* header */

.title {
  width: 230px;
  height: 30px;
}

.tab-long {
  width: 150px;
  height: 30px;
  border-radius: 20px;
}

.tab {
  width: 90px;
  height: 30px;
  border-radius: 20px;
}

/* card */

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.username {
  width: 90px;
  height: 14px;
}

.status {
  width: 85px;
  height: 28px;
  border-radius: 20px;
}

.icon {
  width: 15px;
  height: 15px;
  border-radius: 30%;
}

.date {
  width: 250px;
  height: 13px;
}

.task {
  width: 170px;
  height: 22px;
}

.message {
  width: 90%;
  height: 16px;
}

.file-box {
  width: 100%;
  height: 70px;
  border-radius: 12px;
}

.button {
  width: 75px;
  height: 26px;
  border-radius: 12px;
}

/* modal */

.modal-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
}

.back {
  width: 50px;
  height: 25px;
}

.line {
  height: 1px;
  background: #eee;
  margin-bottom: 20px;
}

.attachment {
  width: 350px;
  height: 200px;
  border-radius: 12px;
}

.textarea {
  width: 100%;
  height: 90px;
  border-radius: 12px;
}

.select {
  width: 140px;
  height: 32px;
  border-radius: 20px;
}

.close-btn {
  width: 80px;
  height: 35px;
  border-radius: 12px;
}

.send-btn {
  width: 90px;
  height: 35px;
  border-radius: 12px;
}
</style>
