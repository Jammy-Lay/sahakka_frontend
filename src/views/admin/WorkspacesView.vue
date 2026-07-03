<template>
    <div v-if="loading">
        <SkeletonWorkspace></SkeletonWorkspace>
    </div>
    <div v-else class="container-fluid px-4">
        <div class="row g-4 align-items-start">
            <!-- ── Left: Workspaces ── -->
            <div class="col-lg-12 col-xl-8">
                <div class="row bg-body position-sticky pt-5" style="top: 10px; z-index: 10">
                    <div class="col-4">
                        <div class="d-flex align-items-center gap-2">
                            <Layers class="text-prime" :size="30" />
                            <BaseTitle title="Workspace" class="mb-0" />
                        </div>
                    </div>

                    <div class="col-8">
                        <div class="d-flex justify-content-end mb-3">
                            <div class="form-control rounded-btn d-flex align-items-center py-1" style="width: 300px;">
                                <input v-model="searchQuery" type="text"
                                    class="search-input shadow-none outline-none border-0 w-100"
                                    placeholder="Search Workspace" />
                                <Search color="var(--bs-gray)" size="18" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cards -->
                <n-scrollbar style="max-height: 70vh">
                    <div class="row g-3">
                        <template v-if="paginatedProjects.length > 0">
                            <div class="col-12 col-md-6" v-for="project in paginatedProjects" :key="project.id">
                                <BaseCard :project="project" :stats="project.stats" :members="project.membersList"
                                    @click="goDetail(project.id)" />
                            </div>
                        </template>

                        <!-- Empty state -->
                        <div v-else class="d-flex justify-content-center align-items-center" style="height: 300px;">
                            <n-empty description="No Data" />
                        </div>
                    </div>
                </n-scrollbar>

                <!-- Pagination -->
                <div class="mt-3 d-flex justify-content-end">
                    <n-pagination v-if="totalPages > 1" v-model:page="currentPage" :page-count="totalPages"
                        @update:page="changePage">
                        <template #prev>
                            <ChevronLeft />
                        </template>
                        <template #next>
                            <ChevronRight />
                        </template>
                    </n-pagination>
                </div>
            </div>

            <!-- ── Right: Activities ── -->
            <div class="col-lg-12 col-xl-4 sticky-top" style="top: 40px">
                <div class="d-flex align-items-center gap-2">
                    <Target class="text-prime" :size="30" />
                    <BaseTitle title="Overview" class="mb-0" />
                </div>

                <!-- Stat cards -->
                <div class="row g-3 mt-1">
                    <div v-for="item in stats" :key="item.label" class="col-6">
                        <div class="card border rounded-4 p-3 h-100 border-0 shadow-sm">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="overflow-hidden">
                                    <p class="text-secondary mb-2 text-truncate" style="font-size: 13px">
                                        {{ item.label }}
                                    </p>
                                    <h4 class="fw-bold mb-1">{{ item.value }}</h4>
                                    <div class="d-flex align-items-center gap-1" style="font-size: 13px"
                                        :class="item.trendType === 'up' ? 'text-success' : 'text-danger'">
                                        <span>{{ item.note }}</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-center rounded-3 bg-light flex-shrink-0"
                                    style="width: 40px; height: 40px">
                                    <component :is="item.icon" :size="20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent workspaces table -->
                <div class="card border rounded-4 p-4 mt-3 border-0 shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="overflow-hidden">
                            <h5 class="fw-bold mb-1 text-truncate">Recent Daily Created Workspaces</h5>
                            <p class="mb-0 text-secondary" style="font-size: 13px">Latest created</p>
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
import BaseCard from "@/components/BaseCard.vue";
import BasePagination from "@/components/BasePagination.vue";
import { onMounted, ref, computed, h, watch } from "vue";
import { useWorkspaceStore } from "@/stores/admin/workspaces";
import { useTeamstore } from "@/stores/admin/teams";
import { useTaskstore } from "@/stores/admin/tasks";
import router from "@/router";
import { ChartPie, Users, Layers, Search, ChevronLeft, ChevronRight, Target } from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";
import Loading from "@/components/layouts/Loading.vue";
import { useToast } from "vue-toastification";
import SkeletonWorkspace from "@/components/Skeleton/SkeletonWorkspace.vue";
import api from "@/api/https";
import { notify } from "@/utils/toast";

const useWorkspace = useWorkspaceStore();
const useTeam = useTeamstore();
const useTask = useTaskstore();
const loading = ref(false);
const toast = notify(router);
const projects = ref([]);

// search
const searchQuery = ref("");

// pagination
const currentPage = ref(1);
const itemPerPage = ref(6);

const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const truncateText = (text, length = 20) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
};

