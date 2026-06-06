<template>
  <div class="px-3">
    <div class="d-flex align-items-center justify-content-between py-3">
      <h6 class="fs-13 mb-0">Team</h6>
      <button
        class="btn px-2 py-1 rounded-btn text-nowrap fs-12 btn-ghost"
        v-if="isOwner"
        @click="showCreateTeam = true"
      >
        <Plus size="15" class="me-1" /> New Team
      </button>

      <n-modal v-model:show="showCreateTeam" :mask-closable="true">
        <div class="bg-white rounded-card" style="width: 400px">
          <!-- Header -->
          <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
            <span class="fw-medium fs-15">Create Team</span>
            <n-button
              text
              size="small"
              @click="showCreateTeam = false"
              class="text-dark hover-circle p-1 rounded-circle"
            >
              <x size="18" />
            </n-button>
          </div>

          <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />

          <div class="px-4 pt-2 pb-3">
            <label class="mb-2 fs-12 fw-medium d-block">Team Name</label>
            <BaseInput
              v-model="teamName"
              input-placeholder="Team name"
              input-class="py-1 fs-13 rounded-btn-sm mb-3"
            />

            <label class="mb-2 fs-12 fw-medium d-block">Description</label>
            <BaseInput
              v-model="description"
              input-placeholder="Description"
              input-class="py-1 fs-13 rounded-btn-sm mb-4"
            />
            <!-- Create team -->
            <BaseButton
              btnName="Create team"
              class="w-100 fs-13 rounded-btn py-2"
              @click="handleCreateTeam"
            />
          </div>
        </div>
      </n-modal>
    </div>
    <n-scrollbar style="max-height: 635px">
      <div class="d-flex flex-column gap-2">
        <router-link
          v-for="t in teamList"
          :key="t.team_id"
          :to="`/workspace/${currentRouteWorkspaceId}/team/${t.team_id}/${currentSection}`"
          class="text-decoration-none"
        >
          <div
            class="card py-2 px-3 rounded-btn text-nowrap"
            :style="
              String(t.team_id) === String(currentRouteTeamId)
                ? {
                    borderColor: activeBorderColor,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                  }
                : {
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderColor: 'transparent',
                  }
            "
          >
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
                  <template #trigger><n-avatar :src="src" /></template>
                  {{ name }}
                </n-tooltip>
              </template>
              <template #rest="{ options: restOptions, rest }">
                <n-dropdown
                  :options="createDropdownOptions(restOptions)"
                  placement="top"
                  size="small"
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
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/user/team";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import BaseInput from "../BaseInput.vue";
import BaseButton from "../BaseButton.vue";

const route = useRoute();
const currentRouteWorkspaceId = computed(() => route.params.workspace_id);
const currentRouteTeamId = computed(() => route.params.team_id);
const currentSection = computed(() => route.path.split("/").pop()?.toLowerCase());

const activeBorderColor = computed(() => {
  const map = {
    tasks: "#0088ff",
    issues: "#ff383c",
    documents: "#00C3D0",
    activity: "#6155F5",
  };
  return map[currentSection.value] ?? "#0088ff";
});

const teamStore = useTeamStore();
const { getTeamByWorkspace } = storeToRefs(teamStore);
const teamList = computed(() => getTeamByWorkspace.value ?? []);

const workspaceStore = UseWorkspaceStore();
const { getAllWorkspace } = storeToRefs(workspaceStore);

onMounted(async () => {
  await teamStore.getTeamByWorkspaceStore(currentRouteWorkspaceId.value);
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

const currentWorkspace = computed(() => {
  return (
    getAllWorkspace.value.find((w) => w.workspace_id == currentRouteWorkspaceId.value) ??
    null
  );
});

const isOwner = computed(() => currentWorkspace.value?.my_role === "owner");

const showCreateTeam = ref(false);
const teamName = ref("");
const description = ref("");

const handleCreateTeam = async () => {
  if (!teamName.value.trim()) return;
  // your create logic here
  teamName.value = "";
  description.value = "";
  showCreateTeam.value = false;
};
</script>

<style scoped></style>
>
