<template>
    <div v-if="loading">
        <Loading></Loading>
    </div>
    <div v-else class="container-fluid px-4">
        <div class="row g-4 align-items-start">
            <!-- ── Left: Workspaces ── -->
            <div class="col-lg-12 col-xl-8">
                <div class="row bg-body position-sticky pt-5" style="top: 10px; z-index: 10">
                    <div class="col-4">
                        <BaseTitle title="Workspaces" />
                    </div>

                    <div class="col-8">
                        <div class="d-flex justify-content-end mb-3">
                            <div class="search-wrapper border-0 shadow-sm">
                                <Search size="18" class="search-icon" />

                                <input v-model="searchQuery" type="text" class="search-input"
                                    placeholder="Search workspace..." @input="currentPage = 1" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cards -->
                <n-scrollbar style="max-height: 70vh">
                    <div class="row g-3">
                        <div class="col-12 col-md-6" v-for="project in paginatedProjects" :key="project.id">
                            <BaseCard :project="project" :stats="project.stats" :members="project.membersList"
                                @click="goDetail(project.id)" />
                        </div>
                    </div>
                </n-scrollbar>

                <!-- Pagination -->
                <div class="mt-2 d-flex justify-content-end">
                    <n-pagination v-model:page="currentPage" :page-count="totalPages" @update:page="changePage">
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
                <BaseTitle title="Overview" />

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
import { onMounted, ref, computed, h } from "vue";
import { useWorkspaceStore } from "@/stores/admin/workspaces";
import { useTeamstore } from "@/stores/admin/teams";
import { useTaskstore } from "@/stores/admin/tasks";
import router from "@/router";
import { ChartPie, Users, Layers } from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";
import Loading from "@/components/layouts/Loading.vue";
import { useToast } from "vue-toastification";

const useWorkspace = useWorkspaceStore();
const useTeam = useTeamstore();
const useTask = useTaskstore();
const loading = ref(false);
const toast = useToast();

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
            const workspaceTasks = tasksData.filter((task) => teamIds.includes(task.team_id));
            const totalTasks = workspaceTasks.length;
            const doneTasks = workspaceTasks.filter((task) => task.status === "done").length;
            const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

            return {
                id: workspace.workspace_id,
                name: workspace.workspace_name,
                owner: workspace.creator?.user_name || "Unknown",
                membersList: workspaceTeams.flatMap((team) => team.members || []),
                members: workspaceTeams.reduce((sum, t) => sum + (t.members?.length || 0), 0),
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
                        value: workspaceTeams.reduce((sum, t) => sum + (t.members?.length || 0), 0),
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

const stats = computed(() => [
    {
        label: "Total Workspaces",
        value: projects.value.length,
        note: "All workspaces loaded",
        trendType: "up",
        icon: Layers,
    },
    {
        label: "Total Teams",
        value: projects.value.reduce((sum, p) => sum + p.teams, 0),
        note: "Created teams",
        trendType: "up",
        icon: Users,
    },
]);
const recentUsersList = computed(() => {
    return [...useWorkspace.workspaces]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map((w) => ({
            workspace: w.workspace_name,
            owner: w.creator?.user_name || "Unknown",
            date: formatDate(w.created_at),
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
    },
];

onMounted(async () => {
    await getWorkspaces();
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

.search-wrapper {
    width: 100%;
    max-width: 420px;
    height: 46px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border-radius: 14px;
    padding: 0 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.25s ease;
}

.search-wrapper:focus-within {
    border-color: #6366f1;

    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(99, 102, 241, 0.15);
}

.search-icon {
    color: #9ca3af;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;

    font-size: 14px;
    background: transparent;
    color: #111827;
}

.search-input::placeholder {
    color: #9ca3af;
}

.clear-btn {
    cursor: pointer;
    color: #9ca3af;
    font-size: 14px;
}

.clear-btn:hover {
    color: #ef4444;
}
</style>
