<template>
  <main class="main">
    <div class="container-fluid px-0">
      <div class="page-header">
        <h1 class="page-title">Profile setting</h1>
        <p class="page-sub">Manage your profile and preferences</p>
      </div>

      <div class="row g-3">
        <!-- LEFT COLUMN -->
        <div class="col-lg-6 col-12">
          <!-- Profile card -->
          <div class="card">
            <div class="profile-row d-flex align-items-center gap-3 flex-wrap">
              <div class="profile-avatar-wrap">
                <img :src="profileStore.user.avatar" class="profile-avatar" alt="" />
                <button class="avatar-edit-btn" @click="showCropper = true">
                  <Camera size="12" />
                </button>
              </div>

              <CropperModal
                v-if="showCropper"
                @closeModal="showCropper = false"
                @save="handleCroppedImage"
                :disable="isLoading"
              />
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
          </div>

          <!-- Personal information card -->
          <div class="card">
            <div class="card-title">Personal information</div>
            <div class="card-sub">Update your display name</div>
            <input
              class="text-input form-control"
              v-model="displayName"
              placeholder="Your name"
            />
            <button
              class="btn bg-btn rounded-btn fs-14 fw-semibold py-2 mt-2"
              :disabled="isLoading"
              @click="handleSave"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              {{ isLoading ? "Saving..." : "Save Change" }}
            </button>
          </div>

          <!-- Tasks overview card -->
          <div class="card">
            <div
              class="card-header-row d-flex align-items-center justify-content-between"
            >
              <span class="card-title">My tasks overview</span>
              <button class="icon-btn"><arrow-up-right size="14" /></button>
            </div>

            <!-- Ring + count -->
            <div
              class="tasks-summary d-flex align-items-center justify-content-between flex-wrap"
            >
              <div>
                <div class="tasks-label">Total tasks</div>
                <div class="tasks-count">
                  {{ tasks.done
                  }}<span class="tasks-total"> / {{ taskSummary.total_tasks }}</span>
                </div>
                <div class="tasks-pct-label">{{ tasks.pct }}% overall completion</div>
              </div>
              <div>
                <n-progress
                  type="circle"
                  :percentage="completionPercentage"
                  :stroke-width="13"
                  style="width: 75px"
                  color="#34C759"
                />
              </div>
            </div>

            <!-- Priority bars -->
            <div
              class="priority-header d-flex align-items-center justify-content-between"
            >
              <span class="priority-title">By priority</span>
              <span class="priority-count">{{ tasks.total }} tasks</span>
            </div>
            <div
              class="bar-row d-flex align-items-center justify-content-between"
              v-for="p in priorities"
              :key="p.label"
            >
              <span class="bar-label">{{ p.label }}</span>
              <n-progress
                type="line"
                :percentage="p.percentage"
                :color="p.color"
                :height="5"
                :show-indicator="false"
              />
              <span class="bar-count">{{ String(p.count).padStart(2, "0") }} tasks</span>
            </div>

            <!-- Approved / Rejected -->
            <div class="row g-2 status-row">
              <div class="col-6" v-for="s in statuses" :key="s.label">
                <div class="status-card">
                  <div class="status-label">{{ s.label }}</div>
                  <n-progress
                    type="circle"
                    :percentage="s.pct"
                    :stroke-width="13"
                    style="width: 75px"
                    class="my-progress"
                    :color="s.color"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-lg-6 col-12">
          <div class="card">
            <!-- My workspace -->
            <div class="ws-section-title fw-medium">My workspace</div>
            <n-empty
              v-if="!MyWorkspaces || MyWorkspaces.length === 0"
              description="No Data"
              class="my-2"
              style="--n-icon-size: 25px"
            />

            <div
              v-else
              class="ws-item d-flex align-items-center justify-content-between mt-2"
              v-for="ws in MyWorkspaces.slice(0, 3)"
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
              v-if="!WorkSpaceInvite || WorkSpaceInvite.length === 0"
              description="No Data"
              class="my-2"
              style="--n-icon-size: 25px"
            />

            <div
              v-else
              class="ws-item d-flex align-items-center justify-content-between mt-2"
              v-for="ws in WorkSpaceInvite.slice(0, 3)"
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
import { useWorkspaceStore } from "@/stores/admin/workspaces";

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const toast = notify(router);
const displayName = ref("");
const currentRouteWorkspaceId = computed(() => route.params.workspace_id);
const currentRouteTeamId = computed(() => route.params.team_id);

