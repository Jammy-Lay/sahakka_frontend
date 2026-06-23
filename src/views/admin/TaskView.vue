<template>
    <div v-if="taskStore.loading">
        <SkeletonTask></SkeletonTask>
    </div>
    <div v-else class="row g-3">
        <div class="col-12">
            <div class="row justify-content-between">
                <div class="col-4">
                    <div class="d-flex align-items-center gap-2">
                        <ChartPie class="text-prime" :size="30" />
                        <BaseTitle title="Tasks" class="mb-0" />
                    </div>
                </div>
                <div class="mb-4 col-12 col-sm-6 col-md-4 col-lg-3 px-0">
                    <div class="form-control rounded-btn d-flex align-items-center py-1" style="width: 300px;">
                        <input v-model="search" type="text" class="search-input shadow-none outline-none border-0 w-100"
                            placeholder="Search by team name..." />
                        <Search color="var(--bs-gray)" size="18" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="row">
                <div v-for="col in columns" :key="col.key" class="col-12 col-sm-6 col-lg-4 col-xl">
                    <div class="board-col h-100">
                        <div class="col-header d-flex align-items-end justify-content-between mb-4"
                            :class="col.titleClass">
                            <div class="col-title-pill d-flex align-items-center gap-2">
                                <component :is="col.icon" :size="14" />
                                <span>{{ col.label }}</span>
                            </div>
                            <span class="col-count">{{ tasksByStatus(col.key).length }}</span>
                        </div>

                        <n-scrollbar style="max-height: 67vh">
                            <div v-for="task in tasksByStatus(col.key)" :key="task.id" class="task-card">
                                <!-- Header -->
                                <div class="d-flex align-items-start justify-content-between gap- mb-2">
                                    <div>
                                        <span class="task-title text-truncate-1">{{ task.title }}</span>
                                        <div class="task-id">#{{ task.id }} • {{ task.type }}</div>
                                    </div>
                                    <span v-if="task.priority" class="badge-priority" :class="`badge-${task.priority}`">
                                        {{ capitalize(task.priority) }}
                                    </span>
                                </div>

                                <!-- Description -->
                                <p class="task-desc text-truncate-3">{{ task.description || "No description" }}</p>

                                <!-- Team -->
                                <div class="info-box" v-if="task.team">
                                    <i class="bi bi-people"></i>
                                    <div>
                                        <div class="info-title text-truncate-1">{{ task.team.name }}</div>
                                        <div class="info-sub text-truncate-3">{{ task.team.description }}</div>
                                    </div>
                                </div>

                                <!-- Dates -->
                                <div class="date-section">
                                    <div><i class="bi bi-calendar-event"></i> Start: <span>{{
                                        formatDate(task.dates.start)
                                            }}</span></div>
                                    <div><i class="bi bi-calendar-check"></i> End: <span>{{ formatDate(task.dates.end)
                                            }}</span>
                                    </div>
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
                                        <span class="task-meta text-truncate-1">{{ task.assignedUser?.name || "Unassigned" }}</span>
                                    </div>
                                    <span class="task-meta">{{ formatDate(task.createdAt) }}</span>
                                </div>
                            </div>
                        </n-scrollbar>

                        <div v-if="tasksByStatus(col.key).length === 0" class="empty-col">No tasks</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTaskstore } from "@/stores/admin/tasks";
import { ref, onMounted } from "vue";
import { CircleCheckBig, CircleDashed, Send, CircleCheck, CircleX } from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";
import SkeletonTask from "@/components/Skeleton/SkeletonTask.vue";

const taskStore = useTaskstore();
const search = ref("");
const columns = [
    { key: "todo", label: "To Do", titleClass: "title-todo cus-title", icon: CircleCheckBig },
    { key: "in_progress", label: "In Progress", titleClass: "title-inprogress cus-title", icon: CircleDashed },
    { key: "submitted", label: "Submitted", titleClass: "title-submitted cus-title", icon: Send },
    { key: "approved", label: "Approved", titleClass: "title-approved cus-title", icon: CircleCheck },
    { key: "rejected", label: "Rejected", titleClass: "title-rejected cus-title", icon: CircleX },
];

const tasksByStatus = (status) =>
    taskStore.tasks.filter((t) => {
        const matchStatus = t.status === status;
        const matchTeam = t.team?.name?.toLowerCase().includes(search.value.toLowerCase());
        return matchStatus && matchTeam;
    });

onMounted(async () => {
    await taskStore.fetchTasks();
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

</script>

<style scoped>
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
    padding: 14px 0px;
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
    margin-bottom: 22px;
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

.search-input:focus {
  outline: none;
}

.form-control:has(.search-input:focus) {
  outline: 1px solid #171717;
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
