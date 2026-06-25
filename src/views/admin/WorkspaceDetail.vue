<template>
    <div v-if="loading">
        <SkeletonWorkspaceDetail></SkeletonWorkspaceDetail>
    </div>
    <div v-else class="container-fluid">
        <router-link to="/admin/workspaces" class="btn btn-outline-dark mb-3 align-items-center">
            <ArrowLeft />Back to Workspace
        </router-link>
        <div class="row">
            <!-- Left Panel -->
            <div class="col-xl-8">
                <div class="row g-3">

                    <!-- Workspace Card -->
                    <div class="col-12">
                        <BaseCard v-if="workspace" :project="workspaceCard" :stats="workspaceStats"
                            :members="workspaceCard.membersList" />
                    </div>

                    <!-- Teams Section -->
                    <div class="col-12">
                        <h3 class="pt-3">Teams</h3>
                        <div class="row g-3 mt-1">
                            <div v-for="team in teamCards" :key="team.project.team_id" class="col-12 col-lg-6">
                                <BaseCardTeam :workspace="team.project.workspace_name" :title="team.project.name"
                                    :description="team.project.description" :progress="team.project.progress"
                                    :owner="team.project.owner" :members="team.project.membersList"
                                    @view="goDetail(team.project.workspace_id, team.project.team_id)" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Right Panel -->
            <div class="col-xl-4">
                <div class="row g-4">

                    <!-- Title -->
                    <div class="col-12">
                        <div class="d-flex align-items-center gap-2">
                            <Clock class="text-prime" :size="30" />
                            <BaseTitle title="Activies" class="mb-0" />
                        </div>
                    </div>

                    <!-- Recent Teams Table -->
                    <div class="col-12">
                        <div class="card p-4 rounded-4 shadow-sm border-0">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 class="fw-bold mb-1">Recent Daily Created Teams</h5>
                                    <p class="m-0 text-secondary fs-7">Latest created</p>
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
import { ref, computed, onMounted, h } from "vue";
import { useRoute } from "vue-router";

import { useWorkspaceStore } from "@/stores/admin/workspaces";
import { useTeamstore } from "@/stores/admin/teams";
import { useTaskstore } from "@/stores/admin/tasks";

import { Users, ChartPie, Clock, ArrowLeft } from "lucide-vue-next";
import BaseCard from "@/components/BaseCard.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import { NTag } from "naive-ui";
import router from "@/router";
import { useToast } from "vue-toastification";
import BaseCardTeam from "@/components/BaseCardTeam.vue";
import SkeletonWorkspaceDetail from "@/components/Skeleton/SkeletonWorkspaceDetail.vue";

const route = useRoute();
const loading = ref(false);
const toast = useToast();

const useWorkspace = useWorkspaceStore();
const useTeam = useTeamstore();
const useTask = useTaskstore();

const workspace = ref(null);
const teams = ref([]);
const tasks = ref([]);

const truncateText = (text, length = 18) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
};

const workspace_id = Number(route.params.id);

/* LOAD DATA */
const loadData = async () => {
    loading.value = true;
    try {
        await useWorkspace.fetchWorkspaces();
        await useTeam.fetchTeams();
        await useTask.fetchTasks();

        workspace.value = useWorkspace.workspaces.find(
            (w) => w.workspace_id === workspace_id
        );

        teams.value = useTeam.teams.filter(
            (t) => t.workspace?.workspace_id === workspace_id
        );

        tasks.value = useTask.tasks;
    } catch (error) {
        console.error(error);
        toast.error(`Failed to load: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

/* TOTALS */
const totalMembers = computed(() => {
    const allMembers = teams.value.flatMap((t) => t.members || []);
    const uniqueMembers = [...new Map(allMembers.map((m) => [m.user_id, m])).values()];
    return uniqueMembers.length;
});

const teamIds = computed(() =>
    teams.value.map((team) => team.team_id)
);

const workspaceTasks = computed(() =>
    useTask.tasks.filter((task) =>
        teamIds.value.includes(task.team?.id)
    )
);

const totalTasks = computed(() => workspaceTasks.value.length);

const progress = computed(() => {
    const approved = workspaceTasks.value.filter(
        (task) => task.status?.trim() === "approved"
    ).length;
    return totalTasks.value === 0
        ? 0
        : Math.round((approved / totalTasks.value) * 100);
});

const workspaceCard = computed(() => {
    const allMembers = teams.value.flatMap((t) => t.members || []);
    const uniqueMembers = [...new Map(allMembers.map((m) => [m.user_id, m])).values()];

    return {
        name: workspace.value?.workspace_name,
        owner: workspace.value?.creator?.user_name || "Unknown",
        progress: progress.value,
        membersList: uniqueMembers, // deduplicated
    };
});

/* WORKSPACE STATS */
const workspaceStats = computed(() => [
    { label: "Teams", value: teams.value.length, icon: Users, color: "#3b82f6" },
    { label: "Members", value: totalMembers.value, icon: Users, color: "#a855f7" }, // already uses totalMembers
    { label: "Tasks", value: totalTasks.value, icon: ChartPie, color: "#10b981" },
]);

/* TEAM CARDS */
const teamCards = computed(() =>
    teams.value.map((team) => {
        // FIX: use useTask.tasks (live store) not tasks.value (local ref)
        const teamTasks = useTask.tasks.filter(
            (t) => t.team?.id === team.team_id
        );

        const totalTeamTasks = teamTasks.length;
        const doneTasks = teamTasks.filter(
            (t) => t.status?.trim() === "approved"
        ).length;
        const teamProgress = totalTeamTasks === 0
            ? 0
            : Math.round((doneTasks / totalTeamTasks) * 100);

        const memberCount = team.members?.length || 0;
        const owner = team.members?.find((m) => m.role === "owner") ?? team.members?.[0];

        return {
            project: {
                team_id: team.team_id,
                workspace_id: team.workspace?.workspace_id,
                workspace_name: team.workspace?.workspace_name,
                name: team.title,
                description: team.description,
                membersList: team.members || [],
                owner,
                progress: teamProgress,
            },
            stats: [
                { label: "Members", value: memberCount, icon: Users, color: "#3b82f6" },
                { label: "Tasks", value: totalTeamTasks, icon: ChartPie, color: "#10b981" },
            ],
        };
    })
);

/* RECENT TEAMS */
const recentUsersList = computed(() =>
    [...useTeam.teams]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map((t) => ({
            team: t.title,
            owner: t.members?.find((m) => m.role === "owner")?.name || "Unknown",
            status: "New",
            type: "info",
        }))
);

/* TABLE COLUMNS */
const reportColumns = [
    {
        title: "Teams",
        key: "team",
        render(row) {
            return h(
                "span",
                { class: "text-truncate d-inline-block", style: "max-width:160px;" },
                truncateText(row.team, 18)
            );
        },
    },
    {
        title: "Owner",
        key: "owner",
        render(row) {
            return h(
                "span",
                { class: "fw-bold text-truncate d-inline-block", style: "max-width:140px;" },
                truncateText(row.owner, 16)
            );
        },
    },
    {
        title: "STATUS",
        key: "status",
        render(row) {
            return h(
                NTag,
                { round: true, bordered: false, type: row.type },
                { default: () => row.status }
            );
        },
    },
];

const goDetail = (workspace_id, team_id) =>
    router.push(`/admin/workspace/${workspace_id}/teams/${team_id}`);

onMounted(loadData);
</script>

<style scoped></style>