<template>
    <div v-if="loading">
        <Loading></Loading>
    </div>
    <div v-else style="height: 89vh;">
        <div class="d-flex align-items-center justify-content-between mb-3">
            <BaseTitle title="Dashboard" />
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
                        <router-link to="/admin/user-monitoring" class="view-link text-decoration-none">View All
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
        </div>
    </div>
</template>

<script setup>
import { computed, h, onMounted, reactive, ref } from "vue";
import { NAvatar, NTag } from "naive-ui";
import {
    BriefcaseBusiness,
    CalendarDays,
    Clock,
    DollarSign,
    TrendingUp,
    TrendingDown,
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

let tasks = ref(0);
let teams = ref(0);
let users = ref(0);
let workspaces = ref(0);

const fetchDashboard = async () => {
    loading.value = true;
    try {
        const res = await api.get('/api/sahakka-admin/dashboard');
        let data = res.data.data;

        users.value = data.total_users;
        workspaces.value = data.total_workspaces;
        teams.value = data.total_teams;
        tasks.value = data.total_tasks;

    } catch (error) {
        toast.error("Failed to load");
    } finally{
        loading.value = false;
    }
}

const stats = computed(() => [
    {
        label: "Total Users",
        value: users.value,
        note: "4 users active now",
        trendType: "up",
        icon: User,
    },
    {
        label: "Total Workspaces",
        value: workspaces.value,
        note: "12 assigned today",
        trendType: "up",
        icon: Layers,
    },
    {
        label: "Total Teams",
        value: teams.value,
        note: "5 assigned today",
        trendType: "up",
        icon: Users,
    },
    {
        label: "Total Tasks",
        value: tasks.value,
        note: "2 assigned today",
        trendType: "up",
        icon: ChartPie,
    },
]);

const usersStore = useUserStore();
const getUserStats = async () => {
    await usersStore.fetchUsers();

    const users = usersStore.users || [];
    const totalUsers = users.length;

    let activeUsers = users.filter(u => u.is_active === 1).length;
    let verifiedUsers = users.filter(u => u.is_verified === 1).length;
    let newUsers = users.filter(u => u.is_verified === 0).length;

    let activeProgress =
        totalUsers === 0 ? 0 : (activeUsers / totalUsers) * 100;

    let verifiedProgress =
        totalUsers === 0 ? 0 : (verifiedUsers / totalUsers) * 100;

    let newUsersProgress =
        totalUsers === 0 ? 0 : (newUsers / totalUsers) * 100;

    return {
        totalUsers,
        activeUsers,
        verifiedUsers,
        newUsers,
        activeProgress: Number(activeProgress.toFixed(2)),
        verifiedProgress: Number(verifiedProgress.toFixed(2)),
        newUsersProgress: Number(newUsersProgress.toFixed(2))
    };

};

const projectSummary = ref([]);
const loadProjectSummary = async () => {
    const stats = await getUserStats();

    projectSummary.value = [
        {
            label: "Active Users",
            value: stats.activeUsers,
        },
        {
            label: "Verified Users",
            value: stats.verifiedUsers,
        },
        {
            label: "New Users",
            value: stats.newUsers,
        },
    ];
};

const overviewProjects = ref([]);
const generateOverview = async () => {
    const stats = await getUserStats();
    overviewProjects.value = [
        {
            name: "Active Users Growth",
            progress: stats.activeProgress,
        },
        {
            name: "User Verified",
            progress: stats.verifiedProgress,
        },
        {
            name: "New Users",
            progress: stats.newUsersProgress,
        },
    ];
};


const recentUsersList = computed(() => {
    return [...usersStore.users]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map(u => ({
            username: u.name,
            email: u.email,
            date: formatDate(u.created_at),
            status: "New",
            type: "info",
        }));
});

const reportColumns = [
    {
        title: "USERBANE",
        key: "username",
    },
    {
        title: "EMAIL",
        key: "email",
        render(row) {
            return h("span", { class: "fw-bold" }, row.email);
        },
    },
    {
        title: "DATE",
        key: "date",
    },
    {
        title: "STATUS",
        key: "status",
        render(row) {
            return h(
                NTag,
                {
                    round: true,
                    bordered: false,
                    type: row.type,
                },
                { default: () => row.status },
            );
        },
    },
];

onMounted(async () => {
    await fetchDashboard();
    await getUserStats();
    await loadProjectSummary();
    await generateOverview();
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

.project-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.project-row {
    border-bottom: 1px solid #eef0f3;
    padding-bottom: 18px;
}

.project-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.progress-value {
    min-width: 44px;
    text-align: right;
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

.budget-ring {
    display: flex;
    justify-content: center;
}

.budget-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.activity-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.activity-item {
    align-items: center;
    background: #f8fafc;
    border: 1px solid #edf0f3;
    border-radius: 14px;
    display: flex;
    gap: 12px;
    min-height: 78px;
    padding: 14px;
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

    .activity-grid,
    .budget-grid {
        grid-template-columns: 1fr;
    }

    .project-overview {
        grid-template-columns: 1fr;
    }

    .overview-stats {
        grid-template-columns: 1fr;
    }
}
</style>
