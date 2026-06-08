<template>
    <div class="p-4 w-100">
        <h5 class="fw-500 mb-4">Task Board</h5>

        <div class="board">
            <div v-for="col in columns" :key="col.key" class="board-col">
                <div class="col-header d-flex align-items-center justify-content-between mb-3">
                    <span class="col-title" :class="col.titleClass">{{ col.label }}</span>
                    <span class="col-count">{{ tasksByStatus(col.key).length }}</span>
                </div>

                <div v-for="task in tasksByStatus(col.key)" :key="task.id" class="task-card">
                    <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <span class="task-title">{{ task.title }}</span>
                        <span v-if="task.priority" class="badge-priority" :class="`badge-${task.priority}`">
                            {{ capitalize(task.priority) }}
                        </span>
                    </div>

                    <p class="task-desc">{{ task.description }}</p>

                    <div class="task-footer d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-1">
                            <div class="avatar">{{ initials(task.assigned_user?.name) }}</div>
                            <span class="task-meta">{{ task.assigned_user?.name || 'Unassigned' }}</span>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <i class="bi bi-calendar3 task-meta"></i>
                            <span class="task-meta">{{ formatDate(task.end_date) }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="tasksByStatus(col.key).length === 0" class="empty-col">
                    No tasks
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTaskstore } from "@/stores/admin/tasks";
import { ref, onMounted } from "vue";

const taskStore = useTaskstore();

const columns = [
  { key: "todo",        label: "To Do",       titleClass: "title-todo"       },
  { key: "in_progress", label: "In Progress", titleClass: "title-inprogress" },
  { key: "submitted",   label: "Submitted",   titleClass: "title-submitted"  },
  { key: "approved",    label: "Approved",    titleClass: "title-approved"   },
  { key: "rejected",    label: "Rejected",    titleClass: "title-rejected"   },
];

const tasksByStatus = (status) => taskStore.tasks.filter(t => t.status === status);

onMounted(async () => {
  await taskStore.fetchTasks();
});

const initials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
};

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const formatDate = (d) => {
    if (!d) return "—";
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
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
    flex: 0 0 295px;
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 14px 12px;
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

.title-todo {
    color: #111;
}

.title-inprogress {
    color: #185FA5;
}

.title-submitted {
    color: #854F0B;
}

.title-approved {
    color: #3B6D11;
}

.title-rejected {
    color: #A32D2D;
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
    background: #FAECE7;
    color: #993C1D;
}

.badge-high {
    background: #FAEEDA;
    color: #854F0B;
}

.badge-medium {
    background: #E6F1FB;
    color: #185FA5;
}

.badge-low {
    background: #EAF3DE;
    color: #3B6D11;
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
</style>