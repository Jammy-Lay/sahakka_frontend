<template>
  <div class="container-fluid px-4">
    <div class="row g-4 align-items-start">

      <!-- ── Left: Workspace Cards ── -->
      <div class="col-lg-12 col-xl-8">

        <!-- sticky header -->
        <div class="row bg-body pt-5 mb-3">
          <div class="col-4">
            <div class="d-flex align-items-center gap-2">
              <div class="skeleton" style="width:30px; height:30px; border-radius:6px;"></div>
              <div class="skeleton" style="width:110px; height:35px;"></div>
            </div>
          </div>
          <div class="col-8 d-flex justify-content-end">
            <div class="skeleton" style="width:100%; max-width:420px; height:46px; border-radius:14px;"></div>
          </div>
        </div>

        <!-- card grid -->
        <div class="row g-3">
          <div v-for="n in 6" :key="n" class="col-12 col-md-6">
            <SkeletonBaseCard />
          </div>
        </div>

        <!-- pagination -->
        <div class="mt-3 d-flex justify-content-end gap-2">
          <div v-for="n in 4" :key="n"
            class="skeleton" style="width:32px; height:32px; border-radius:8px;">
          </div>
        </div>
      </div>

      <!-- ── Right: Overview Sidebar ── -->
      <div class="col-lg-12 col-xl-4 pt-5">

        <!-- title -->
        <div class="d-flex align-items-center gap-2 mb-1">
          <div class="skeleton" style="width:30px; height:30px; border-radius:6px;"></div>
          <div class="skeleton" style="width:90px; height:35px;"></div>
        </div>

        <!-- stat cards 2x2 -->
        <div class="row g-3 mt-1">
          <div v-for="n in 2" :key="n" class="col-6">
            <div class="card border-0 shadow-sm rounded-4 p-3" style="min-height:130px;">
              <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex flex-column gap-2">
                  <div class="skeleton" style="width:80px; height:12px;"></div>
                  <div class="skeleton" style="width:50px; height:22px;"></div>
                  <div class="skeleton" style="width:70px; height:11px;"></div>
                </div>
                <div class="skeleton" style="width:40px; height:40px; border-radius:10px; flex-shrink:0;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- recent workspaces table -->
        <div class="card border-0 shadow-sm rounded-4 p-4 mt-3">
          <div class="mb-3">
            <div class="skeleton mb-2" style="width:200px; height:18px;"></div>
            <div class="skeleton" style="width:100px; height:12px;"></div>
          </div>
          <!-- header row -->
          <div class="d-flex gap-3 px-1 mb-2">
            <div class="skeleton" style="width:100px; height:12px;"></div>
            <div class="skeleton ms-auto" style="width:60px; height:12px;"></div>
            <div class="skeleton" style="width:60px; height:12px;"></div>
          </div>
          <!-- rows -->
          <div v-for="n in 4" :key="n"
            class="d-flex align-items-center gap-2 py-2"
            :style="n < 5 ? 'border-bottom: 1px solid rgba(0,0,0,0.06)' : ''">
            <div class="skeleton" style="width:32px; height:32px; border-radius:8px; flex-shrink:0;"></div>
            <div class="d-flex flex-column gap-1 flex-grow-1">
              <div class="skeleton" style="width:100px; height:12px;"></div>
              <div class="skeleton" style="width:70px; height:10px;"></div>
            </div>
            <div class="skeleton" style="width:50px; height:20px; border-radius:20px;"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonBaseCard from '@/components/Skeleton/SkeletonBaseCard.vue';
</script>

<style scoped>
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e2e2;
  border-radius: 8px;
  flex-shrink: 0;
}
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}
</style>