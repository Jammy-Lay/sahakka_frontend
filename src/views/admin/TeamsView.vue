<template>
    <div v-if="loading">
        <SkeletonTeam></SkeletonTeam>
    </div>
    <div v-else>
        <div class="row">
            <div class="col-4 pb-4">
                <div class="d-flex align-items-center gap-2">
                    <Users class="text-prime" :size="30" />
                    <BaseTitle title="Teams" class="mb-0" />
                </div>
            </div>
            <div class="col-8">
                <div class="d-flex justify-content-end">
                    <div class="form-control rounded-btn d-flex align-items-center py-1" style="width: 300px;">
                        <input v-model="searchQuery" type="text"
                            class="search-input shadow-none outline-none border-0 w-100"
                            placeholder="Search Team" />
                        <Search color="var(--bs-gray)" size="18" />
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-3">
            <template v-if="paginatedProjects.length > 0">
                <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="project in paginatedProjects"
                    :key="project.team_id">
                    <BaseCardTeam :workspace="project.workspace_name" :title="project.name"
                        :description="project.description" :progress="project.progress" :owner="project.owner"
                        :members="project.membersList" @view="goDetail(project.workspace_id, project.team_id)" />
                </div>
            </template>

            <!-- Empty state -->
            <div v-else class="d-flex justify-content-center align-items-center" style="height: 300px;">
                <n-empty description="No Data" />
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4 d-flex justify-content-end">
            <n-pagination v-if="totalPages > 1" v-model:page="currentPage" :page-count="totalPages">
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
import { useTeamstore } from "@/stores/admin/teams";
import { useTaskstore } from "@/stores/admin/tasks";
import { onMounted, ref, computed, watch } from "vue";
import router from "@/router";
import { ChartPie, Users } from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";
import { useToast } from "vue-toastification";
import BaseCardTeam from "@/components/BaseCardTeam.vue";
import SkeletonTeam from "@/components/Skeleton/SkeletonTeam.vue";
import { notify } from "@/utils/toast";

const useTeam = useTeamstore();
const useTask = useTaskstore();
const loading = ref(false);
const toast = notify(router);

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
            const teamTasks = tasksData.filter(
                (t) => String(t.team?.id) === String(team.id ?? team.team_id)
            );
            const totalTasks = teamTasks.length;
            const doneTasks = teamTasks.filter(
                (t) => t.status?.trim() === "approved"  // FIX: trim whitespace
            ).length;
            const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);


            const membersList = team.members || [];
            const owner = membersList.find((m) => m.role === "owner") ?? membersList[0];

            return {
                team_id: team.team_id,
                workspace_id: team.workspace?.workspace_id,
                workspace_name: team.workspace?.workspace_name,
                name: team.title,
                description: team.description,
                owner,
                membersList,
                progress,
            };
        });
    } catch (error) {
        toast.error(`Failed to load: ${error.message}`);
    } finally {
        loading.value = false;
    }
};

// FIX: reset to page 1 when search changes
watch(searchQuery, () => {
    currentPage.value = 1;
});
const recentTeamsList = computed(() =>
    [...projects.value]
        .sort((a, b) => b.team_id - a.team_id)
        .slice(0, 5)
        .map((p) => ({
            team: p.name,
            workspace: p.workspace_name,
            owner: p.owner?.name || "Unknown",
            date: formatDate(p.createdAt), // will show N/A — see option 2
        }))
);
const filteredProjects = computed(() =>
    projects.value
        .filter((p) =>
            p.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .sort((a, b) => b.team_id - a.team_id)
);

const totalPages = computed(() =>
    Math.ceil(filteredProjects.value.length / itemPerPage.value)
);

const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemPerPage.value;
    return filteredProjects.value.slice(start, start + itemPerPage.value);
});

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

.search-input:focus {
    outline: none;
}

.form-control:has(.search-input:focus) {
    outline: 1px solid #171717;
}
</style>
