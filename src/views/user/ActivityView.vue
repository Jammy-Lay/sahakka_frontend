<template>
  <div>
    <TeamActivitySkeleton v-if="teamStore.activityLoading" />
    <div v-else>
      <div class="pt-4 pb-1 bg-body position-sticky top-0">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h2 class="fw-semibold fs-5 mb-1">{{ getTeamById.title }}</h2>
            <p class="text-secondary fs-13 mb-0">{{ getTeamById.description }}</p>
          </div>

          <n-popover
            v-model:show="showFilter"
            trigger="click"
            placement="bottom-end"
            :show-arrow="false"
            style="
              padding: 0;
              border-radius: 16px;
              width: 290px;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            "
          >
            <template #trigger>
              <n-badge
                :value="activeFilter !== 'all' ? 1 : 0"
                color="#6155F5"
                :offset="[-2, 2]"
                class="font-pp"
              >
                <button
                  class="btn btn-white font-pp bg-white text-dark rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1"
                >
                  <Filter size="16" /> Filter
                </button>
              </n-badge>
            </template>

            <!-- Popover Body -->
            <div class="p-3">
              <!-- Title -->
              <div class="fs-13 mb-2 text-dark fw-semibold">Filter by Date</div>

              <!-- Preset Pills -->
              <div class="d-flex flex-column gap-1 mb-3">
                <div
                  v-for="preset in presets"
                  :key="preset.value"
                  @click="applyPreset(preset.value)"
                  :class="
                    activeFilter === preset.value ? 'preset-active' : 'preset-default'
                  "
                >
                  <calendar-clock size="16" class="me-2" /> {{ preset.label }}
                </div>
              </div>

              <!-- Divider -->
              <div
                style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px"
              >
                <div style="flex: 1; height: 1px; background: #e4e4e7" />
                <span class="fs-11 text-dark" style="white-space: nowrap">
                  Custom Range
                </span>
                <div style="flex: 1; height: 1px; background: #e4e4e7" />
              </div>

              <!-- Date Range Picker -->
              <n-date-picker
                v-model:value="customRange"
                type="daterange"
                size="small"
                clearable
                :to="false"
                class="custom-picker"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                @update:value="applyCustomRange"
                style="width: 100%"
              />

              <!-- Clear Button -->
              <div
                v-if="activeFilter !== 'all'"
                @click="clearFilter"
                class="btn bg-btn w-100 mt-3 fs-13 rounded-btn"
              >
                Clear Filter
              </div>
            </div>
          </n-popover>
        </div>

        <!-- Active Filter Tag -->
        <div v-if="activeFilter !== 'all'" class="mb-3">
          <n-tag
            closable
            :color="{ color: '#CFCCFC', textColor: '#6155F5', borderColor: '#CFCCFC' }"
            style="font-size: 12px; border-radius: 20px; padding: 2px 14px"
            @close="clearFilter"
            class="d-flex justify-content-center align-items-center w-fit"
          >
            <template #icon>
              <n-icon :size="13"><Calendar /></n-icon>
            </template>
            {{ activeFilterLabel }}
          </n-tag>
        </div>
      </div>

      <!-- Empty State -->
      <n-empty
        v-if="groupedActivities.length === 0"
        description="No Activity Yet"
        class="mt-5"
        style="--n-icon-size: 45px; font-size: 14px"
      />

      <!-- Activity List -->
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
                  {{ formatActionLabel(act.action) }}
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
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import {
  Calendar,
  Filter,
  Plus,
  UserCheck,
  Send,
  Trash2,
  Eye,
  Ban,
  LogOut,
  Brush,
  UserPlus,
  UserMinus,
} from "lucide-vue-next";
import { NPopover, NBadge, NTag, NDatePicker, NIcon, NEmpty } from "naive-ui";
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

const showFilter = ref(false);
const activeFilter = ref("all");
const customRange = ref(null);

const presets = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const activeFilterLabel = computed(() => {
  if (activeFilter.value === "custom" && customRange.value) {
    const fmt = (ts) =>
      new Date(ts).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    return `${fmt(customRange.value[0])} - ${fmt(customRange.value[1])}`;
  }
  return presets.find((p) => p.value === activeFilter.value)?.label || "";
});

const applyPreset = (value) => {
  activeFilter.value = value;
  customRange.value = null;
  showFilter.value = false;
};

const applyCustomRange = (val) => {
  if (val) {
    customRange.value = val;
    activeFilter.value = "custom";
    showFilter.value = false;
  }
};

const clearFilter = () => {
  activeFilter.value = "all";
  customRange.value = null;
};

