<template>
  <div class="">
    <!-- Header -->
    <div class="d-flex align-items-start justify-content-between mb-3">
      <div>
        <h2 class="fw-semibold fs-5 mb-1">Front-End</h2>
        <p class="text-secondary fs-13 mb-0">Build a website interface</p>
      </div>
      <div class="d-flex gap-2">
        <button
          class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1"
        >
          <Filter size="16" /> Filter
        </button>
        <BaseButton class="fs-13 py-1 px-3 rounded-btn" btn-name="New Task" icon="plus" />
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="d-flex flex-wrap gap-2 mb-3">
      <span class="tab tab-dark"><layout-dashboard size="16" /> All tasks</span>
      <span class="tab bg-blue text-blue"><circle-check-big size="16" /> To do</span>
      <span class="tab bg-orange text-orange"
        ><circle-dashed size="16" /> In process</span
      >
      <span class="tab bg-purple text-purple"><Send size="16" /> Submitted</span>
      <span class="tab bg-green text-green"><CircleCheck size="16" /> Approved</span>
      <span class="tab bg-red text-danger"><CircleX size="16" /> Rejected</span>
    </div>

    <!-- Task Card -->
    <div class="bg-white rounded-card border border-0" style="padding: 20px; min-height: 220px;">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <img
            src="https://i.pinimg.com/736x/d1/07/da/d107da6a1d1fd935c529ed7a39c07aac.jpg"
            class="rounded-circle object-fit-cover"
            style="width: 32px; height: 32px; background: #333"
          />
          <span class="fw-semibold fs-13">Jammy</span>
          <span class="fw-bold text-mute fs-12">·</span>
          <span class="text-mute fs-13"> assign to you</span>
        </div>
        <span class="tab bg-blue text-blue">
          <Circle size="10" :fill="'#0088FF'" /> <span class="text-dark fs-14">Task</span>
        </span>
      </div>

      <div class="meta-grid mb-4">
        <!-- Row 1: Labels -->
        <span class="d-flex align-items-center gap-1 fs-14 text-mute"
          ><circle-dashed size="15" /> Status</span
        >
        <span class="d-flex align-items-center gap-1 fs-14 text-mute"
          ><ghost size="15" /> Priority</span
        >
        <span class="d-flex align-items-center gap-1 fs-14 text-mute"
          ><Users size="15" /> Assignee</span
        >
        <span class="d-flex align-items-center gap-1 fs-14 text-mute"
          ><Calendar size="15" /> Start date</span
        >
        <span class="d-flex align-items-center gap-1 fs-14 text-mute"
          ><Calendar size="15" /> End date</span
        >

        <!-- Row 2: Values -->
        <span class="tab bg-blue text-blue py-1 px-2 fs-14 w-fit fw-medium"
          ><circle-check-big size="16" /> To do</span
        >
        <span class="tab bg-red text-danger py-1 px-2 fs-14 w-fit fw-medium"
          ><Circle size="10" :fill="'#FF383C'" /> High</span
        >
        <span class="d-flex align-items-center gap-1 fs-13">
          <img
            src="https://i.pinimg.com/736x/d1/07/da/d107da6a1d1fd935c529ed7a39c07aac.jpg"
            class="rounded-circle"
            style="width: 22px; height: 22px; background: #333"
          />
          Sothatt <span class="text-secondary fs-12">(You)</span>
        </span>
        <span class="fs-13">1 / Jan / 2026</span>
        <span class="fs-13">1 / Jan / 2026</span>
      </div>

      <p class="fw-semibold mb-2" style="font-size: 18px">Create location tracking</p>
      <p class="mb-0 text-mute fs-15">Create a face id for user to login</p>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/BaseButton.vue";
</script>

<style scoped>
.tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 99px;
  padding: 6px 11.5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.tab-dark {
  background: #171717;
  color: #fff;
  font-weight: 500 !important;
}
.meta-grid {
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto auto;
  gap: 6px 24px;
  align-items: center;
  width: fit-content;
}
</style>
