<template>
    <div v-if="loading || usersStore.loading">
        <Dashboard></Dashboard>
    </div>
    <div v-else>
        <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
                <LayoutDashboard  class="text-prime" :size="30" />
                <BaseTitle title="Dashboard" class="mb-0" />
            </div>
            <n-tag round :bordered="false" type="warning">
                {{ todayLabel }}
            </n-tag>
        </div>

        <div class="row g-4">
            <div v-for="item in stats" :key="item.label" class="col-12 col-sm-6 col-xl-3">
                <div class="card dashboard-card shadow-box rounded-4 border-0 shadow-sm">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <p class="text-secondary fs-7 mb-2">{{ item.label }}</p>
                            <h3 class="fw-bold mb-1">{{ item.value }}</h3>
                            <n-ellipsis style="max-width: 240px">
                                <div class="d-flex align-items-center gap-1 fs-7"
                                    :class="item.trendType === 'up' ? 'text-success' : 'text-prime'">
                                    <component :is="item.trendType === 'up' ? TrendingUp : Clock" :size="14" />
                                    <span>{{ item.note }}</span>
                                </div>
                            </n-ellipsis>
                        </div>
                        <div class="stat-icon bg-accent">
                            <component :is="item.icon" :size="22" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4 mt-1">
            <div class="col-12 col-xl-6">
                <div class="card p-4 rounded-4 shadow-box border-0 shadow-sm h-100">
                    <div class="d-flex align-items-center justify-content-between mb-4">
                        <h5 class="fw-bold mb-0">Project Overview</h5>
                        <router-link to="/admin/users" class="view-link text-decoration-none">View All
                            Users</router-link>
                    </div>

                    <div class="project-overview">
                        <div class="donut-wrap">
                            <div class="project-donut">
                                <div class="donut-center">
                                    <h4 class="fw-bold mb-0">{{ usersStore.users.length }}</h4>
                                    <p class="m-0">TOTAL</p>
                                </div>
                            </div>
                        </div>

                        <div class="overview-content">
                            <div class="overview-stats">
                                <div v-for="item in projectSummary" :key="item.label" class="overview-stat">
                                    <h6 class="fw-bold mb-1">{{ item.value }}</h6>
                                    <p class="m-0">{{ item.label }}</p>
                                </div>
                            </div>

                            <div class="overview-bars">
                                <div v-for="project in overviewProjects" :key="project.name" class="overview-bar-item">
                                    <div class="d-flex justify-content-between mb-1">
                                        <span class="fw-bold">{{ project.name }}</span>
                                        <span class="fw-bold">{{ project.progress }}%</span>
                                    </div>
                                    <n-progress type="line" :percentage="project.progress" :show-indicator="false"
                                        :height="8" color="#34C759" rail-color="#edf2f7" processing />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-xl-6">
                <div class="card p-4 rounded-4 shadow-box border-0 shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 class="fw-bold mb-1">Recent Daily New Users</h5>
                            <p class="m-0 text-secondary fs-7">
                                Latest user register
                            </p>
                        </div>
                    </div>
                    <n-data-table :columns="reportColumns" :data="recentUsersList" :pagination="false" :bordered="false"
                        class="dashboard-table" />
                </div>
            </div>

            <!-- Engagement Card (single, fixed) -->
            <div class="col-12">
                <div class="engagement-card">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="card-title">
                            <i class="bi bi-people me-2"></i> Customer Engagement Trends
                        </span>

                        <!-- Dropdown Date Range Selector -->
                        <n-dropdown trigger="click" :options="rangeOptions" @select="handleRangeSelect">
                            <n-button size="small" class="rounded-3">
                                {{ selectedRangeLabel }}
                                <template #icon><n-icon>
                                        <ChevronDown />
                                    </n-icon></template>
                            </n-button>
                        </n-dropdown>
                    </div>

                    <div class="d-flex gap-4 mb-4">
                        <!-- Real Active Users from store -->
                        <div>
                            <div class="metric-label">Active Users</div>
                            <div class="metric-value">
                                {{ activeUsersCount.toLocaleString() }}
                                <span class="metric-badge">▲ live</span>
                            </div>
                        </div>
                        <!-- New Users replacing Purchase Conversion Rate -->
                        <div>
                            <div class="metric-label">New Users</div>
                            <div class="metric-value">
                                {{ newUsersCount.toLocaleString() }}
                                <span class="metric-badge">▲ registered</span>
                            </div>
                        </div>
                    </div>

                    <!-- Single canvas only here -->
                    <div style="position: relative; height: 220px;">
                        <canvas ref="chartRef"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, h, onMounted, ref } from "vue";
