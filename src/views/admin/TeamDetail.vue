<template>
    <div v-if="loading">
        <SkeletonTeamDetail />
    </div>
    <div v-else class="page-bg p-4">
        <router-link to="/admin/teams" class="btn btn-outline-dark mb-3 d-flex align-items-center gap-2 w-fit">
            <ArrowLeft size="16" />
            Back to Teams
        </router-link>

        <div class="row">
            <div class="col-6">
                <!-- Team Card -->
                <div class="team-card card p-4 mb-4" v-if="team">
                    <div class="d-flex align-items-start justify-content-between mb-3">
                        <div>
                            <div class="ws-pill d-inline-flex align-items-center gap-1 mb-2">
                                <Layers :size="12" />
                                {{ team?.workspace?.workspace_name || "Workspace" }}
                            </div>
                            <h5 class="team-title mb-1">{{ team.title }}</h5>
                            <p class="team-desc mb-0">{{ team.description || "No description" }}</p>
                        </div>
                    </div>

                    <hr />

                    <!-- Stats -->
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="stat-box d-flex align-items-center gap-2 rounded-3 p-3">
                                <div
                                    class="stat-icon stat-purple rounded-3 d-flex align-items-center justify-content-center">
                                    <Users size="16" />
                                </div>
                                <div>
                                    <div class="stat-label">Total members</div>
                                    <div class="stat-val">{{ team?.members?.length ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stat-box d-flex align-items-center gap-2 rounded-3 p-3">
                                <div
                                    class="stat-icon stat-blue rounded-3 d-flex align-items-center justify-content-center">
                                    <Layers-2 size="16" />
                                </div>
                                <div>
                                    <div class="stat-label">Workspace</div>
                                    <div class="stat-val text-truncate">{{ team?.workspace?.workspace_name || "N/A" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <!-- Members -->
                <div class="section-label mb-2">Members · {{ team?.members?.length ?? 0 }}</div>
                <n-scrollbar style="max-height: 230px">

                    <div class="row pt-3 g-4">
                        <div class="col-lg-12">
                            <n-data-table :columns="memberColumns" :data="team?.members || []"
                                :pagination="(team?.members?.length ?? 0) >= 9 ? { pageSize: 9 } : false"
                                :bordered="false" class="task-table" />
                        </div>
                    </div>
                </n-scrollbar>

            </div>

            <div class="col-12">
                <div class="row">
                    <div v-for="col in columns" :key="col.key" class="col-12 col-sm-6 col-lg-4 col-xl">
                        <div class="board-col h-100">
                            <div class="col-header d-flex align-items-center justify-content-between mb-3"
                                :class="col.titleClass">
                                <div class="col-title-pill d-flex align-items-center gap-2">
                                    <component :is="col.icon" :size="14" />
                                    <span>{{ col.label }}</span>
                                </div>
                                <span class="col-count">{{ tasksByStatus(col.key, team_id).length }}</span>
                            </div>

                            <n-scrollbar style="max-height: 67vh">
                                <div v-for="task in tasksByStatus(col.key, team_id)" :key="task.id" class="task-card">
                                    <!-- Header -->
                                    <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                                        <div>
                                            <span class="task-title">{{ task.title }}</span>
                                            <div class="task-id">#{{ task.id }} • {{ task.type }}</div>
                                        </div>
                                        <span v-if="task.priority" class="badge-priority"
                                            :class="`badge-${task.priority}`">
                                            {{ capitalize(task.priority) }}
                                        </span>
                                    </div>

                                    <!-- Description -->
                                    <p class="task-desc">{{ task.description || "No description" }}</p>

                                    <!-- Team -->
                                    <div class="info-box" v-if="task.team">
                                        <i class="bi bi-people"></i>
                                        <div>
                                            <div class="info-title">{{ task.team.name }}</div>
                                            <div class="info-sub">{{ task.team.description }}</div>
                                        </div>
                                    </div>

                                    <!-- Dates -->
                                    <div class="date-section">
                                        <div><i class="bi bi-calendar-event"></i> Start: <span>{{
                                            formatDate(task.dates.start)
                                                }}</span></div>
                                        <div><i class="bi bi-calendar-check"></i> End: <span>{{
                                            formatDate(task.dates.end)
                                                }}</span></div>
                                    </div>

                                    <!-- Footer -->
                                    <div class="task-footer d-flex justify-content-between align-items-center mt-2">
                                        <div class="d-flex align-items-center gap-1">
                                            <div class="avatar">
                                                <img v-if="task.assignedUser?.avatar" :src="task.assignedUser.avatar"
                                                    :alt="task.assignedUser?.name"
                                                    style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />
                                                <span v-else>{{ initials(task.assignedUser?.name) }}</span>
                                            </div>
                                            <span class="task-meta">{{ task.assignedUser?.name || "Unassigned" }}</span>
                                        </div>
                                        <span class="task-meta">{{ formatDate(task.createdAt) }}</span>
                                    </div>
                                </div>
                                <div v-if="tasksByStatus(col.key, team_id).length === 0" class="empty-col">No tasks
                                </div>
                            </n-scrollbar>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, h } from "vue";
import { useRoute } from "vue-router";
import { NAvatar, NButton, NTag } from "naive-ui";
import { CircleCheckBig, CircleDashed, Send, CircleCheck, CircleX } from "lucide-vue-next";
import { useTeamstore } from "@/stores/admin/teams";
import Loading from "@/components/layouts/Loading.vue";
import { useToast } from "vue-toastification";
import { useTaskstore } from "@/stores/admin/tasks";
import SkeletonTeamDetail from "@/components/Skeleton/SkeletonTeamDetail.vue";

const toast = useToast();
const loading = ref(false);

const route = useRoute();
const useTeam = useTeamstore();
const team_id = Number(route.params.id);

const team = computed(() => useTeam.currentTeam);

const memberColumns = [
    {
        title: "Member",
        key: "name",
        render(row) {
            return h("div", { class: "d-flex align-items-center gap-2" }, [
                h(NAvatar, {
                    round: true,
                    size: 34,
                    src: row.avatar,
                    fallbackSrc: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || "User")}&background=random&size=64`,
                }),
                h("div", {}, [
                    h("div", { style: "font-size: 13px; font-weight: 100;" }, row.name),
                    h("div", { style: "font-size: 11px; color: gray;" }, `user #${row.user_id}`),
                ]),
            ]);
        },
    },
    {
        title: "Role",
        key: "role",
        render(row) {
            return h(
                NTag,
                {
                    round: true,
                    size: "small",
                    type: row.role === "owner" ? "warning" : "default",
                },
                { default: () => row.role }
            );
        },
    },
];

const taskStore = useTaskstore();
const columns = [
    { key: "todo", label: "To Do", titleClass: "title-todo cus-title", icon: CircleCheckBig },
    { key: "in_progress", label: "In Progress", titleClass: "title-inprogress cus-title", icon: CircleDashed },
    { key: "submitted", label: "Submitted", titleClass: "title-submitted cus-title", icon: Send },
    { key: "approved", label: "Approved", titleClass: "title-approved cus-title", icon: CircleCheck },
    { key: "rejected", label: "Rejected", titleClass: "title-rejected cus-title", icon: CircleX },
];

const tasksByStatus = (status, team_id) =>
    taskStore.tasks.filter((t) => {
        const matchStatus = t.status === status;
        const matchTeam = t.team?.id === team_id;
        return matchStatus && matchTeam;
    });

const initials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
};

