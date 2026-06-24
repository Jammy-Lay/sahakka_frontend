<template>
  <div>
    <TeamActivitySkeleton v-if="teamStore.activityLoading"/>
    <div v-else class="mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 class="fw-semibold fs-5 mb-1">{{ getTeamById.title }}</h2>
          <p class="text-secondary fs-13 mb-0">{{ getTeamById.description }}</p>
        </div>
        <button
          class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1"
        >
          <Filter size="16" /> Filter
        </button>
      </div>

      <!-- Empty state -->
      <n-empty
        v-if="groupedActivities.length === 0"
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

                <div class="act-note text-truncate">{{ act.note }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { Calendar, Plus, UserCheck, Send, Trash2, Pencil, Eye } from "lucide-vue-next";
import { useTeamStore } from "@/stores/user/team";
import TeamActivitySkeleton from "@/components/Skeleton/TeamActivitySkeleton.vue";

const route = useRoute();
const workspace_id = computed(() => route.params.workspace_id);
const team_id = computed(() => route.params.team_id);

const teamStore = useTeamStore();
const { getActivityTeam, getTeamById } = storeToRefs(teamStore);

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
    submit: "act-tag-submit",
    delete: "act-tag-delete",
    review: "act-tag-review",
  };
  return map[action?.toLowerCase()];
};

const actTagIcon = (action) => {
  const map = { create: Plus, assign: UserCheck, submit: Send, delete: Trash2, review: Eye };
  return map[action?.toLowerCase()];
};
</script>

<style scoped></style>
