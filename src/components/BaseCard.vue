<template>
  <div class="project-card">
    <!-- Header -->
    <div class="project-header">
      <div class="d-flex gap-3 align-items-center">
        <div class="project-icon">
          <Layers />
        </div>

        <div>
          <h5>{{ project.name }}</h5>
          <p>Owner: {{ project.owner }}</p>
        </div>
      </div>

      <i class="pi pi-ellipsis-v menu"></i>
    </div>

    <!-- Stats -->
    <div class="stats mt-3">
      <div class="stat-box" v-for="stat in stats" :key="stat.label">
        <component :is="stat.icon" :style="{ color: stat.color }" />
        <span>{{ stat.label }}</span>
        <b>{{ stat.value }}</b>
      </div>
    </div>

    <div class="mt-3">
      <n-avatar-group :options="mapMembers(members)" :size="25" :max="4">
        <template #avatar="{ option: { name, src } }">
          <n-tooltip :style="{
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '8px',
          }">
            <template #trigger>
              <n-avatar :src="src" />
            </template>

            {{ name }}
          </n-tooltip>
        </template>

        <template #rest="{ options: restOptions, rest }">
          <n-dropdown :options="createDropdownOptions(restOptions)" placement="top" size="small">
            <n-avatar class="fs-14 text-dark bg-mute"> +{{ rest }} </n-avatar>
          </n-dropdown>
        </template>
      </n-avatar-group>
    </div>

    <!-- Progress -->
    <div class="progress-area">
      <div class="progress-title">
        <span>Progress</span>
        <b>{{ project.progress }}%</b>
      </div>

      <div class="progress">
        <div class="bar" :style="{ width: project.progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Layers } from "lucide-vue-next";

defineProps({
  project: {
    type: Object,
    default: () => ({}),
  },
  stats: {
    type: Array,
    default: () => [],
  },
  members: {
    type: Array,
    default: () => [],
  },
});
function mapMembers(members = []) {
  return members.map((m) => ({
    name: m.name,
    src: m.avatar,
  }));
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
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 18px;
  padding: 24px;

  border: 1px solid #e8e8e8;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-icon {
  align-items: center;
  background: #9e9e9e23;
  border-radius: 14px;
  color: #171717;
  display: flex;
  height: 48px;
  justify-content: center;
  width: 48px;
}

.project-header h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #27364d;
}

.project-header p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-box {
  background: #e1eaf1a2;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.stat-box span {
  display: block;
  color: #94a3b8;
  font-size: 14px;
}

.stat-box b {
  font-size: 18px;
  color: #27364d;
}

.member {
  color: #b05cff;
}

.team {
  color: #3b82f6;
}

.task {
  color: #10b981;
}

.progress-area {
  margin-top: 10px;
}

.progress-title {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 14px;
}

.progress {
  height: 7px;
  background: #eef2f7;
  border-radius: 20px;
  margin-top: 12px;
}

.bar {
  height: 100%;
  border-radius: 20px;
  background: #34c759;
}
</style>