const getDateRange = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (activeFilter.value === "today") return { from: startOfDay, to: now };
  if (activeFilter.value === "week") {
    const from = new Date(startOfDay);
    from.setDate(from.getDate() - from.getDay());
    return { from, to: now };
  }
  if (activeFilter.value === "month") {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  }
  if (activeFilter.value === "custom" && customRange.value) {
    return {
      from: new Date(customRange.value[0]),
      to: new Date(customRange.value[1] + 86399999),
    };
  }
  return null;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getDate()} / ${date.toLocaleString("en-US", {
    month: "short",
  })} / ${date.getFullYear()}`;
};

const groupedActivities = computed(() => {
  if (!getActivityTeam.value?.length) return [];

  const range = getDateRange();
  const filtered = getActivityTeam.value.filter((act) => {
    if (!range) return true;
    const actDate = new Date(act.created_at);
    return actDate >= range.from && actDate <= range.to;
  });

  const groups = {};
  for (const act of filtered) {
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
    update: "act-tag-update",
    assign: "act-tag-assign",
    unassign: "act-tag-unassign",
    submit: "act-tag-submit",
    delete: "act-tag-delete",
    review: "act-tag-review",
    remove: "act-tag-remove",
    leave: "act-tag-leave",
    join_by_invite: "act-tag-join",
    join_by_passcode: "act-tag-join",
  };
  return map[action?.toLowerCase()];
};

const actTagIcon = (action) => {
  const map = {
    create: Plus,
    update: Brush,
    assign: UserCheck,
    unassign: UserMinus,
    submit: Send,
    delete: Trash2,
    review: Eye,
    remove: Ban,
    leave: LogOut,
    join_by_passcode: UserPlus,
    join_by_invite: UserPlus,
  };
  return map[action?.toLowerCase()];
};

const formatActionLabel = (action) => {
  if (!action) return "";
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>

<style scoped>
.preset-default {
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  color: #374151;
  background: transparent;
  transition: background 0.15s;
}

.preset-default:hover {
  background: #f5f5f5;
}

.preset-active {
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  background: #f5f5f5;
  color: #171717;
  transition: background 0.15s;
}

.custom-picker :deep(.n-input) {
  --n-border-hover: 1px solid gray !important;
  --n-border-focus: 1px solid gray !important;
  --n-box-shadow-focus: 0 !important;
  border-radius: 8px !important;
}
.custom-picker :deep(.n-input__input-el) {
  caret-color: #000000 !important;
}
.custom-picker :deep(.n-button--default-type) {
  color: #171717 !important;
  background: #f5f5f5 !important;
  border-radius: 8px !important;
  --n-border-hover: 1px solid gray !important;
  --n-border-focus: 1px solid gray !important;
  --n-border-pressed: 1px solid gray !important;
  --n-text-color-hover: #333 !important;
  --n-color-hover: #f5f5f5 !important;
}
.custom-picker :deep(.n-button--primary-type) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
.custom-picker :deep(.n-button--primary-type:hover) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
}
.custom-picker :deep(.n-date-panel) {
  --n-item-color-active: #171717 !important;
  --n-item-color-covered: rgba(23, 23, 23, 0.08) !important;
  --n-item-text-color-active: #fff !important;
  --n-item-color-hover: rgba(23, 23, 23, 0.06) !important;
  --n-item-color-included: rgba(23, 23, 23, 0.08) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}
.custom-picker :deep(.n-date-panel-month-calendar__picker-col) {
  height: 185px !important;
  overflow: hidden !important;
}
.custom-picker :deep(.n-date-panel-month-calendar__padding) {
  height: 0 !important;
  min-height: 0 !important;
}

.custom-picker :deep(.n-button--primary-type) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
  border-radius: 8px !important;

  --n-color: #171717 !important;
  --n-color-hover: #171717 !important;
  --n-color-focus: #171717 !important;
  --n-color-pressed: #171717 !important;

  --n-border: 1px solid #171717 !important;
  --n-border-hover: 1px solid #171717 !important;
  --n-border-focus: 1px solid #171717 !important;
  --n-border-pressed: 1px solid #171717 !important;

  --n-box-shadow-focus: none !important;
  --n-wave-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.custom-picker :deep(.n-button--primary-type:hover),
.custom-picker :deep(.n-button--primary-type:focus),
.custom-picker :deep(.n-button--primary-type:active),
.custom-picker :deep(.n-button--primary-type.n-button--focus) {
  background: #171717 !important;
  border-color: #171717 !important;
  box-shadow: none !important;
  outline: none !important;
}

.custom-picker :deep(.n-button--primary-type *) {
  box-shadow: none !important;
  outline: none !important;
}

:deep(.n-tag__close) {
  margin-left: 8px !important;
  border-radius: 50%;
}

:deep(.n-tag__close:hover) {
  border-radius: 50% !important;
}
</style>