const getWorkspaces = async () => {
    loading.value = true;
    try {
        await useWorkspace.fetchWorkspaces();
        await useTeam.fetchTeams();
        await useTask.fetchTasks();

        const teamsData = useTeam.teams;
        const tasksData = useTask.tasks;

        projects.value = useWorkspace.workspaces.map((workspace) => {
            // teams
            const workspaceTeams = teamsData.filter(
                (team) => team.workspace?.workspace_id === workspace.workspace_id
            );
            const teamIds = workspaceTeams.map((t) => t.team_id);

            // tasks
            const workspaceTasks = tasksData.filter(
                (task) => teamIds.includes(task.team?.id)
            );

            const totalTasks = workspaceTasks.length;
            const approvedTasks = workspaceTasks.filter(
                (task) => task.status === "approved"
            ).length;

            const progress = totalTasks === 0
                ? 0
                : Math.round((approvedTasks / totalTasks) * 100);

            // deduplicate members by user_id across all teams
            const allMembers = workspaceTeams.flatMap((team) => team.members || []);
            const uniqueMembers = [
                ...new Map(allMembers.map((m) => [m.user_id, m])).values()
            ];

            return {
                id: workspace.workspace_id,
                name: workspace.workspace_name,
                createdAt: workspace.created_at, // required for recentUsersList sort
                owner: workspace.creator?.user_name || "Unknown",
                membersList: uniqueMembers,
                members: uniqueMembers.length,
                teams: workspaceTeams.length,
                tasks: totalTasks,
                progress,
                stats: [
                    {
                        label: "Teams",
                        value: workspaceTeams.length,
                        trendType: "up",
                        icon: Users,
                        color: "#3b82f6",
                    },
                    {
                        label: "Members",
                        value: uniqueMembers.length, // deduplicated count
                        trendType: "up",
                        icon: Users,
                        color: "#a855f7",
                    },
                    {
                        label: "Tasks",
                        value: totalTasks,
                        icon: ChartPie,
                        color: "#10b981",
                    },
                ],
            };
        });

    } catch (error) {
        toast.error("Failed to load");
    } finally {
        loading.value = false;
    }
};

// reset page when search changes
watch(searchQuery, () => {
    currentPage.value = 1;
});

// SEARCH FILTER
const searchedProjects = computed(() => {
    return projects.value.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// PAGINATION DATA
const totalPages = computed(() => {
    return Math.ceil(searchedProjects.value.length / itemPerPage.value);
});

const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemPerPage.value;
    return searchedProjects.value.slice(start, start + itemPerPage.value);
});

const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value;
});

const hasPreviousPage = computed(() => {
    return currentPage.value > 1;
});

const changePage = (page) => {
    currentPage.value = page;
};

const goDetail = (id) => {
    router.push(`/admin/workspaces/${id}`);
};


const dashboard = ref({
    workspaces: { total: 0, today: 0, text: "" },
    teams: { total: 0, today: 0, text: "" },
    tasks: { total: 0, today: 0, text: "" },
});

// fetch dashboard
const fetchDashboard = async () => {
    try {
        const res = await api.get('/sahakka-admin/dashboard');
        dashboard.value = res.data.data;
    } catch (error) {
        toast.error("Failed to load overview");
    }
};
// TOP-LEVEL STATS
const stats = computed(() => [
    {
        label: "Total Workspaces",
        value: dashboard.value.workspaces.total,
        note: dashboard.value.workspaces.text,
        trendType: "up",
        icon: Layers,
    },
    {
        label: "Total Teams",
        value: dashboard.value.teams.total,
        note: dashboard.value.teams.text,
        trendType: "up",
        icon: Users,
    },
    {
        label: "Total Tasks",
        value: dashboard.value.tasks.total,
        note: dashboard.value.tasks.text,
        trendType: "up",
        icon: ChartPie,
    },
]);
const recentUsersList = computed(() => {
    return [...projects.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // b - a = newest first
        .slice(0, 3)
        .map((p) => ({
            workspace: p.name,
            owner: p.owner,
            date: formatDate(p.createdAt),
        }));
});

const reportColumns = [
    {
        title: "Workspaces",
        key: "workspace",
        render(row) {
            return h(
                "span",
                { class: "text-truncate d-inline-block", style: "max-width:160px;" },
                truncateText(row.workspace, 18)
            );
        },
    },
    {
        title: "Owner",
        key: "owner",
        render(row) {
            return h(
                "span",
                {
                    class: "fw-bold text-truncate d-inline-block",
                    style: "max-width:140px;",
                },
                truncateText(row.owner, 16)
            );
        },
    },
    {
        title: "DATE",
        key: "date",
        render(row) {
            return h(
                "span",
                { style: "white-space: nowrap;" },
                row.date
            );
        },
    },
];

onMounted(async () => {
    await Promise.all([getWorkspaces(), fetchDashboard()]);
});
</script>
<style scoped>
.dashboard-card {
    min-height: 135px;
    padding: 22px;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.search-input:focus {
    outline: none;
}

.form-control:has(.search-input:focus) {
    outline: 1px solid #171717;
}

.clear-btn {
    cursor: pointer;
    color: #9ca3af;
    font-size: 14px;
}

.clear-btn:hover {
    color: #ef4444;
}

.text-truncate-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