import { NAvatar, NTag } from "naive-ui";
import {
    Clock,
    TrendingUp,
    Users,
    Layers,
    User,
    ChartPie,
} from "lucide-vue-next";
import api from "@/api/https";
import BaseTitle from "@/components/BaseTitle.vue";
import { useUserStore } from "@/stores/admin/users";
import Loading from "@/components/layouts/Loading.vue";
import { useToast } from "vue-toastification";
import Chart from "chart.js/auto";
import Dashboard from "@/components/Skeleton/Dashboard.vue";

const chartRef = ref(null);
const selectedRange = ref("week");
let chartInstance = null;
const toast = useToast();
const loading = ref(false);

const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
}).format(new Date());

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const dashboard = ref({
    users: { total: 0, today: 0, text: "" },
    workspaces: { total: 0, today: 0, text: "" },
    teams: { total: 0, today: 0, text: "" },
    tasks: { total: 0, today: 0, text: "" },
});

const fetchDashboard = async () => {
    loading.value = true;
    try {
        const res = await api.get('/sahakka-admin/dashboard');
        dashboard.value = res.data.data;
        console.log("Dashboard API response:", res.data.data);
    } catch (error) {
        toast.error("Failed to load");
    } finally {
        loading.value = false;
    }
};

const stats = computed(() => [
    {
        label: "Total Users",
        value: dashboard.value.users.total,
        note: dashboard.value.users.text,
        today: Number(dashboard.value.users.today),
        trendType: "up",
        icon: User,
    },
    {
        label: "Total Workspaces",
        value: dashboard.value.workspaces.total,
        note: dashboard.value.workspaces.text,
        today: Number(dashboard.value.workspaces.today),
        trendType: "up",
        icon: Layers,
    },
    {
        label: "Total Teams",
        value: dashboard.value.teams.total,
        note: dashboard.value.teams.text,
        today: Number(dashboard.value.teams.today),
        trendType: "up",
        icon: Users,
    },
    {
        label: "Total Tasks",
        value: dashboard.value.tasks.total,
        note: dashboard.value.tasks.text,
        today: Number(dashboard.value.tasks.today),
        trendType: "up",
        icon: ChartPie,
    },
]);

const usersStore = useUserStore();

// ── Real computed metrics from store ────────────────────────────────────────
const activeUsersCount = computed(() =>
    (usersStore.users || []).filter(u => u.is_active === 1).length
);

const newUsersCount = computed(() =>
    (usersStore.users || []).filter(u => u.is_verified === 0).length
);

// ── Project Overview ─────────────────────────────────────────────────────────
// Reads from already-loaded store — does NOT call fetchUsers() again
const getUserStats = () => {
    const allUsers = usersStore.users || [];
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.is_active === 1).length;
    const verifiedUsers = allUsers.filter(u => u.is_verified === 1).length;
    const newUsers = allUsers.filter(u => u.is_verified === 0).length;

    return {
        totalUsers,
        activeUsers,
        verifiedUsers,
        newUsers,
        activeProgress: totalUsers === 0 ? 0 : Number(((activeUsers / totalUsers) * 100).toFixed(2)),
        verifiedProgress: totalUsers === 0 ? 0 : Number(((verifiedUsers / totalUsers) * 100).toFixed(2)),
        newUsersProgress: totalUsers === 0 ? 0 : Number(((newUsers / totalUsers) * 100).toFixed(2)),
    };
};

const projectSummary = ref([]);
const loadProjectSummary = () => {
    const stats = getUserStats();
    projectSummary.value = [
        { label: "Active Users", value: stats.activeUsers },
        { label: "Verified Users", value: stats.verifiedUsers },
        { label: "New Users", value: stats.newUsers },
    ];
};

const overviewProjects = ref([]);
const generateOverview = () => {
    const stats = getUserStats();
    overviewProjects.value = [
        { name: "Active Users Growth", progress: stats.activeProgress },
        { name: "User Verified", progress: stats.verifiedProgress },
        { name: "New Users", progress: stats.newUsersProgress },
    ];
};

// ── Recent Users Table ───────────────────────────────────────────────────────
const recentUsersList = computed(() =>
    [...(usersStore.users || [])]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map(u => ({
            username: u.name,
            email: u.email,
            date: formatDate(u.created_at),
            status: "New",
            type: "info",
        }))
);

const reportColumns = [
    { title: "USERNAME", key: "username" },
    {
        title: "EMAIL",
        key: "email",
        render(row) {
            return h("span", { class: "fw-bold" }, row.email);
        },
    },
    { title: "DATE", key: "date" },
    {
        title: "STATUS",
        key: "status",
        render(row) {
            return h(NTag, { round: true, bordered: false, type: row.type }, { default: () => row.status });
        },
    },
];

