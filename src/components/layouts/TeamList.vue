<template>
  <TeamListSkeleton v-if="teamStore.loading" />
  <div class="px-3" v-else>
    <div class="d-flex align-items-center justify-content-between py-3">
      <h6 class="fs-13 fw-semibold mb-0">Team</h6>
      <button
        class="btn px-2 py-1 rounded-btn text-nowrap fs-13 fw-semibold btn-ghost"
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
              class="hover-circle p-1 rounded-circle"
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
            <button
              class="btn bg-btn w-100 fs-13 rounded-btn py-2"
              :disabled="isLoading"
              @click="handleCreateTeam"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              {{ isLoading ? "Creating..." : "Create Team" }}
            </button>
          </div>
        </div>
      </n-modal>
    </div>

    <n-scrollbar style="max-height: 635px">
      <div class="d-flex flex-column gap-2">
        <router-link
          v-for="t in teamList"
          :key="t.team_id"
          :to="`/workspace/${currentRouteWorkspaceId}/team/${t.team_id}/tasks`"
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
              <n-popover
                v-model:show="showPopover[t.team_id]"
                trigger="click"
                placement="right"
                :show-arrow="false"
                v-if="isOwner"
                style="border-radius: 12px; width: 135px; padding: 0; margin-left: 20px"
              >
                <template #trigger>
                  <div
                    style="width: 25px; height: 25px; cursor: pointer"
                    class="btn-option d-flex justify-content-center align-items-center rounded-circle"
                    :class="{ 'btn-option-active': showPopover[t.team_id] }"
                    @click.prevent
                  >
                    <ellipsis size="16" />
                  </div>
                </template>

                <div class="p-1 fs-13">
                  <div
                    class="d-flex align-items-center rounded gap-2 px-2 py-1 fw-bold workspace-item"
                    @click.prevent="openRename(t)"
                  >
                    <Brush size="15" /> Rename
                  </div>
                  <div
                    class="d-flex align-items-center rounded gap-2 px-2 py-1 fw-bold workspace-item"
                    @click="goSubmissionView(t.team_id)"
                  >
                    <ClipboardList size="15" /> Submissions
                  </div>
                  <div
                    class="d-flex align-items-center rounded gap-2 px-2 py-1 text-danger fw-bold workspace-item"
                    @click.prevent="openDelete(t)"
                  >
                    <Trash2 size="15" /> Delete
                  </div>
                </div>
              </n-popover>
            </div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <p class="mb-0 fs-12">{{ getTeamPercent(t.team_id) }}%</p>
              <n-progress
                type="line"
                :percentage="getTeamPercent(t.team_id)"
                color="#34C759"
                :height="5"
                processing
                :show-indicator="false"
              />
            </div>
            <n-avatar-group :options="mapMembers(t.members)" :size="25" :max="6">
              <template #avatar="{ option: { name, src } }">
                <n-tooltip
                  :style="{
                    fontSize: '11px !important',
                    padding: '4px 8px !important',
                    borderRadius: '8px !important',
                    marginBottom: '5px !important',
                    marginLeft: '0px !important',
                  }"
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
    <!-- Rename Modal -->
    <n-modal v-model:show="showRenameModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 400px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Rename Team</span>
          <n-button
            text
            size="small"
            @click="showRenameModal = false"
            class="hover-circle p-1 rounded-circle"
          >
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-2 pb-3">
          <label class="mb-2 fs-12 fw-medium d-block">Team Name</label>
          <BaseInput
            v-model="renameName"
            input-placeholder="Team name"
            input-class="py-1 fs-13 rounded-btn-sm mb-3"
          />
          <label class="mb-2 fs-12 fw-medium d-block">Description</label>
          <BaseInput
            v-model="renameDescription"
            input-placeholder="Description"
            input-class="py-1 fs-13 rounded-btn-sm mb-4"
          />
          <button
            class="btn bg-btn w-100 fs-13 rounded-btn py-2"
            :disabled="isLoading"
            @click="handleRename"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
            {{ isLoading ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>
    </n-modal>

    <!-- Delete Modal -->
    <n-modal v-model:show="showDeleteModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 380px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Delete Team</span>
          <n-button
            text
            size="small"
            @click="showDeleteModal = false"
            class="hover-circle p-1 rounded-circle"
          >
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-3 pb-3">
          <p class="fs-13 text-mute mb-4 text-center">
            Are you sure you want to delete ?
          </p>
          <div class="d-flex gap-2">
            <button
              class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button
              class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50 py-2"
              @click="handleDelete"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/user/team";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { notify } from "@/utils/toast";
import BaseInput from "../BaseInput.vue";
import BaseButton from "../BaseButton.vue";
import { useTaskStore } from "@/stores/user/task.js";
import TeamListSkeleton from "../team/TeamListSkeleton.vue";
import { useSubmissionStore } from "@/stores/user/submission.js";

const route = useRoute();
const router = useRouter();
const toast = notify(router);
const currentRouteWorkspaceId = computed(() => route.params.workspace_id);
const currentRouteTeamId = computed(() => route.params.team_id);
const currentSection = computed(() => route.path.split("/").pop()?.toLowerCase());

const showPopover = ref({});

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

const taskStore = useTaskStore();
const { tasksByTeam } = storeToRefs(taskStore);

const submissionStore = useSubmissionStore();

const getTeamPercent = (teamId) => {
  const tasks = taskStore.tasksByTeam[teamId];

  if (!tasks || tasks.length === 0) return 0;

  const approved = tasks.filter((t) => t.status === "approved").length;

  return Math.round((approved / tasks.length) * 100);
};

const currentWorkspace = computed(() => {
  return (
    getAllWorkspace.value.find((w) => w.workspace_id == currentRouteWorkspaceId.value) ??
    null
  );
});

const isOwner = computed(() => currentWorkspace.value?.my_role === "owner");

watch(
  () => route.params.team_id,
  async (teamId) => {
    if (!teamId) return;
    const calls = [
      teamStore.getTeamByIdStore(currentRouteWorkspaceId.value, teamId),
      taskStore.getTaskByTeamStore(currentRouteWorkspaceId.value, teamId),
      taskStore.getSummaryTaskStore(currentRouteWorkspaceId.value, teamId),
      taskStore.getMyTaskStore(currentRouteWorkspaceId.value, teamId),
    ];
    if (isOwner.value) {
      calls.push(
        submissionStore.getAllSubmissionByTeamStore(currentRouteWorkspaceId.value, teamId)
      );
    }

    await Promise.all(calls);
  },
  { immediate: true }
);

watch(isOwner, (val) => {
  if (val && route.params.team_id) {
    submissionStore.getAllSubmissionByTeamStore(
      currentRouteWorkspaceId.value,
      route.params.team_id
    );
  }
});

onMounted(async () => {
  await Promise.all([
    workspaceStore.getMyWorkspaceStore(), // if needed here
    teamStore.getTeamByWorkspaceStore(currentRouteWorkspaceId.value),
  ]);

  teamList.value
    .filter((t) => String(t.team_id) !== String(currentRouteTeamId.value))
    .forEach((t) =>
      taskStore.prefetchTeamTasks(currentRouteWorkspaceId.value, t.team_id)
    );
});

const goSubmissionView = (teamId) => {
  showPopover.value[teamId] = false;
  router.push(`/workspace/${currentRouteWorkspaceId.value}/team/${teamId}/submissions`);
};

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

// Create team
const showCreateTeam = ref(false);
const teamName = ref("");
const description = ref("");

const handleCreateTeam = async () => {
  if (!teamName.value.trim()) {
    toast.error("Name is required");
    return;
  }

  if (!description.value.trim()) {
    toast.error("Description is required");
    return;
  }

  if (teamList.value.length >= 5) {
    toast.error("Maximum 5 teams allowed");
    return;
  }
  isLoading.value = true;

  try {
    await teamStore.createTeam(
      currentRouteWorkspaceId.value,
      teamName.value,
      description.value
    );
    toast.success("Create team successfully");
    teamName.value = "";
    description.value = "";
    showCreateTeam.value = false;
    await teamStore.getTeamByWorkspaceStore(currentRouteWorkspaceId.value);
  } catch (error) {
    console.error("Failed to create team:", error);
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

// Rename
const showRenameModal = ref(false);
const renameName = ref("");
const renameDescription = ref("");
const selectedTeam = ref(null);

const openRename = (t) => {
  selectedTeam.value = t;
  renameName.value = t.title;
  renameDescription.value = t.description;
  showPopover.value[t.team_id] = false;
  showRenameModal.value = true;
};

const handleRename = async () => {
  isLoading.value = true;
  if (!renameName.value.trim()) {
    toast.error("Name is required");
    return;
  }

  if (!renameDescription.value.trim()) {
    toast.error("Description is required");
    return;
  }

  try {
    await teamStore.updateTeam(
      currentRouteWorkspaceId.value,
      selectedTeam.value.team_id,
      renameName.value,
      renameDescription.value
    );

    toast.success("Team renamed successfully");
    showRenameModal.value = false;
    await teamStore.getTeamByWorkspaceStore(currentRouteWorkspaceId.value);
  } catch (error) {
    console.error("Failed to rename team:", error);
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

// Delete
const showDeleteModal = ref(false);
const isLoading = ref(false);

const openDelete = (t) => {
  selectedTeam.value = t;
  showPopover.value[t.team_id] = false;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (teamList.value.length === 1) {
    return toast.error("Cannot delete the last team");
  }

  try {
    isLoading.value = true;
    const deletedTeamId = selectedTeam.value.team_id;

    await teamStore.deleteTeam(currentRouteWorkspaceId.value, deletedTeamId);
    toast.success("Team deleted successfully");
    showDeleteModal.value = false;

    await teamStore.getTeamByWorkspaceStore(currentRouteWorkspaceId.value);

    if (String(currentRouteTeamId.value) === String(deletedTeamId)) {
      const remaining = teamList.value;
      if (remaining.length > 0) {
        router.push(
          `/workspace/${currentRouteWorkspaceId.value}/team/${remaining[0].team_id}/${currentSection.value}`
        );
      } else {
        router.push(`/workspace/${currentRouteWorkspaceId.value}`);
      }
    }
  } catch (error) {
    console.error("Failed to delete team:", error);
    console.log(error.toast);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.btn-option {
  background-color: transparent !important;
}

.btn-option:hover {
  background-color: #e4e4e7 !important;
}

.btn-option-active {
  background-color: #e4e4e7 !important;
}
</style>