const workspaceStore = useWorkspaceStore();

const MyWorkspaces = ref([]);
const WorkspaceStats = ref({});

const showCropper = ref(false);
const isLoading = ref(false);

const { joinedWorkspaces: WorkSpaceInvite } = storeToRefs(profileStore);

onMounted(async () => {
  await profileStore.getProfile();
  await profileStore.GetMyWorkspace();

  displayName.value = profileStore.user.name;
  MyWorkspaces.value = profileStore.myWorkspaces;

  for (const ws of MyWorkspaces.value) {
    try {
      const data = await profileStore.GetWorkspaceMember(ws.workspace_id);

      const teamCount = data?.team?.length || 0;
      const memberIds = new Set();
      data?.team?.forEach((team) => {
        team.members?.forEach((m) => memberIds.add(m.user_id));
      });
      const memberCount = memberIds.size;

      WorkspaceStats.value[ws.workspace_id] = {
        teams: teamCount,
        members: memberCount,
      };
    } catch (err) {
      // console.error('ERROR for workspace', ws.workspace_id, err);
    }
  }
  for (const ws of WorkSpaceInvite.value) {
    try {
      const data = await profileStore.GetWorkspaceMember(ws.workspace_id);

      const teamCount = data?.team?.length || 0;

      const memberIds = new Set();
      data?.team?.forEach((team) => {
        team.members?.forEach((m) => memberIds.add(m.user_id));
      });
      const memberCount = memberIds.size;

      WorkspaceStats.value[ws.workspace_id] = {
        teams: teamCount,
        members: memberCount,
      };
    } catch (err) {
      WorkspaceStats.value[ws.workspace_id] = { teams: 0, members: 0 };
    }
  }
});

const handleCroppedImage = async (blob) => {
  const formData = new FormData();
  formData.append("avatar", blob, "avatar.png");
  isLoading.value = true;
  try {
    await profileStore.UpdateAvatar(formData);
    await profileStore.getProfile();
    await profileStore.GetMyWorkspace();
    showCropper.value = false;
    toast.success("Avatar updated");
  } catch (err) {
    toast.error(err.message || "Failed to update avatar");
  } finally {
    isLoading.value = false;
  }
};

const taskSummary = ref({
  total_tasks: 0,
  priority: { urgent: 0, high: 0, medium: 0, low: 0 },
  status: { approved: 0, rejected: 0 },
});

onMounted(async () => {
  try {
    if (!currentRouteWorkspaceId.value || !currentRouteTeamId.value) {
      console.warn("Workspace ID or Team ID is missing");
      return;
    }

    const res = await profileStore.GetTaskSummary(
      currentRouteWorkspaceId.value,
      currentRouteTeamId.value
    );

    taskSummary.value = res;
  } catch (err) {
    console.error(err);
  }
});

const priorities = computed(() => {
  const total = taskSummary.value.total_tasks || 1;
  return [
    {
      label: "Urgent",
      count: taskSummary.value.priority.urgent,
      percentage: (taskSummary.value.priority.urgent / total) * 100,
      color: "#EF4444",
    },
    {
      label: "High",
      count: taskSummary.value.priority.high,
      percentage: (taskSummary.value.priority.high / total) * 100,
      color: "#F97316",
    },
    {
      label: "Medium",
      count: taskSummary.value.priority.medium,
      percentage: (taskSummary.value.priority.medium / total) * 100,
      color: "#EAB308",
    },
    {
      label: "Low",
      count: taskSummary.value.priority.low,
      percentage: (taskSummary.value.priority.low / total) * 100,
      color: "#22C55E",
    },
  ];
});

const statuses = computed(() => {
  const total = taskSummary.value.total_tasks || 1;
  return [
    {
      label: "Approved",
      pct: (taskSummary.value.status.approved / total) * 100,
      color: "#22C55E",
    },
    {
      label: "Rejected",
      pct: (taskSummary.value.status.rejected / total) * 100,
      color: "#EF4444",
    },
  ];
});

const completionPercentage = computed(() => {
  const total = taskSummary.value.total_tasks;
  if (!total) return 0;
  return Math.round((taskSummary.value.status.approved / total) * 100);
});

const tasks = ref({ done: 17, total: 20, pct: 85 });

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
  width: 42px;
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
