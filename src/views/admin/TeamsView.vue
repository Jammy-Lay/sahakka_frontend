<template>
    <div v-if="loading">
        <Loading></Loading>
    </div>
    <div v-else>
        <div class="row">
            <div class="col-4">
                <BaseTitle title="Teams"></BaseTitle>

            </div>
            <div class="col-8">
                <div class="d-flex justify-content-end">
                    <div class="search-box">
                        <Search class="search-icon" size="18" />

                        <input v-model="searchQuery" type="text" placeholder="Search teams..."
                            @input="currentPage = 1" />
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-3">
            <div class="col-6 col-md-4 col-lg-3" v-for="project in paginatedProjects" :key="project.id">
                <BaseCard :project="project" :stats="project.stats" :members="project.membersList"
                    @click="goDetail(project.workspace_id, project.team_id)" />
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-2 d-flex justify-content-end">
            <n-pagination v-model:page="currentPage" :page-count="totalPages">
                <template #prev>
                    <ChevronLeft />
                </template>

                <template #next>
                    <ChevronRight />
                </template>
            </n-pagination>
        </div>
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
import Loading from "@/components/layouts/Loading.vue";
import { useToast } from "vue-toastification";

const useTeam = useTeamstore();
const useTask = useTaskstore();
const loading = ref(false);
const toast = useToast();

const projects = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemPerPage = ref(8);

const getTeams = async () => {
    loading.value = true;
    try {
        await useTeam.fetchTeams();
        await useTask.fetchTasks();

        const tasksData = useTask.tasks;

        projects.value = useTeam.teams.map((team) => {
            // Tasks for this specific team
            const teamTasks = tasksData.filter(
                (t) => (t.team?.team_id ?? t.team_id) === team.team_id
            );

            const totalTasks = teamTasks.length;
            const doneTasks = teamTasks.filter((t) => t.status === "done").length;
            const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

            // members array comes directly from team object
            const membersList = team.members || [];

            // owner is the member with role "owner"
            const owner = membersList.find((m) => m.role === "owner");

            return {
                id: team.team_id,
                workspace_id: team.workspace?.workspace_id,
                team_id: team.team_id,
                name: team.title, // API uses "title" not "team_name"
                description: team.description,
                owner: owner?.name || "Unknown",
                membersList,
                tasks: totalTasks,
                progress,
                stats: [
                    { label: "Members", value: membersList.length, icon: Users, color: "#a855f7" },
                    { label: "Tasks", value: totalTasks, icon: ChartPie, color: "#10b981" },
                ],
            };
        });
    } catch (error) {
        toast.error("Failed to load");
    } finally {
        loading.value = false;
    }
};

const filteredProjects = computed(() =>
    projects.value.filter((p) =>
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

const changePage = (page) => (currentPage.value = page);

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
    width: 350px;
    height: 42px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 0 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .05);
    transition: .25s ease;
}


.search-box:focus-within {
    border-color: #6366f1;
    box-shadow:
        0 0 0 4px rgba(99, 102, 241, .15);
}

.search-icon {
    color: #9ca3af;
}


.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
}

.search-box input::placeholder {
    color: #9ca3af;
}
</style>
