<template>
  <div class="card border rounded-4 p-4 border-0 shadow-sm" style="cursor: pointer !important; ">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex gap-3 align-items-center">
        <div class="d-flex align-items-center justify-content-center rounded-3 bg-light"
          style="width:48px; height:48px;">
          <Layers color="#171717" />
        </div>
        <div>
          <h5 class="mb-0 fw-bold text-truncate-1" style="font-size:18px; color:#27364d;">{{ project.name }}</h5>
          <p class="mb-0 mt-1 text-secondary text-truncate-1" style="font-size:13px;">Owner: {{ project.owner }}</p>
        </div>
      </div>
      <i class="pi pi-ellipsis-v text-secondary" style="cursor:pointer;"></i>
    </div>

    <!-- Stats -->
    <div class="row g-3 mt-2">
      <div :class="`col-${12 / stats.length}`" v-for="stat in stats" :key="stat.label">
        <div class="rounded-3 p-3 text-center w-100 overflow-hidden bg-accent">
          <component :is="stat.icon" :style="{ color: stat.color }" />
          <span class="d-block text-secondary mt-1 text-truncate" style="font-size:14px;">{{ stat.label }}</span>
          <b style="font-size:18px; color:#27364d;">{{ stat.value }}</b>
        </div>
      </div>
    </div>

    <!-- Members -->
    <div class="mt-3">
      <n-avatar-group :options="mapMembers(members)" :size="25" :max="4">
        <template #avatar="{ option: { name, src } }">
          <n-tooltip :style="{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px' }">
            <template #trigger>
              <n-avatar :src="src" />
            </template>
            {{ name }}
          </n-tooltip>
        </template>
        <template #rest="{ options: restOptions, rest }">
          <n-dropdown :options="createDropdownOptions(restOptions)" placement="top" size="small">
            <n-avatar class="fs-6 text-dark bg-light"> +{{ rest }} </n-avatar>
          </n-dropdown>
        </template>
      </n-avatar-group>
    </div>

    <!-- Progress -->
    <div class="mt-3">
      <div class="d-flex justify-content-between text-secondary mb-2" style="font-size:14px;">
        <span>Progress</span>
        <b>{{ project.progress }}%</b>
      </div>
      <div class="progress rounded-pill" style="height:7px; background:#eef2f7;">
        <div class="progress-bar rounded-pill" role="progressbar"
          :style="{ width: project.progress + '%', background: '#34c759' }" :aria-valuenow="project.progress"
          aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Layers } from "lucide-vue-next";

defineProps({
  project: { type: Object, default: () => ({}) },
  stats: { type: Array, default: () => [] },
  members: { type: Array, default: () => [] },
});

function mapMembers(members = []) {
  return members.map((m) => ({ name: m.name, src: m.avatar }));
}

function createDropdownOptions(options) {
  return options.map((o) => ({
    key: o.name,
    label: o.name,
    props: { style: "font-size: 11px;" },
  }));
}
</script>
<style scoped>
.text-truncate-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>