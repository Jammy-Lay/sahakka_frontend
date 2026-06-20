<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Hello</h5>
      <span class="text-mute fs-14">All Activity</span>
    </div>

    <!-- Loading state -->
    <div v-if="teamStore.activityLoading" class="text-mute fs-13 text-center py-5">
      Loading activity...
    </div>

    <!-- Empty state -->
    <n-empty
      v-else-if="groupedActivities.length === 0"
      description="No Activity Yet"
      class="mt-5"
      style="--n-icon-size: 45px; font-size: 14px"
    />

    <!-- Activity list -->
    <div v-else class="team-activity-list">
      <template v-for="(group, gi) in groupedActivities" :key="gi">
        <div class="activity-date-label">
          <Calendar size="13" />
          {{ group.date }}
        </div>

        <div class="row gy-1 gx-3">
          <div class="col-lg-6" v-for="(act, ai) in group.items" :key="ai">
            <div class="activity-card rounded-card">
              <span class="act-tag" :class="actTagClass(act.action)">
                <component :is="actTagIcon(act.action)" size="14" />
                {{ act.action }}
              </span>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2">
                  <img
                    :src="act.user?.avatar"
                    class="rounded-circle object-fit-cover"
                    style="width: 24px; height: 24px"
                  />
                  <span class="fw-semibold fs-13">{{ act.user?.name }}</span>
                </div>
                <span class="fs-11 text-mute">{{ act.time }}</span>
              </div>

              <div class="act-note">{{ act.note }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { Calendar, Plus, UserCheck, Send, Trash2, Pencil } from "lucide-vue-next";
import { useTeamStore } from "@/stores/user/team";

const route = useRoute();
const workspace_id = computed(() => route.params.workspace_id);
const team_id = computed(() => route.params.team_id);

const teamStore = useTeamStore();
const { getActivityTeam } = storeToRefs(teamStore);

onMounted(async () => {
  await teamStore.getActivityTeamStore(workspace_id.value, team_id.value);
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

const groupedActivities = computed(() => {
  if (!getActivityTeam.value || !getActivityTeam.value.length) return [];

  const groups = {};
  for (const act of getActivityTeam.value) {
    const dateKey = formatDate(act.created_at);
    if (!groups[dateKey]) groups[dateKey] = { date: dateKey, items: [] };
    groups[dateKey].items.push({
      action: act.action,
      note: act.message,
      user: act.created_by,
      time: new Date(act.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: act.created_at,
    });
  }
  return Object.values(groups);
});

const actTagClass = (action) => {
  const map = {
    create: "act-tag-create",
    assign: "act-tag-assign",
    update: "act-tag-update",
    delete: "act-tag-delete",
  };
  return map[action?.toLowerCase()] || "act-tag-update";
};

const actTagIcon = (action) => {
  const map = { create: Plus, assign: UserCheck, update: Pencil, delete: Trash2 };
  return map[action?.toLowerCase()];
};
</script>

<style scoped></style>
