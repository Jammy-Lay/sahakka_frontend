<template>
  <div class="px-3">
    <div class="d-flex align-items-center justify-content-between py-3">
      <h6 class="fs-13 mb-0">Team</h6>
      <button class="btn px-2 rounded-btn text-nowrap fs-12 btn-ghost">
        <Plus size="15" class="me-1" /> New Team
      </button>
    </div>
    <n-scrollbar style="max-height: 635px">
      <div class="d-flex flex-column gap-3">
        <router-link
          v-for="t in teamList"
          :key="t.team_id"
          :to="`/workspace/${props.team.workspace?.workspace_id}/team/${t.team_id}/tasks`"
          class="text-decoration-none"
        >
          <div class="card py-2 px-3 rounded-btn border border-1 text-nowrap">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <div>
                <h6 class="mb-1 fw-semibold">{{ t.title }}</h6>
                <p class="mb-0 fs-11 text-mute">{{ t.description }}</p>
              </div>
              <chevron-right size="18" />
            </div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <p class="mb-0 fs-12">60%</p>
              <n-progress
                type="line"
                :percentage="60"
                color="#34C759"
                :height="5"
                processing
                :show-indicator="false"
              />
            </div>
            <n-avatar-group :options="mapMembers(t.members)" :size="25" :max="4">
              <template #avatar="{ option: { name, src } }">
                <n-tooltip
                  :style="{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px' }"
                >
                  <template #trigger>
                    <n-avatar :src="src" />
                  </template>
                  {{ name }}
                </n-tooltip>
              </template>
              <template #rest="{ options: restOptions, rest }">
                <n-dropdown
                  :options="createDropdownOptions(restOptions)"
                  placement="top"
                  size="small"
                  :style="{ borderRadius: '12px' }"
                >
                  <n-avatar class="fs-14 text-dark bg-mute">+{{ rest }}</n-avatar>
                </n-dropdown>
              </template>
            </n-avatar-group>
          </div>
        </router-link>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  team: {
    type: Object,
    default: () => ({}),
  },
});
40
const teamList = computed(() => {
  if (Array.isArray(props.team)) return props.team;
  if (props.team?.team) return props.team.team;
  return [];
});

function mapMembers(members = []) {
  return members.map((m) => ({
    name: m.name,
    src: m.avatar,
  }));
}

function createDropdownOptions(options) {
  return options.map((option) => ({
    key: option.name,
    label: option.name,
    props: { style: "font-size: 11px;" },
  }));
}
</script>

<style scoped>
:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical) {
  right: -100% !important;
  top: 50% !important;
  width: 10px !important;
}

:deep(.n-scrollbar-rail__scrollbar) {
  max-height: 60px !important;
}
</style>
