<template>
    <div class="container-fluid">
        <router-link to="/admin/workspaces" class="btn btn-outline-dark mb-3 align-items-center"><ArrowLeft />Back to Workspace</router-link>
        <div class="row">
            <div class="col-8">
                <BaseCard v-if="workspace" :project="workspaceCard" :stats="workspaceStats" :members="workspaceCard.membersList"/>

                <div class="team-section">
                    <h3>Teams</h3>
                    <div class="team-grid">
                        <BaseCard v-for="team in teamCards" :key="team.project.team_id" :project="team.project"
                            :stats="team.stats" :members="team.project.membersList" @click="goDetail(workspace_id, team.project.team_id)" />
                    </div>
                </div>
            </div>

            <div class="col-4">
                <div class="row g-4">
                    <BaseTitle title="Activities"></BaseTitle>

                    <div class="col-12">
                        <div class="card p-4 rounded-4 shadow-box border-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 class="fw-bold mb-1">Recent Daily Created Teams</h5>
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
import { ref, computed, onMounted, h } from "vue";
import { useRoute } from "vue-router";

import { useWorkspaceStore } from "@/stores/admin/workspaces";
import { useTeamstore } from "@/stores/admin/teams";
import { useTaskstore } from "@/stores/admin/tasks";

import { Users, ChartPie } from "lucide-vue-next";
import BaseCard from "@/components/BaseCard.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import { NTag } from "naive-ui";
import router from "@/router";


const route = useRoute();

const useWorkspace = useWorkspaceStore();
const useTeam = useTeamstore();
const useTask = useTaskstore();

const workspace = ref(null);
const teams = ref([]);
const tasks = ref([]);

/* TRUNCATE */
const truncateText = (text, length = 18) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
};

const workspace_id = Number(route.params.id);
/* LOAD DATA */
const loadData = async () => {
    await useWorkspace.fetchWorkspaces();
    await useTeam.fetchTeams();
    await useTask.fetchTasks();

    workspace.value = useWorkspace.workspaces.find(
        w => w.workspace_id === workspace_id
    );

    teams.value = useTeam.teams.filter(
        t => t.workspace?.workspace_id === workspace_id
    );

    tasks.value = useTask.tasks;
};

/* TOTALS */
const totalMembers = computed(() =>
    teams.value.reduce((sum, t) => sum + (t.members?.length || 0), 0)
);

const totalTasks = computed(() =>
    tasks.value.filter(t =>
        teams.value.map(tm => tm.team_id).includes(t.team_id)
    ).length
);

/* PROGRESS */
const progress = computed(() => {
    const done = tasks.value.filter(t =>
        teams.value.map(tm => tm.team_id).includes(t.team_id) &&
        t.status === "done"
    ).length;

    return totalTasks.value === 0
        ? 0
        : Math.round((done / totalTasks.value) * 100);
});

/* WORKSPACE CARD */
const workspaceCard = computed(() => ({
    name: workspace.value?.workspace_name,
    owner: workspace.value?.creator?.user_name || "Unknown",
    progress: progress.value,
    membersList: teams.value.flatMap(t => t.members || [])
}));

/* STATS */
const workspaceStats = computed(() => [
    { label: "Teams", value: teams.value.length, icon: Users, color: "#3b82f6" },
    { label: "Members", value: totalMembers.value, icon: Users, color: "#a855f7" },
    { label: "Tasks", value: totalTasks.value, icon: ChartPie, color: "#10b981" },
]);

/* TEAM CARDS */
const teamCards = computed(() =>
    teams.value.map(team => {
        const teamTasks = tasks.value.filter(t => t.team_id === team.team_id);
        const totalTeamTasks = teamTasks.length;
        const doneTasks = teamTasks.filter(t => t.status === "done").length;

        const owner = team.members?.find(m => m.role === "owner");

        return {
            project: {
                team_id: team.team_id,
                name: team.title,
                owner: owner?.name || "Unknown",
                membersList: team.members || [],
                progress: totalTeamTasks === 0
                    ? 0
                    : Math.round((doneTasks / totalTeamTasks) * 100),
            },
            stats: [
                { label: "Members", value: team.members?.length || 0, icon: Users, color: "#3b82f6" },
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
        .map(t => ({
            team: t.title,
            owner: t.members?.find(m => m.role === "owner")?.name || "Unknown",
            status: "New",
            type: "info",
        }))
);

/* TABLE */
const reportColumns = [
    {
        title: "Teams",
        key: "team",
        render(row) {
            return h(
                "span",
                {
                    class: "text-truncate d-inline-block",
                    style: "max-width:160px;"
                },
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
                {
                    class: "fw-bold text-truncate d-inline-block",
                    style: "max-width:140px;"
                },
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
                {
                    round: true,
                    bordered: false,
                    type: row.type,
                },
                { default: () => row.status },
            );
        },
    },
];const goDetail = (workspace_id, team_id) =>
    router.push(`/admin/workspace/${workspace_id}/teams/${team_id}`);

onMounted(loadData);
</script>

<style scoped>
.dashboard-card {
    min-height: 135px;
    padding: 22px;
}
.team-section h3 {
    margin: 32px 0 16px;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}
</style>