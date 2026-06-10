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
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="d-flex flex-wrap gap-2 mb-3">
      <span class="tab-title bg-red text-dark">
        <Circle size="10" fill="#FF383C" class="text-danger" /> Bug
      </span>
      <span class="tab-title bg-purple text-dark">
        <Circle size="10" fill="#6155F5" class="text-purple" /> Improvement
      </span>
    </div>

    <!-- <div
      class="bg-white rounded-card border border-0"
      style="padding: 20px; min-height: 220px"
      v-if="getTaskByTeam.length === 0"
    >
      <n-empty
        description="No Data"
        class="mt-7"
        style="--n-icon-size: 45px; font-size: 14px"
      />
    </div> -->

    <n-empty
      v-if="getIssueTask.length === 0"
      description="No Data"
      class="mt-8"
      style="--n-icon-size: 45px; font-size: 14px"
    />

    <!-- Task Card -->
    <n-scrollbar style="max-height: 580px" v-else>
      <div class="d-flex flex-column gap-3">
        <div
          class="bg-white rounded-card border border-0"
          style="padding: 20px; min-height: 220px"
          v-for="task in getIssueTask"
          :key="task.id"
        >
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <!-- No Assignee -->
              <template v-if="!task.assigned_to?.user_id">
                <img
                  src="../../assets/image//default-avatar.png"
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

                <span class="fw-semibold fs-13">
                  {{ task.created_by?.name }}
                </span>

                <span class="fw-bold text-mute fs-12">·</span>

                <span class="text-mute fs-13"> Self-assigned the task </span>
              </template>

              <!-- Assigned -->
              <template v-else>
                <img
                  :src="task.assigned_to?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />

                <span class="fw-semibold fs-13">
                  {{ task.assigned_by?.name }}
                </span>

                <span class="fw-bold text-mute fs-12">·</span>

                <span class="text-mute fs-13"> Assigned to you </span>
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
            <span
              class="tab-info w-fit fw-medium"
              :class="[statusConfig[task.status]?.bg, statusConfig[task.status]?.text]"
            >
              <component :is="statusConfig[task.status]?.icon" size="16" />

              {{ statusConfig[task.status]?.label }}
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

            <span class="fs-13 text-mute">{{
              formatDate(task.start_date) || N / A
            }}</span>
            <span class="fs-13 text-mute">{{ formatDate(task.end_date) || N / A }}</span>
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
import {
  CircleCheckBig,
  CircleDashed,
  Send,
  CircleCheck,
  CircleX,
} from "lucide-vue-next";

import BaseButton from "@/components/BaseButton.vue";
import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();

const workspace_id = route.params.workspace_id;
const team_id = route.params.team_id;

const taskStore = useTaskStore();
const { getIssueTask } = storeToRefs(taskStore);

const teamStore = useTeamStore();
const { getTeamById } = storeToRefs(teamStore);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

onMounted(async () => {
  await teamStore.getTeamByIdStore(workspace_id, team_id);
  await taskStore.getTaskByTeamStore(workspace_id, team_id, status);
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
  todo: {
    icon: CircleCheckBig,
    bg: "bg-blue",
    text: "text-blue",
    label: "To Do",
  },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
  submitted: {
    icon: Send,
    bg: "bg-purple",
    text: "text-purple",
    label: "Submitted",
  },
  approved: {
    icon: CircleCheck,
    bg: "bg-green",
    text: "text-green",
    label: "Approved",
  },
  rejected: {
    icon: CircleX,
    bg: "bg-red",
    text: "text-danger",
    label: "Rejected",
  },
};

const priorityConfig = {
  low: {
    bg: "bg-gray",
    text: "text-dark",
    fill: "#171717",
  },
  medium: {
    bg: "bg-orange",
    text: "text-orange",
    fill: "#FF8D28",
  },
  high: {
    bg: "bg-red",
    text: "text-danger",
    fill: "#FF383C",
  },
  urgent: {
    bg: "bg-purple",
    text: "text-purple",
    fill: "#6155F5",
  },
};

const typeConfig = {
  bug: {
    bg: "bg-red",
    text: "text-danger",
    fill: "#FF383C",
  },
  task: {
    bg: "bg-blue",
    text: "text-blue",
    fill: "#0088FF",
  },
  feature: {
    bg: "bg-aqua",
    text: "text-aqua",
    fill: "#00C3D0",
  },
  improvement: {
    bg: "bg-purple",
    text: "text-purple",
    fill: "#6155F5",
  },
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
