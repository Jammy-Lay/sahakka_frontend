<template>
  <div class="">
    <!-- Header -->
    <div class="d-flex align-items-start justify-content-between mb-3">
      <div>
        <h2 class="fw-semibold fs-5 mb-1">{{ getTeamById.title }}</h2>
        <p class="text-secondary fs-13 mb-0">{{ getTeamById.description }}</p>
      </div>
      <div class="d-flex gap-2">
        <button
          class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1"
        >
          <Filter size="16" /> Filter
        </button>
        <BaseButton
          class="fs-13 py-1 px-3 rounded-btn"
          btn-name="New Task"
          icon="plus"
          @click="showCreateTask = true"
        />
      </div>
    </div>

    <!-- Create Task Modal -->
    <n-modal v-model:show="showCreateTask" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 700px">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-5">Create task</span>
          <n-button
            text
            size="small"
            @click="showCreateTask = false"
            class="text-dark hover-circle p-1 rounded-circle"
          >
            <X size="18" />
          </n-button>
        </div>

        <div class="px-5 pt-2 pb-4">
          <!-- Title -->
          <label class="mb-2 fs-13 fw-medium d-block mt-3">Title</label>
          <BaseInput
            v-model="form.title"
            input-placeholder="Title"
            input-class="py-2 fs-13 rounded-btn-sm bg-white mb-3"
          />

          <!-- Description -->
          <label class="mb-2 fs-13 fw-medium d-block">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="form-control fs-13 rounded-btn-sm bg-white mb-3"
            style="min-height: 120px; resize: vertical; border: 1px solid #e4e4e7"
          />

          <!-- Type of task -->
          <div class="d-flex align-items-center gap-3 mb-3">
            <span class="fs-13 fw-medium">Type of task</span>
            <n-popover
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 160px"
            >
              <template #trigger>
                <span
                  class="tab-info cursor-pointer"
                  :class="[typeConfig[form.type]?.bg, typeConfig[form.type]?.text]"
                >
                  <Circle size="10" :fill="typeConfig[form.type]?.fill" />
                  {{ form.type }}
                </span>
              </template>
              <div>
                <div
                  v-for="(cfg, key) in typeConfig"
                  :key="key"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                  @click="form.type = key"
                >
                  <Circle size="10" :fill="cfg.fill" />
                  {{ key }}
                </div>
              </div>
            </n-popover>
          </div>

          <!-- Meta row -->
          <div class="meta-grid">
            <!-- Labels -->
            <span class="fs-13 text-mute d-flex align-items-center gap-1">
              <circle-dashed size="14" /> Status
            </span>
            <span class="fs-13 text-mute d-flex align-items-center gap-1">
              <ghost size="14" /> Priority
            </span>
            <span class="fs-13 text-mute d-flex align-items-center gap-1">
              <users size="14" /> Assignee
            </span>
            <span class="fs-13 text-mute d-flex align-items-center gap-1">
              <calendar size="14" /> Start date
            </span>
            <span class="fs-13 text-mute d-flex align-items-center gap-1">
              <calendar size="14" /> End Date
            </span>

            <!-- Status -->
            <n-popover
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 160px"
            >
              <template #trigger>
                <span
                  class="tab-info w-fit fw-medium cursor-pointer"
                  :class="[
                    statusConfig[form.status]?.bg,
                    statusConfig[form.status]?.text,
                  ]"
                >
                  <component :is="statusConfig[form.status]?.icon" size="14" />
                  {{ statusConfig[form.status]?.label }}
                </span>
              </template>
              <div>
                <div
                  v-for="(cfg, key) in statusConfig"
                  :key="key"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                  @click="form.status = key"
                >
                  <component :is="cfg.icon" size="14" />
                  {{ cfg.label }}
                </div>
              </div>
            </n-popover>

            <!-- Priority -->
            <n-popover
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 140px"
            >
              <template #trigger>
                <span
                  class="tab-info w-fit fw-medium cursor-pointer"
                  :class="[
                    priorityConfig[form.priority]?.bg,
                    priorityConfig[form.priority]?.text,
                  ]"
                >
                  <Circle size="10" :fill="priorityConfig[form.priority]?.fill" />
                  {{ form.priority }}
                </span>
              </template>
              <div>
                <div
                  v-for="(cfg, key) in priorityConfig"
                  :key="key"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                  @click="form.priority = key"
                >
                  <Circle size="10" :fill="cfg.fill" />
                  {{ key }}
                </div>
              </div>
            </n-popover>

            <!-- Assignee -->
            <n-popover
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 180px"
            >
              <template #trigger>
                <span class="d-flex align-items-center gap-2 fs-13 cursor-pointer">
                  <img
                    :src="form.assignee?.avatar || getMe.avatar"
                    class="rounded-circle object-fit-cover"
                    style="width: 22px; height: 22px"
                  />
                  {{ form.assignee?.name || getMe.name }}
                  <span
                    v-if="!form.assignee || form.assignee.user_id === getMe.user_id"
                    class="text-mute fs-11"
                    >(You)</span
                  >
                </span>
              </template>
              <div>
                <div
                  v-for="member in teamMembers"
                  :key="member.user_id"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                  @click="form.assignee = member"
                >
                  <img
                    :src="member.avatar"
                    class="rounded-circle object-fit-cover"
                    style="width: 22px; height: 22px"
                  />
                  {{ member.name }}
                  <span v-if="member.user_id === getMe.user_id" class="text-mute fs-11">
                    (You)
                  </span>
                </div>
              </div>
            </n-popover>

            <!-- Start date -->
            <n-date-picker
              v-model:value="form.start_date"
              type="date"
              clearable
              :to="false"
              style="width: 150px"
            />

            <!-- End date -->
            <n-date-picker
              v-model:value="form.end_date"
              type="date"
              clearable
              :to="false"
              style="width: 150px"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="d-flex justify-content-end gap-2 px-4 py-3">
          <button
            class="btn btn-outline border rounded-btn-sm fs-13 fw-medium px-4"
            @click="showCreateTask = false"
          >
            Close
          </button>
          <button
            class="btn btn-dark rounded-btn-sm fs-13 fw-medium px-4"
            @click="handleCreateTask"
          >
            Create
          </button>
        </div>
      </div>
    </n-modal>

    <!-- Status Tabs -->
    <div class="d-flex flex-wrap gap-2 mb-3">
      <span class="tab-title tab-dark"><layout-dashboard size="16" /> All tasks</span>
      <span class="tab-title bg-blue text-blue">
        <circle-check-big size="16" /> To do
      </span>
      <span class="tab-title bg-orange text-orange">
        <circle-dashed size="16" /> In process
      </span>
      <span class="tab-title bg-purple text-purple"><Send size="16" /> Submitted</span>
      <span class="tab-title bg-green text-green">
        <CircleCheck size="16" /> Approved
      </span>
      <span class="tab-title bg-red text-danger"><CircleX size="16" /> Rejected</span>
    </div>

    <n-empty
      v-if="getTask.length === 0"
      description="No Data"
      class="mt-8"
      style="--n-icon-size: 45px; font-size: 14px"
    />

    <!-- Task Cards -->
    <n-scrollbar style="max-height: 580px" v-else>
      <div class="d-flex flex-column gap-3">
        <div
          class="bg-white rounded-card border border-0"
          style="padding: 20px; min-height: 220px"
          v-for="task in getTask"
          :key="task.id"
        >
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <!-- No Assignee -->
              <template v-if="!task.assigned_to?.user_id">
                <img
                  src="../../assets/image/default-avatar.png"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-medium text-mute fs-13">No assignee</span>
              </template>

              <!-- Self Assigned -->
              <template
                v-else-if="task.created_by?.user_id === task.assigned_to?.user_id"
              >
                <img
                  :src="task.created_by?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-semibold fs-13">{{ task.created_by?.name }}</span>
                <span class="fw-bold text-mute fs-12">·</span>
                <span class="text-mute fs-13">Self-assigned the task</span>
              </template>

              <!-- Assigned -->
              <template v-else>
                <img
                  :src="task.assigned_to?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-semibold fs-13">{{ task.assigned_by?.name }}</span>
                <span class="fw-bold text-mute fs-12">·</span>
                <span class="text-mute fs-13">Assigned to you</span>
              </template>
            </div>

            <span
              class="tab-title"
              :class="[typeConfig[task.type]?.bg, typeConfig[task.type]?.text]"
            >
              <Circle size="10" :fill="typeConfig[task.type]?.fill" />
              <span class="text-dark fs-14">{{ task.type }}</span>
            </span>
          </div>

          <div class="meta-grid mb-3">
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <circle-dashed size="15" /> Status
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <ghost size="15" /> Priority
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <Users size="15" /> Assignee
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <Calendar size="15" /> Start date
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <Calendar size="15" /> End date
            </span>

            <span
              class="tab-info w-fit fw-medium"
              :class="[
                statusConfigFull[task.status]?.bg,
                statusConfigFull[task.status]?.text,
              ]"
            >
              <component :is="statusConfigFull[task.status]?.icon" size="16" />
              {{ statusConfigFull[task.status]?.label }}
            </span>

            <span
              class="tab-info w-fit fw-medium"
              :class="[
                priorityConfig[task.priority]?.bg,
                priorityConfig[task.priority]?.text,
              ]"
            >
              <Circle size="10" :fill="priorityConfig[task.priority]?.fill" />
              {{ task.priority }}
            </span>

            <span class="d-flex align-items-center gap-2 fs-13">
              <template v-if="!task.assigned_to?.user_id">
                <img
                  src="../../assets/image/default-avatar.png"
                  class="rounded-circle object-fit-cover"
                  style="width: 22px; height: 22px"
                />
                <span class="text-mute">No assignee</span>
              </template>
              <template v-else>
                <img
                  :src="task.assigned_to.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 22px; height: 22px"
                />
                <n-ellipsis
                  style="max-width: 60px"
                  :tooltip="{
                    style: { fontSize: '11px', padding: '4px 8px', borderRadius: '8px' },
                  }"
                >
                  {{ task.assigned_to.name }}
                </n-ellipsis>
                <span
                  v-if="task.assigned_to.user_id === getMe.user_id"
                  class="text-secondary fs-11"
                >
                  (You)
                </span>
              </template>
            </span>

            <span class="fs-13 text-mute">{{ formatDate(task.start_date) }}</span>
            <span class="fs-13 text-mute">{{ formatDate(task.end_date) }}</span>
          </div>

          <p class="fw-semibold mb-2" style="font-size: 18px">{{ task.title }}</p>
          <p class="mb-0 text-mute fs-15">
            {{ task.description || "No description provided" }}
          </p>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  CircleCheckBig,
  CircleDashed,
  Send,
  CircleCheck,
  CircleX,
  X,
} from "lucide-vue-next";

