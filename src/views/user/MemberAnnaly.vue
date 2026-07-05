<template>
  <div v-if="!pageReady || loadingTasks">
    <TeamAnalyticsSkeleton />
  </div>
  <div v-else class="analyze-page pb-3">
    <!-- Header -->
    <div class="row pt-3 g-4 align-items-center">
      <div class="col-lg-8 col-md-6">
        <h5 class="page-heading mb-0">Team Analytics</h5>
      </div>
      <div class="col-lg-4 col-md-6 d-flex justify-content-end">
        <n-popover
          trigger="click"
          placement="bottom-end"
          :show-arrow="false"
          v-model:show="showDateFilterPop"
          style="border-radius: 12px; padding: 6px; width: 150px; margin-right: 0px"
        >
          <template #trigger>
            <button
              class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1 ms-auto"
            >
              <Filter size="16" /> {{ dateFilterLabel }}
            </button>
          </template>
          <div class="d-flex flex-column gap-1">
            <div
              v-for="opt in dateFilterOptions"
              :key="opt.value"
              class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
              :class="dateFilter === opt.value ? 'fw-semibold bg-accent' : ''"
              @click="handleDateFilterChange(opt.value)"
            >
              <Calendar size="15" /> {{ opt.label }}
            </div>
          </div>
        </n-popover>
      </div>
    </div>

    <n-alert
      v-if="errorMessage"
      type="error"
      class="mt-3"
      closable
      @close="errorMessage = ''"
    >
      {{ errorMessage }}
    </n-alert>

    <div class="row pt-3 g-4">
      <div class="col-lg-4" v-for="stat in summaryCards" :key="stat.label">
        <div class="stat-card">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="col-lg-12">
        <div class="chart-card">
          <div class="chart-title">Tasks by Status</div>

          <div class="chart-wrap">
            <canvas ref="statusChart"></canvas>
          </div>

          <div v-if="!filteredTasks.length && !loadingTasks" class="empty-state">
            No tasks found for this period.
          </div>
        </div>
      </div>
    </div>

    <div class="row pt-3 g-4">
      <div class="col-lg-12">
        <div class="users-card">
          <n-data-table
            class="my-custom-table"
            :columns="columnsUserActive"
            :data="dataUsersActive"
            :pagination="dataUsersActive.length >= 9 ? { pageSize: 9 } : false"
            :loading="loadingTasks"
            :row-class-name="rowClassName"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TeamAnalyticsSkeleton from "@/components/Skeleton/TeamAnalyticsSkeleton.vue";
import { ref, computed, h, onMounted, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { useRoute } from "vue-router";
import { useTaskStore } from "@/stores/user/task";
import {
  NAlert,
  NDataTable,
  NProgress,
} from "naive-ui";
import { Trophy, Medal, Award } from "lucide-vue-next";
import { useMemberStore } from "@/stores/user/member";
import { NPopover } from "naive-ui";
import { Filter, Calendar } from "lucide-vue-next";
import { storeToRefs } from "pinia";
Chart.register(...registerables);

const route = useRoute();
const workspaceId = computed(() => route.params.workspace_id);
const teamId = computed(() => route.params.team_id);

const taskStore = useTaskStore();
const { getTaskByTeamStore } = taskStore;

const loadingTasks = ref(false);
const errorMessage = ref("");

const allTasks = ref([]);
const statusChart = ref(null);
let chartInstance = null;

const memberStore = useMemberStore();
const { getAllMemberInTeamStore } = memberStore;
const { getAllMemberInTeam } = storeToRefs(memberStore);

/* ================= DATE FILTER ================= */
const showDateFilterPop = ref(false);
const dateFilter = ref("this_week");
const dateFilterOptions = [
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "All Time", value: "all" },
];

const dateFilterLabel = computed(() => {
  const opt = dateFilterOptions.find((o) => o.value === dateFilter.value);
  return opt?.label ?? "Filter";
});

function handleDateFilterChange(value) {
  dateFilter.value = value;
  showDateFilterPop.value = false;
}