// ── Chart helpers ────────────────────────────────────────────────────────────
const getRangeData = () => {
    const allUsers = usersStore.users || [];
    const now = new Date();
    let filtered = [];

    if (selectedRange.value === "today") {
        filtered = allUsers.filter(u => {
            const d = new Date(u.created_at);
            return d.toDateString() === now.toDateString();
        });
    } else if (selectedRange.value === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        filtered = allUsers.filter(u => new Date(u.created_at) >= weekAgo);
    } else {
        // last month
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        filtered = allUsers.filter(u => new Date(u.created_at) >= monthAgo);
    }

    // Group by readable date label
    const grouped = {};
    filtered.forEach(u => {
        const label = new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
        }).format(new Date(u.created_at));
        grouped[label] = (grouped[label] || 0) + 1;
    });

    const sorted = Object.entries(grouped)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Fallback so chart is never empty
    if (sorted.length === 0) {
        return [{ date: "No data", count: 0 }];
    }

    return sorted;
};

const updateChart = () => {
    const rangeData = getRangeData();
    if (chartInstance) {
        chartInstance.data.labels = rangeData.map(d => d.date);
        chartInstance.data.datasets[0].data = rangeData.map(d => d.count);
        chartInstance.update();
    }
};

const rangeOptions = [
    { label: "Last Week", key: "week" },
    { label: "Last Month", key: "month" },
];

const selectedRangeLabel = computed(() => {
    return rangeOptions.find((o) => o.key === selectedRange.value)?.label || "Select";
});

function handleRangeSelect(key) {
    selectedRange.value = key;
    updateChart();
}

// ── Single onMounted ─────────────────────────────────────────────────────────
onMounted(async () => {
    // 1. Fetch API data and user store in parallel (fetchUsers only once)
    await Promise.all([fetchDashboard(), usersStore.fetchUsers()]);

    // 2. Now that store is loaded, derive stats synchronously
    loadProjectSummary();
    generateOverview();

    // 3. Initialize chart with loaded data
    const initial = getRangeData();

    chartInstance = new Chart(chartRef.value, {
        type: "line",
        data: {
            labels: initial.map(d => d.date),
            datasets: [{
                label: "New Users",
                data: initial.map(d => d.count),
                borderColor: "#378ADD",
                backgroundColor: "rgba(55,138,221,0.08)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#378ADD",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: "rgba(0,0,0,0.05)" },
                    ticks: { font: { size: 11 } },
                },
                y: {
                    min: 0,
                    grid: { color: "rgba(0,0,0,0.05)" },
                    ticks: {
                        callback: v => v >= 1000 ? (v / 1000) + "K" : v,
                        font: { size: 11 },
                    },
                },
            },
        },
    });
});
</script>

<style scoped>
.dashboard-card {
    min-height: 135px;
    padding: 22px;
}

.stat-icon {
    align-items: center;
    background: #9e9e9e23;
    border-radius: 14px;
    color: #171717;
    display: flex;
    height: 48px;
    justify-content: center;
    width: 48px;
}

.view-link {
    background: transparent;
    border: 0;
    color: #34C759;
    font-size: 12px;
    font-weight: 700;
    padding: 0;
}

.project-overview {
    align-items: center;
    display: grid;
    gap: 28px;
    grid-template-columns: 170px 1fr;
}

.donut-wrap {
    display: flex;
    justify-content: center;
}

.project-donut {
    align-items: center;
    background: conic-gradient(#34C759 0deg 216deg,
            #1492b8 216deg 306deg,
            #e9eef5 306deg 360deg);
    border-radius: 50%;
    display: flex;
    height: 140px;
    justify-content: center;
    width: 140px;
}

.donut-center {
    align-items: center;
    background: #fff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    height: 90px;
    justify-content: center;
    width: 90px;
}

.donut-center p,
.overview-stat p {
    color: #667085;
    font-size: 10px;
    font-weight: 700;
}

.overview-content {
    display: flex;
    flex-direction: column;
    gap: 22px;
    min-width: 0;
}

.overview-stats {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.overview-stat {
    background: #f8fafc;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
}

.overview-bars {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.overview-bar-item span {
    color: #1f2937;
    font-size: 12px;
}

.engagement-card {
    background: #fff;
    border: 0.5px solid #e3e3e3;
    border-radius: 16px;
    padding: 20px 24px;
}

.metric-label {
    font-size: 12px;
    color: #888;
}

.metric-value {
    font-size: 22px;
    font-weight: 600;
    color: #111;
}

.metric-badge {
    font-size: 13px;
    color: #1D9E75;
    font-weight: 500;
}

:deep(.dashboard-table .n-data-table-wrapper) {
    border-radius: 12px;
    overflow: hidden;
}

:deep(.dashboard-table .n-data-table-th) {
    background-color: #fff !important;
    color: #8e99a7 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
}

@media (max-width: 575px) {
    .project-overview {
        grid-template-columns: 1fr;
    }

    .overview-stats {
        grid-template-columns: 1fr;
    }
}
</style>