<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-8">
                <BaseTitle title="Workspaces"></BaseTitle>
                <!-- Search -->
                <div class="search-box my-4">
                    <Search class="search-icon" size="18" />
                    <input v-model="searchQuery" type="text" class="form-control" placeholder="Search workspace..."
                        @input="currentPage = 1" />
                </div>

                <!-- Cards -->

                <div class="project-grid">
                    <BaseCard v-for="project in paginatedProjects" :key="project.id" :project="project"
                        :stats="project.stats" :members="project.membersList" @click="goDetail(project.id)" />
                </div>

                <!-- Pagination -->

                <BasePagination :totalPages="totalPages" :currentPage="currentPage" :hasNextPage="hasNextPage"
                    :hasPreviousPage="hasPreviousPage" :totalItems="searchedProjects.length" :itemPerPage="itemPerPage"
                    @changePage="changePage" />
            </div>
            <div class="col-4">
                <div class="row g-4">
                    <BaseTitle title="Activities"></BaseTitle>
                    <div v-for="item in stats" :key="item.label" class="col-6">
                        <div class="card dashboard-card shadow-box rounded-4 border-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <p class="text-secondary fs-7 mb-2">{{ item.label }}</p>
                                    <h3 class="fw-bold mb-1">{{ item.value }}</h3>
                                    <div class="d-flex align-items-center gap-1 fs-7"
                                        :class="item.trendType === 'up' ? 'text-success' : 'text-prime'">
                                        <span>{{ item.note }}</span>
                                    </div>
                                </div>
                                <div class="stat-icon">
                                    <component :is="item.icon" :size="22" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card p-4 rounded-4 shadow-box border-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 class="fw-bold mb-1">Recent Daily Created Workspaces</h5>
                                    <p class="m-0 text-secondary fs-7">
                                        Latest created
                                    </p>
                                </div>
                            </div>
                            <n-data-table :columns="reportColumns" :data="recentUsersList" :pagination="false"
                                :bordered="false" class="dashboard-table" />
                        </div>
                    </div>
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
import {
    ChartPie,
    Users,
    Layers,
} from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";

const useWorkspace = useWorkspaceStore();
const useTeam = useTeamstore();
const useTask = useTaskstore();

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
    return text.length > length
        ? text.slice(0, length) + "..."
        : text;
};

const getWorkspaces = async () => {
    await useWorkspace.fetchWorkspaces();
    await useTeam.fetchTeams();
    await useTask.fetchTasks();
    const teamsData = useTeam.teams;
    const tasksData = useTask.tasks;

    projects.value = useWorkspace.workspaces.map((workspace) => {
        // teams

        const workspaceTeams = teamsData.filter(
            (team) => team.workspace?.workspace_id === workspace.workspace_id);
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
            membersList: workspaceTeams.flatMap(team => team.members || []),
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
        .map(w => ({
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
                    style: "max-width:140px;"
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

.search-box {
    position: relative;
    width: 300px;
}

.search-box input {
    padding-left: 42px;
    height: 42px;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    z-index: 2;
}
</style>