function getDateRange(filter) {
  const now = new Date();
  if (filter === "this_week") {
    const day = now.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;

    const start = new Date(now);
    start.setDate(now.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (filter === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  if (filter === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end: now };
  }

  return null;
}

function getTaskDate(t) {
  const raw = t.created_at || t.createdAt || t.date;
  if (!raw) return null;

  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  return new Date(raw);
}

const filteredTasks = computed(() => {
  const range = getDateRange(dateFilter.value);
  if (!range) return allTasks.value;

  return allTasks.value.filter((t) => {
    const d = getTaskDate(t);
    if (!d || isNaN(d)) return false;
    return d >= range.start && d <= range.end;
  });
});

async function fetchTasks() {
  if (!workspaceId.value || !teamId.value) {
    errorMessage.value = "Missing workspace_id or team_id";
    return;
  }

  loadingTasks.value = true;
  errorMessage.value = "";

  try {
    await getTaskByTeamStore(workspaceId.value, teamId.value);
    allTasks.value = taskStore.getTaskByTeam || [];
  } catch (err) {
    errorMessage.value = err.message || "Failed to load tasks";
  } finally {
    loadingTasks.value = false;
  }
}

async function fetchMembers() {
  if (!workspaceId.value || !teamId.value) return;
  await getAllMemberInTeamStore(workspaceId.value, teamId.value);
}

const statusColors = {
  todo: "#0F8BFF",
  in_progress: "#FF9A3C",
  in_review: "#F59E0B",
  approved: "#40C96F",
  done: "#22C55E",
  rejected: "#FF5260",
};

function colorForStatus(status) {
  return statusColors[status] || "#8B5CF6";
}

const chartData = computed(() => {
  const map = new Map();

  for (const t of filteredTasks.value) {
    map.set(t.status, (map.get(t.status) || 0) + 1);
  }

  const labels = [...map.keys()];
  const data = [...map.values()];
  const colors = labels.map(colorForStatus);

  return {
    labels,
    datasets: [
      {
        label: "Tasks",
        data,
        backgroundColor: colors.map((c) => c + "CC"),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };
});

function renderChart() {
  if (!statusChart.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(statusChart.value, {
    type: "polarArea",
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            padding: 16,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.formattedValue} task(s)`,
          },
        },
      },
      scales: {
        r: {
          ticks: { display: false },
          grid: { color: "#e5e7eb" },
        },
      },
    },
  });
}

watch(chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData;
    chartInstance.update();
  }
});

const pageReady = ref(false);

onMounted(async () => {
  pageReady.value = false;
  await fetchTasks();
  await fetchMembers();
  pageReady.value = true;
  await nextTick();
  renderChart();
});

const approvedTasks = computed(() =>
  filteredTasks.value.filter((t) => t.status === "approved")
);

const dataUsersActive = computed(() => {
  return (getAllMemberInTeam.value || [])
    .map((m) => ({
      user_id: m.user_id,
      name: m.name,
      email: m.email,
      avatar: m.avatar,
      role: m.role, // add this
      approved_count: approvedTasks.value.filter(
        (t) => t.assigned_to?.user_id === m.user_id
      ).length,
    }))
    .sort((a, b) => b.approved_count - a.approved_count)
    .map((u, i) => ({ ...u, rank: i + 1 }));
});

const roleConfig = {
  member: { bg: "bg-blue", text: "text-blue" },
  moderator: { bg: "bg-purple", text: "text-purple" },
  owner: { bg: "bg-green", text: "text-green" },
};

const maxApprovedCount = computed(() =>
  Math.max(...dataUsersActive.value.map((u) => u.approved_count), 1)
);

function rowClassName(row) {
  return row.rank <= 3 ? `rank-row rank-${row.rank}` : "";
}

const rankStyles = {
  1: { icon: Award, color: "#FFD700" },
  2: { icon: Award, color: "#C0C0C0" },
  3: { icon: Award, color: "#CD7F32" },
};

const columnsUserActive = [
  {
    title: "#",
    key: "rank",
    width: 56,
    align: "center",
    render(row) {
      const style = rankStyles[row.rank];

      if (style) {
        return h(
          "div",
          {
            class: "d-flex align-items-center justify-content-center",
            style: "height: 32px;",
          },
          [
            h(style.icon, {
              style: `width:22px; height:22px; color:${style.color}; stroke:${style.color};`,
            }),
          ]
        );
      }

      return h(
        "div",
        {
          class: "d-flex align-items-center justify-content-center fw-semibold",
          style: "height: 32px; font-size:13px; color:#9ca3af;",
        },
        row.rank
      );
    },
  },
  {
    title: "User",
    key: "name",
    render(row) {
      return h("div", { class: "d-flex align-items-center gap-2" }, [
        h("img", {
          src: row.avatar || "/default-avatar.png",
          class: "rounded-circle",
          style: "width: 32px; height: 32px; object-fit: cover;",
          onError: (e) => {
            e.target.src = "/default-avatar.png";
          },
        }),
        h("span", { class: "fs-14 fw-medium", style: "color:#111827;" }, row.name),
      ]);
    },
  },
  {
    title: "Email",
    key: "email",
    render(row) {
      return h("div", { class: "fs-14", style: "color:#6b7280;" }, row.email || "");
    },
  },
  {
    title: "Role",
    key: "role",
    render(row) {
      const badgeClass = `tab-info w-fit fw-medium d-inline-block ${
        roleConfig[row.role]?.bg
      } ${roleConfig[row.role]?.text}`;
      return h(
        "span",
        { class: badgeClass },
        row.role ? row.role.charAt(0).toUpperCase() + row.role.slice(1) : ""
      );
    },
  },
  {
    title: "Tasks Approved",
    key: "approved_count",
    render(row) {
      const pct = Math.round((row.approved_count / maxApprovedCount.value) * 100);
      return h("div", { class: "d-flex align-items-center gap-3" }, [
        h(
          "span",
          {
            class: "fw-bold",
            style:
              "min-width:24px; text-align:center; font-size:13px; color:#0088FF; background:#B2DBFF; border-radius:999px; padding:2px 8px;",
          },
          row.approved_count
        ),
        h("div", { style: "flex:1; max-width:140px;" }, [
          h(NProgress, {
            type: "line",
            percentage: pct,
            showIndicator: false,
            height: 6,
            borderRadius: 999,
            fillBorderRadius: 999,
            processing: true,
            color: "#0088FF",
            railColor: "#e5e7eb",
          }),
        ]),
      ]);
    },
  },
];

const summaryCards = computed(() => [
  { label: "Total Tasks", value: filteredTasks.value.length },
  { label: "Approved Tasks", value: approvedTasks.value.length },
  { label: "Total Users", value: dataUsersActive.value.length },
]);
</script>

<style scoped>
.analyze-page {
  padding: 10px 0;
}

.page-heading {
  font-size: 18px;
  font-weight: 700;
}

.stat-card {
  border-radius: 10px;
  padding: 18px;
  background: #fff;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.chart-card {
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}

.chart-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.chart-wrap {
  position: relative;
  height: 320px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.users-card {
  background: #fff;
  border-radius: 12px;
  padding: 8px;
}

.my-custom-table :deep(.n-data-table-wrapper) {
  border-radius: 16px !important;
  overflow: hidden !important;
  border: 1px solid #e4e4e7 !important;
}

.my-custom-table :deep(.n-data-table-th) {
  background-color: #b2dbff !important;
  color: #0088ff !important;
  border-bottom: 1px solid #e4e4e7;
  padding: 16px 18px !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-size: 13px;
}

.my-custom-table :deep(.n-data-table-td) {
  padding: 14px 18px !important;
}

.my-custom-table :deep(.rank-row) {
  background: #fafafa;
}

.workspace-item:hover {
  background: #f4f4f5;
}
</style>
