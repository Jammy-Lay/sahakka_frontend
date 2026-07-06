<template>
  <main class="main">
    <div class="container-fluid px-0">
      <div class="page-header">
        <h1 class="page-title">Profile setting</h1>
        <p class="page-sub text-mute">Manage your profile and preferences</p>
      </div>

      <div class="row g-3">
        <!-- LEFT COLUMN -->
        <div class="col-lg-6 col-12">
          <!-- Profile card -->
          <ProfileSkeleton class="w-100 mb-3" v-if="profileStore.loading" />
          <div v-else class="card">
            <div class="d-flex justify-content-between">
              <div class="profile-row d-flex align-items-center gap-3 flex-wrap">
                <div class="profile-avatar-wrap">
                  <img :src="profileStore.user.avatar" class="profile-avatar" alt="" />
                  <n-tooltip
                    placement="bottom"
                    trigger="hover"
                    :show-arrow="false"
                    keepAliveOnHover: false,
                    :style="{
                      fontSize: '11px !important',
                      padding: '4px 8px !important',
                      borderRadius: '8px !important',
                      marginTop: '1px !important',
                      marginLeft: '0px !important',
                      pointerEvents: 'none',
                    }"
                  >
                <template #trigger>
                  <button class="avatar-edit-btn" @click="showCropper = true">
                    <Camera size="12" />
                  </button>
                </template>
                   Change Avatar
                  </n-tooltip>
                </div>

                <div class="profile-info">
                  <div class="profile-name">{{ profileStore.user.name }}</div>
                  <div class="profile-email">{{ profileStore.user.email }}</div>
                  <div class="profile-joined">
                    <Calendar size="12" /> Joined
                    {{
                      new Date(profileStore.user.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    }}
                  </div>
                </div>
              </div>
                <button
                    class="btn bg-danger text-white h-fit w-fit border-0 rounded-btn fs-14 d-flex align-items-center justify-content-center gap-2"
                    @click="showDeleteModal = true"
                  >
                    <Image-off size="15" /> Delete Avatar
                  </button>
            </div>
          </div>

          <PersonalSkeleton class="w-100 mb-3" v-if="profileStore.loading" />
          
          <!-- Personal information card -->
          <div v-else class="card">
            <div class="card-title">Personal information</div>
            <div class="card-sub">Update your display name</div>
            <input
              class="text-input form-control"
              v-model="displayName"
              placeholder="Your name"
            />
            <button
              class="btn bg-btn rounded-btn fs-14 fw-medium py-2 mt-3"
              :disabled="isLoading"
              @click="handleSave"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              {{ isLoading ? "Saving..." : "Save Change" }}
            </button>
          </div>

          <!-- Tasks overview card -->
          <TaskOverviewSkeleton class="w-100" v-if="taskStore.summaryLoading" />
          <div v-else class="card">
            <div
              class="card-header-row d-flex align-items-center justify-content-between mb-2"
            >
              <span class="card-title">My tasks overview</span>
              <n-popover
                trigger="click"
                placement="bottom-end"
                :show-arrow="false"
                v-model:show="showFilterPop"
                style="
                  border-radius: 12px;
                  padding: 6px;
                  width: 150px;
                  margin-right: -30px;
                "
              >
                <template #trigger>
                  <button
                    class="btn btn-white bg-accent rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1 ms-auto"
                  >
                    <Filter size="16" /> Filter
                  </button>
                </template>
                <div class="d-flex flex-column gap-1">
                  <div
                    v-for="team in teamsInCurrentWorkspace"
                    :key="team.team_id"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                    :class="
                      String(selectedTeamId) === String(team.team_id)
                        ? 'fw-semibold bg-accent'
                        : ''
                    "
                    @click="handleFilterChange(team.team_id)"
                  >
                    <Users size="15"/> {{ team.title }}
                  </div>
                </div>
              </n-popover>
            </div>

            <!-- Ring + count -->
            <div
              class="tasks-summary d-flex align-items-center justify-content-between flex-wrap"
            >
              <div>
                <div class="tasks-label">Total tasks</div>
                <div class="tasks-count">
                  {{ summary.status?.approved || 0 }}
                  <span class="tasks-total"> / {{ total }}</span>
                </div>
                <div class="tasks-pct-label">
                  {{ completedPercentage }}% overall completion
                </div>
              </div>
              <div>
                <n-progress
                  type="circle"
                  :percentage="completedPercentage"
                  :stroke-width="13"
                  style="width: 105px"
                  color="#34C759"
                  class="all-progress"
                />
              </div>
            </div>

            <!-- Priority bars -->
            <div
              class="priority-header mb-3 d-flex align-items-center justify-content-between"
            >
              <span class="priority-title">By priority</span>
              <span class="priority-count fs-13">{{ total }} tasks</span>
            </div>
            <div>
              <div class="bar-row d-flex align-items-center justify-content-between">
                <span class="bar-label">Urgent</span>
                <n-progress
                  type="line"
                  :percentage="urgentPercentage"
                  :height="7"
                  :show-indicator="false"
                  processing
                  color="#6155F5"
                />
                <span class="bar-count fs-13"
                  >{{
                    String(summary.priority?.urgent || 0).padStart(2, "0")
                  }}
                  tasks</span
                >
              </div>
              <div class="bar-row d-flex align-items-center justify-content-between">
                <span class="bar-label">High</span>
                <n-progress
                  type="line"
                  :percentage="highPercentage"
                  :height="7"
                  :show-indicator="false"
                  processing
                  color="#FF383C"
                />
                <span class="bar-count fs-13"
                  >{{ String(summary.priority?.high || 0).padStart(2, "0") }} tasks</span
                >
              </div>
              <div class="bar-row d-flex align-items-center justify-content-between">
                <span class="bar-label">Medium</span>
                <n-progress
                  type="line"
                  :percentage="mediumPercentage"
                  :height="7"
                  :show-indicator="false"
                  processing
                  color="#FF8D28"
                />
                <span class="bar-count fs-13"
                  >{{
                    String(summary.priority?.medium || 0).padStart(2, "0")
                  }}
                  tasks</span
                >
              </div>
              <div class="bar-row d-flex align-items-center justify-content-between">
                <span class="bar-label">Low</span>
                <n-progress
                  type="line"
                  :percentage="lowPercentage"
                  :height="7"
                  :show-indicator="false"
                  processing
                  color="#171717"
                />
                <span class="bar-count fs-13"
                  >{{ String(summary.priority?.low || 0).padStart(2, "0") }} tasks</span
                >
              </div>
            </div>

            <!-- Approved / Rejected -->
            <div class="row g-2 status-row mt-0">
              <div class="col-6">
                <div class="status-card bg-accent">
                  <div class="status-label">Approved</div>
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                      {{ summary.status?.approved || 0 }} / {{ total }}
                    </h5>
                    <n-progress
                      type="circle"
                      :percentage="approvedPercentage"
                      :stroke-width="13"
                      style="width: 85px"
                      class="my-progress"
                      color="#34C759"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="status-card bg-accent">
                  <div class="status-label">Rejected</div>
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                      {{ summary.status?.rejected || 0 }} / {{ total }}
                    </h5>
                    <n-progress
                      type="circle"
                      :percentage="rejectedPercentage"
                      :stroke-width="13"
                      style="width: 85px"
                      class="my-progress"
                      color="#FF383C"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-lg-6 col-12">
          <WorkspaceSkeleton class="w-100" v-if="workspaceStore.loading" />
          <div v-else class="card">
            <!-- My workspace -->
            <div class="ws-section-title fw-medium">My workspace</div>
            <n-empty
              v-if="myWorkspaces.length === 0"
              description="No Data"
              class="my-2"
              style="--n-icon-size: 35px"
            />

            <div
              v-else
              class="ws-item d-flex align-items-center justify-content-between mt-2"
              v-for="ws in myWorkspaces"
              :key="ws.workspace_id"
            >
              <img :src="ws.creator?.avatar" alt="" class="img-w me-2" />

              <div class="ws-info">
                <div class="ws-name text-sm fw-medium mb-2">
                  {{ ws.workspace_name }}
                </div>
                <div class="ws-meta">
                  {{ WorkspaceStats?.[ws.workspace_id]?.members ?? 0 }} Members ·
                  {{ WorkspaceStats?.[ws.workspace_id]?.teams ?? 0 }} Teams
                </div>
              </div>

              <button class="ws-arrow-btn">
                <ArrowUpRight :size="24" />
              </button>
            </div>

            <div class="ws-divider" />

            <!-- Invited workspace -->
            <div class="ws-section-title fw-medium">Invited workspace</div>
            <n-empty
              v-if="joinedWorkspaces.length === 0"
              description="No Data"
              class="my-2"
              style="--n-icon-size: 35px"
            />

            <div
              v-else
              class="ws-item d-flex align-items-center justify-content-between mt-2"
              v-for="ws in joinedWorkspaces"
              :key="ws.workspace_id"
            >
              <img :src="ws.creator?.avatar" alt="" class="img-w me-2" />

              <div class="ws-info">
                <div class="ws-name text-sm fw-medium mb-2">
                  {{ ws.workspace_name }}
                </div>
                <div class="ws-meta">
                  {{ WorkspaceStats?.[ws.workspace_id]?.members ?? 0 }} Members ·
                  {{ WorkspaceStats?.[ws.workspace_id]?.teams ?? 0 }} Teams
                </div>
              </div>

              <button class="ws-arrow-btn">
                <ArrowUpRight :size="24" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <CropperModal
    v-if="showCropper"
    @closeModal="showCropper = false"
    @save="handleCroppedImage"
    :disable="isLoading"
  />

  <n-modal v-model:show="showDeleteModal" :mask-closable="true">
    <div class="bg-white rounded-card" style="width: 380px">
      <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
        <span class="fw-medium fs-15">Delete Avatar</span>
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
        <p class="fs-13 text-mute mb-4 text-center">Are you sure you want to delete ?</p>
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
            :disabled="isLoadings"
          >
            <span v-if="isLoadings" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoadings ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { User, Lock, HelpCircle, Camera, ArrowUpRight, Calendar } from "lucide-vue-next";
import { useProfileStore } from "@/stores/profile/profile";
import { notify } from "@/utils/toast";
import { storeToRefs } from "pinia";
import AvatarCropModal from "@/components/profile/AvatarCropModal.vue";
import CropperModal from "@/components/profile/CropperModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import ProfileSkeleton from "@/components/Skeleton/ProfileSkeleton.vue";
import PersonalSkeleton from "@/components/Skeleton/PersonalSkeleton.vue";
import TaskOverviewSkeleton from "@/components/Skeleton/TaskOverviewSkeleton.vue";
import WorkspaceSkeleton from "@/components/Skeleton/WorkspaceSkeleton.vue";

const router = useRouter();
const toast = notify(router);
const displayName = ref("");

const workspaceStore = UseWorkspaceStore();
const { myWorkspaces, joinedWorkspaces } = storeToRefs(workspaceStore);

const teamStore = useTeamStore();
const { getTeamByWorkspace } = storeToRefs(teamStore);

const profileStore = useProfileStore();
const { joinedWorkspaces: WorkSpaceInvite, user } = storeToRefs(profileStore);

const taskStore = useTaskStore();
const { getTask, getSummaryTask } = storeToRefs(taskStore);

const selectedTeamId = ref(null);
const showFilterPop = ref(false);
const showDeleteModal = ref(false);
const teamsInCurrentWorkspace = ref([]);

const handleFilterChange = async (team_id) => {
  selectedTeamId.value = team_id;
  showFilterPop.value = false;

  const userId = profileStore.user?.user_id;
  const raw = localStorage.getItem(`lastVisited_${userId}`);
  if (raw) {
    const parsed = JSON.parse(raw);
    await taskStore.getSummaryTaskStore(parsed.workspace_id, team_id);
  }
};

const summary = computed(() => getSummaryTask.value || {});
const total = computed(() => summary.value.total_tasks || 0);

const completedPercentage = computed(() => {
  if (total.value === 0) return 0;
  const done =
    (summary.value.status?.approved || 0) + (summary.value.status?.rejected || 0);
  return Math.round((done / total.value) * 100);
});

const approvedPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.status?.approved || 0) / total.value) * 100);
});

const rejectedPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.status?.rejected || 0) / total.value) * 100);
});

const urgentPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.priority?.urgent || 0) / total.value) * 100);
});

const highPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.priority?.high || 0) / total.value) * 100);
});

const mediumPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.priority?.medium || 0) / total.value) * 100);
});

const lowPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.priority?.low || 0) / total.value) * 100);
});

const MyWorkspaces = ref([]);
const WorkspaceStats = ref({});

const showCropper = ref(false);
const isLoading = ref(false);
const isLoadings = ref(false);

onMounted(async () => {
  await profileStore.getProfile();
  displayName.value = profileStore.user.name;

  const userId = profileStore.user?.user_id;
  let currentWorkspaceId = null;

  if (userId) {
    const raw = localStorage.getItem(`lastVisited_${userId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        currentWorkspaceId = parsed.workspace_id;
        selectedTeamId.value = parsed.team_id ?? null;
      } catch (err) {}
    }
  }

  await Promise.all([
    workspaceStore.getMyWorkspaceStore(),
    profileStore.GetMyWorkspace(),
    currentWorkspaceId && teamStore.getTeamByWorkspaceStore(currentWorkspaceId),
    currentWorkspaceId && selectedTeamId.value &&
      taskStore.getSummaryTaskStore(currentWorkspaceId, selectedTeamId.value),
  ].filter(Boolean));

  MyWorkspaces.value = profileStore.myWorkspaces;
  teamsInCurrentWorkspace.value = getTeamByWorkspace.value || [];

  const allWorkspaces = [
    ...MyWorkspaces.value,
    ...WorkSpaceInvite.value,
  ];

  await Promise.all(
    allWorkspaces.map(async (ws) => {
      try {
        const data = await profileStore.GetWorkspaceMember(ws.workspace_id);
        const memberIds = new Set();
        data?.team?.forEach((team) => {
          team.members?.forEach((m) => memberIds.add(m.user_id));
        });
        WorkspaceStats.value[ws.workspace_id] = {
          teams: data?.team?.length || 0,
          members: memberIds.size,
        };
      } catch {
        WorkspaceStats.value[ws.workspace_id] = { teams: 0, members: 0 };
      }
    })
  );
});

const handleCroppedImage = async (blob) => {
  const formData = new FormData();
  formData.append("avatar", blob, "avatar.png");
  isLoading.value = true;
  try {
    await profileStore.UpdateAvatar(formData);
    await profileStore.getProfile();
    await profileStore.GetMyWorkspace();
    await workspaceStore.getMyWorkspaceStore();
    showCropper.value = false;
    toast.success("Avatar updated");
  } catch (err) {
    toast.error(err.message || "Failed to update avatar");
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isLoading.value = true;
  try {
    await profileStore.UpdateName(displayName.value);
    toast.success("Name updated");
  } catch (err) {
    toast.error(err.message);
    console.error(err.message);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async () => {
  if (user.value.avatar.includes("default-avatar.png")) {
    toast.error("You don't have an avatar to delete");
    showDeleteModal.value = false;
    return;
  }

  isLoadings.value = true;
  try {
    await profileStore.DeleteAvatar();
    toast.success("Delete Avatar Successfully");
  } catch (error) {
    toast.error(error.message);
  } finally {
    await profileStore.getProfile();
    showDeleteModal.value = false;
    isLoadings.value = false;
  }
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.img-w {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

.main {
  flex: 1;
  padding: 32px 28px;
  background: #f2f5f9;
  overflow-y: auto;
}

.page-title {
  font-size: 30px;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -2.5%;
  color: #09090b;
}

.page-sub {
  font-size: 18px;
  font-weight: 400;
  color: #aab0c4;
  line-height: 28px;
  margin-top: 2px;
  margin-bottom: 24px;
}

/* Card */
.card {
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e8eaf0;
  margin-bottom: 16px;
}

.card:last-child {
  margin-bottom: 0;
}

.card-title {
  font-size: 24px;
  font-weight: 500;
  color: #09090b;
  line-height: 32px;
  letter-spacing: -0.6px;
}

.card-sub {
  font-size: 16px;
  color: #71717a;
  font-weight: 400;
  line-height: 24px;
  margin-top: 2px;
  margin-bottom: 14px;
}

/* Profile card */
.profile-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  object-fit: cover;
}

.avatar-edit-btn {
  position: absolute;
  bottom: -4px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fafafa;
}
.profile-info {
  min-width: 0;
}

.profile-name {
  font-size: 24px;
  font-weight: 500;
  color: #09090b;
  line-height: 32px;
  letter-spacing: -0.6px;
  word-break: break-word;
}

.profile-email {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #aab0c4;
  margin-top: 1px;
  word-break: break-word;
}

.profile-joined {
  font-size: 14px;
  font-weight: 400;
  color: #aab0c4;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Input + button */
.text-input {
  padding: 16px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 400;
  color: #1a1a2e;
  outline: none;
  transition: border 0.15s;
  background: #ffffff;
}

.text-input:focus {
  border-color: #1a1a2e;
  box-shadow: none;
}

.save-btn {
  margin-top: 12px;
  padding: 10px;
  background: #171717;
  color: #fafafa;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.save-btn:hover {
  opacity: 0.85;
  color: #fafafa;
}

/* Icon button */
.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #e0e3ec;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5c6070;
  flex-shrink: 0;
}

/* Tasks summary */
.tasks-summary {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 16px;
  gap: 12px;
}

.tasks-label {
  font-size: 18px;
  font-weight: 400;
  color: #09090b;
  line-height: 28px;
  margin-bottom: 3px;
}

.tasks-count {
  font-size: 48px;
  font-weight: 400;
  color: #171717;
  line-height: 100%;
  letter-spacing: -2.5%;
}

.tasks-total {
  font-size: 30px;
  font-weight: 400;
  color: #71717a;
  line-height: 36px;
  letter-spacing: -0.75%;
}

.all-progress :deep(.n-progress-text) {
  font-size: 18px !important;
  font-weight: bold;
}

.my-progress :deep(.n-progress-text) {
  font-size: 14px !important;
  font-weight: bold;
}

.tasks-pct-label {
  font-size: 14px;
  font-weight: 500;
  color: #71717a;
  line-height: 20px;
  margin-top: 3px;
}

/* Priority bars */
.priority-header {
  margin-bottom: 10px;
}

.priority-title {
  font-size: 18px;
  font-weight: 400;
  color: #09090b;
  line-height: 100%;
}

.priority-count {
  font-size: 11px;
  color: #aab0c4;
}

.bar-row {
  gap: 8px;
  margin-bottom: 7px;
}

.bar-label {
  width: 100px;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  color: #09090b;
  flex-shrink: 0;
}

.bar-count {
  font-size: 10px;
  color: #aab0c4;
  width: 60px;
  text-align: right;
  flex-shrink: 0;
}

/* Status */
.status-row {
  margin-top: 16px;
}

.status-card {
  background: #f7f8fc;
  border-radius: 12px;
  padding: 12px 14px;
  height: 100%;
}

.status-label {
  font-size: 16px;
  color: #09090b;
  margin-bottom: 8px;
  font-weight: 400;
}

/* ── Right column / workspace items ── */
.ws-section-title {
  font-size: 24px;
  font-weight: 600;
  color: #09090b;
  margin-bottom: 10px;
  line-height: 1.5;
  letter-spacing: -0.6px;
}

.ws-divider {
  height: 1px;
  background: #ffffff;
  margin: 14px 0;
}

.ws-item {
  min-height: 84px;
  gap: 8px;
  padding: 16px;
  cursor: pointer;
  background-color: #f5f5f5;
  border-radius: 12px;
}

.ws-info {
  flex: 1;
  min-width: 0;
}

.ws-name {
  font-size: 18px;
  font-weight: 600;
  color: #09090b;
  line-height: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ws-meta {
  font-size: 14px;
  font-weight: 500;
  color: #71717a;
  line-height: 100%;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ws-arrow-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a1a2e;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.ws-arrow-btn:hover {
  opacity: 0.8;
}

/* ── Responsive tweaks (fine-tuning on top of Bootstrap grid) ── */
@media (max-width: 991.98px) {
  .main {
    padding: 24px 18px;
  }
}

@media (max-width: 575.98px) {
  .main {
    padding: 16px 12px;
  }

  .card {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .page-sub {
    font-size: 14px;
    margin-bottom: 14px;
  }

  .profile-avatar {
    width: 64px;
    height: 64px;
  }

  .profile-name {
    font-size: 18px;
    line-height: 24px;
  }

  .card-title {
    font-size: 18px;
    line-height: 24px;
  }

  .tasks-count {
    font-size: 34px;
  }

  .tasks-total {
    font-size: 20px;
    line-height: 26px;
  }

  .bar-label {
    width: 70px;
    font-size: 11px;
  }

  .ws-item {
    padding: 12px;
  }

  .img-w {
    width: 42px;
    height: 42px;
  }

  .ws-name {
    font-size: 15px;
    line-height: 22px;
  }
}
</style>
