<template>
    <div>
        <BaseTitle title="Teams"></BaseTitle>
        <div class="search-box my-4">
            <Search class="search-icon" size="18" />
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search teams..."
                @input="currentPage = 1" />
        </div>

        <div class="project-grid">
            <BaseCard v-for="project in paginatedProjects" :key="project.id" :project="project" :stats="project.stats"
                :members="project.membersList" @click="goDetail(project.workspace_id, project.team_id)" />
        </div>

        <BasePagination :totalPages="totalPages" :currentPage="currentPage" :hasNextPage="hasNextPage"
            :hasPreviousPage="hasPreviousPage" :totalItems="filteredProjects.length" :itemPerPage="itemPerPage"
            @changePage="changePage" />
    </div>
</template>

<script setup>
import BaseCard from "@/components/BaseCard.vue";
import BasePagination from "@/components/BasePagination.vue";
import { useTeamstore } from "@/stores/admin/teams";
import { useTaskstore } from "@/stores/admin/tasks";
import { onMounted, ref, computed } from "vue";
import router from "@/router";
import { ChartPie, Users, Search } from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";

const useTeam = useTeamstore();
const useTask = useTaskstore();

const projects = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemPerPage = ref(8);

const getTeams = async () => {
    await useTeam.fetchTeams();
    await useTask.fetchTasks();

    const tasksData = useTask.tasks;

    projects.value = useTeam.teams.map(team => {
        // Tasks for this specific team
        const teamTasks = tasksData.filter(t =>
            (t.team?.team_id ?? t.team_id) === team.team_id
        );

        const totalTasks = teamTasks.length;
        const doneTasks = teamTasks.filter(t => t.status === "done").length;
        const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

        // members array comes directly from team object
        const membersList = team.members || [];

        // owner is the member with role "owner"
        const owner = membersList.find(m => m.role === "owner");

        return {
            id: team.team_id,
            workspace_id: team.workspace?.workspace_id,
            team_id: team.team_id,
            name: team.title,                        // API uses "title" not "team_name"
            description: team.description,
            owner: owner?.name || "Unknown",
            membersList,
            tasks: totalTasks,
            progress,
            stats: [
                { label: "Members", value: membersList.length, icon: Users, color: "#a855f7" },
                { label: "Tasks", value: totalTasks, icon: ChartPie, color: "#10b981" }
            ]
        };
    });
};

const filteredProjects = computed(() =>
    projects.value.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const totalPages = computed(() =>
    Math.ceil(filteredProjects.value.length / itemPerPage.value)
);

const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemPerPage.value;
    return filteredProjects.value.slice(start, start + itemPerPage.value);
});

const hasNextPage = computed(() => currentPage.value < totalPages.value);
const hasPreviousPage = computed(() => currentPage.value > 1);

const changePage = (page) => currentPage.value = page;

const goDetail = (workspace_id, team_id) =>
    router.push(`/admin/workspace/${workspace_id}/teams/${team_id}`);

onMounted(getTeams);
</script>

<style scoped>
.project-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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