import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const workspace_id = route.params.workspace_id;
const team_id = route.params.team_id;

const taskStore = useTaskStore();
const { getTask } = storeToRefs(taskStore);

const teamStore = useTeamStore();
const { getTeamById } = storeToRefs(teamStore);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

const showCreateTask = ref(false);
const teamMembers = ref([]);

const defaultForm = () => ({
  title: "",
  description: "",
  type: "task",
  status: "todo",
  priority: "low",
  assignee: null,
  start_date: null,
  end_date: null,
});

const form = ref(defaultForm());

const handleCreateTask = async () => {
  if (!form.value.title.trim()) return;
  try {
    // await taskStore.createTaskStore(workspace_id, team_id, form.value)
    showCreateTask.value = false;
    form.value = defaultForm();
    await taskStore.getTaskByTeamStore(workspace_id, team_id);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await teamStore.getTeamByIdStore(workspace_id, team_id);
  await taskStore.getTaskByTeamStore(workspace_id, team_id);
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

const statusConfig = {
  todo: { icon: CircleCheckBig, bg: "bg-blue", text: "text-blue", label: "To Do" },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
};

const statusConfigFull = {
  todo: { icon: CircleCheckBig, bg: "bg-blue", text: "text-blue", label: "To Do" },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
  submitted: { icon: Send, bg: "bg-purple", text: "text-purple", label: "Submitted" },
  approved: { icon: CircleCheck, bg: "bg-green", text: "text-green", label: "Approved" },
  rejected: { icon: CircleX, bg: "bg-red", text: "text-danger", label: "Rejected" },
};

const priorityConfig = {
  low: { bg: "bg-gray", text: "text-dark", fill: "#171717" },
  medium: { bg: "bg-orange", text: "text-orange", fill: "#FF8D28" },
  high: { bg: "bg-red", text: "text-danger", fill: "#FF383C" },
  urgent: { bg: "bg-purple", text: "text-purple", fill: "#6155F5" },
};

const typeConfig = {
  bug: { bg: "bg-red", text: "text-danger", fill: "#FF383C" },
  task: { bg: "bg-blue", text: "text-blue", fill: "#0088FF" },
  feature: { bg: "bg-aqua", text: "text-aqua", fill: "#00C3D0" },
  improvement: { bg: "bg-purple", text: "text-purple", fill: "#6155F5" },
};
</script>

<style scoped>
.tab-title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 99px;
  padding: 6px 11.5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
}
.tab-info {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 99px;
  padding: 5px 11px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
  white-space: nowrap;
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
  text-align: center;
}
:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical) {
  right: -100px !important;
}
</style>