const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

const formatDate = (d) => {
    if (!d) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(d));
};

onMounted(async () => {
    loading.value = true;
    try {
        await useTeam.teamId(team_id);
        await taskStore.fetchTasks();
    } catch (error) {
        toast.error("Failed to load");
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.page-bg {
    background: #f4f6f9;
    min-height: 85vh;
}

.w-fit {
    width: fit-content;
}

.team-card {
    border-left: 3px solid #4361ee !important;
    border-radius: 0 14px 14px 0 !important;
    border: 0.5px solid #e8e8e8;
}

.ws-pill {
    background: #e6f1fb;
    color: #0c447c;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 20px;
}

.team-title {
    font-size: 18px;
    font-weight: 500;
}

.team-desc {
    font-size: 13px;
    color: #94a3b8;
}

.stat-box {
    background: #f8fafc;
}

.stat-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
}

.stat-purple {
    background: #cecbf6;
    color: #3c3489;
}

.stat-blue {
    background: #e6f1fb;
    color: #0c447c;
}

.stat-label {
    font-size: 11px;
    color: #94a3b8;
}

.stat-val {
    font-size: 14px;
    font-weight: 500;
}

.section-label {
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

:deep(.n-carousel-item) {
    width: auto !important;
}

:deep(.n-image) {
    width: 100% !important;
    display: block;
}

:deep(.n-image img) {
    width: 100% !important;
    height: 250px !important;
    object-fit: cover;
    border-radius: 8px;
}

:deep(.n-tabs-tab__label) {
    font-size: 15px;
    font-weight: 550;
    letter-spacing: 0.2px;
}

:deep(.task-table .n-data-table-wrapper) {
    overflow: hidden;
    background-color: #ffff;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
}

:deep(.n-data-table-th) {
    background-color: #ffff !important;
    color: #8e99a7 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    padding: 18px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.n-data-table-td) {
    padding: 15px !important;
    height: 60px !important;
}

:deep(.tb-h .n-data-table-td) {
    padding: 15px !important;
    height: 63px !important;
}

:deep(.n-data-table__pagination) {
    padding-top: 5px !important;
    padding-bottom: 0px !important;
}

:deep(.task-table .n-data-table-tbody tr:last-child td) {
    border-bottom: none !important;
}

:deep(.task-table .n-data-table-td) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.board {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    align-items: flex-start;
    padding-bottom: 12px;
}

/* ── Column ── */
.board-col {
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 14px 12px;
    /* removed: flex: 0 0 295px */
}

.col-count {
    font-size: 12px;
    background: #fff;
    border: 0.5px solid #ddd;
    border-radius: 8px;
    padding: 2px 9px;
    color: #888;
    font-weight: 500;
}

.col-title {
    font-size: 14px;
    font-weight: 600;
}

.cus-title {
    padding: 10px 15px;
    border-radius: 30px;
}

.title-todo {
    color: #4361ee;
    background-color: #B2DBFF;
}

.title-inprogress {
    color: #FF973B;
    background-color: #FFDDBE;
}

.title-submitted {
    color: #6155F5;
    background-color: #CFCCFC;
}

.title-approved {
    color: #3CB159;
    background-color: #C2EECD;
}

.title-rejected {
    color: #FF383C;
    background-color: #FFC3C4;
}


/* ── Card ── */
.task-card {
    background: #fff;
    border: 0.5px solid #e3e3e3;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 8px;
    transition: border-color 0.15s, box-shadow 0.15s;
    cursor: pointer;
}

.task-card:hover {
    border-color: #bbb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-card:last-child {
    margin-bottom: 0;
}

.task-title {
    font-size: 13px;
    font-weight: 600;
    color: #111;
    line-height: 1.4;
}

.task-desc {
    font-size: 12px;
    color: #777;
    line-height: 1.5;
    margin-bottom: 10px;
    margin-top: 0;
}

/* ── Priority badges ── */
.badge-priority {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 9px;
    border-radius: 8px;
    white-space: nowrap;
    flex-shrink: 0;
}

.badge-urgent {
    background: #faece7;
    color: #993c1d;
}

.badge-high {
    background: #faeeda;
    color: #854f0b;
}

.badge-medium {
    background: #e6f1fb;
    color: #185fa5;
}

.badge-low {
    background: #eaf3de;
    color: #3b6d11;
}

/* ── Footer ── */
.task-footer {
    font-size: 11px;
    color: #999;
}

.task-meta {
    font-size: 11px;
    color: #999;
}

.avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #dbeafe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 600;
    color: #1e40af;
    flex-shrink: 0;
}

/* ── Empty state ── */
.empty-col {
    font-size: 12px;
    color: #bbb;
    text-align: center;
    padding: 20px 0;
}

.team-info {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #666;
    background: #f7f7f7;
    padding: 4px 8px;
    border-radius: 8px;
    width: fit-content;
}

.team-info i {
    font-size: 11px;
}

.task-id {
    font-size: 10px;
    color: #999;
    margin-top: 2px;
}

.info-box {
    display: flex;
    gap: 8px;
    background: #f7f7f7;
    padding: 8px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.info-box i {
    color: #666;
}

.info-title {
    font-size: 12px;
    font-weight: 600;
}

.info-sub {
    font-size: 11px;
    color: #888;
}

.date-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
    color: #777;
    margin-bottom: 10px;
}

.date-section i {
    margin-right: 4px;
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
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(99, 102, 241, 0.15);
}

.search-icon {
    color: #9ca3af;
    flex-shrink: 0;
}

.search-wrapper .form-control:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: transparent !important;
}
</style>