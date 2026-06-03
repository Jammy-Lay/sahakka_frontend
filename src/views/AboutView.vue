<template>
  <div class="app-wrapper">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <Grid3x3 :size="20" />
        </div>
        <span class="brand-name">Jammy's workspace</span>
        <ChevronDown :size="16" class="ms-auto text-muted" />
      </div>

      <div class="sidebar-section-label">Team</div>

      <div class="sidebar-nav">
        <div
          v-for="team in teams"
          :key="team.id"
          class="sidebar-item"
          :class="{ active: activeTeam === team.id }"
          @click="activeTeam = team.id"
        >
          <div class="sidebar-item-info">
            <span class="sidebar-item-title">{{ team.name }}</span>
            <span class="sidebar-item-sub">{{ team.desc }}</span>
            <div class="progress-bar-wrap mt-1">
              <div class="progress-bar-track">
                <div
                  class="progress-bar-fill"
                  :style="{ width: team.progress + '%' }"
                ></div>
              </div>
              <span class="progress-label">{{ team.progress }}%</span>
            </div>
            <div class="avatar-group mt-1">
              <span v-for="n in 3" :key="n" class="avatar-dot"></span>
              <span class="avatar-more">+2</span>
            </div>
          </div>
          <ChevronRight :size="14" class="text-muted" />
        </div>
      </div>

      <button class="btn-new-team mt-3">
        <Plus :size="14" />
        New team
      </button>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">J</div>
          <div>
            <div class="user-name">Jammy</div>
            <div class="user-email">jammy168@gmail.com</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN AREA -->
    <div class="main-area">
      <!-- TOP NAVBAR -->
      <header class="topnav">
        <nav class="nav-tabs-custom">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="nav-tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </nav>

        <div class="topnav-actions">
          <button class="icon-btn"><Bell :size="18" /></button>
          <button class="icon-btn"><Settings :size="18" /></button>
          <button class="btn-invite">
            <Mail :size="14" />
            Invite
          </button>
        </div>
      </header>

      <!-- CONTENT + CALENDAR -->
      <div class="content-row">
        <!-- CENTER CONTENT (slot) -->
        <main class="center-content">
          <div class="content-header">
            <div>
              <h2 class="content-title">Front-End</h2>
              <p class="content-sub">Build a website interface</p>
            </div>
            <div class="d-flex gap-2">
              <button class="icon-btn"><Filter :size="16" /> Filter</button>
              <button class="btn-new-task"><Plus :size="16" /> New task</button>
            </div>
          </div>

          <!-- Status Filter Badges -->
          <div class="badge-row">
            <span
              v-for="badge in badges"
              :key="badge.label"
              class="status-badge"
              :class="badge.cls"
              :style="activeFilter === badge.label ? 'opacity:1' : 'opacity:0.6'"
              @click="activeFilter = badge.label"
            >
              <component :is="badge.icon" :size="12" />
              {{ badge.label }}
            </span>
          </div>

          <!-- Placeholder task cards -->
          <div class="task-card" v-for="i in 3" :key="i">
            <div class="task-card-top">
              <div class="task-user">
                <div class="user-avatar sm">J</div>
                <span class="text-muted small">Jammy · assign to you</span>
              </div>
              <span class="badge-task">Task</span>
            </div>
            <div class="task-meta">
              <span class="meta-item"><RefreshCw :size="12" /> To do</span>
              <span class="meta-item priority-high">● High</span>
              <span class="meta-item"><User :size="12" /> Sothatt (You)</span>
              <span class="meta-item"><Calendar :size="12" /> 1/Jan/2026</span>
            </div>
            <div class="task-title">Create location tracking</div>
            <p class="task-body">
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has
              roots in a piece of classical Latin literature from 45 BC...
            </p>
          </div>
        </main>

        <!-- RIGHT CALENDAR PANEL -->
        <aside class="calendar-panel">
          <div class="cal-header">
            <span class="cal-month">January 2026</span>
            <div class="d-flex gap-1">
              <button class="icon-btn sm"><ChevronLeft :size="14" /></button>
              <button class="icon-btn sm"><ChevronRight :size="14" /></button>
            </div>
          </div>

          <div class="cal-grid">
            <div class="cal-day-label" v-for="d in dayLabels" :key="d">{{ d }}</div>
            <div
              v-for="cell in calCells"
              :key="cell.key"
              class="cal-cell"
              :class="{
                empty: !cell.day,
                today: cell.day === 20,
                'other-month': cell.otherMonth,
              }"
            >
              {{ cell.day || "" }}
            </div>
          </div>

          <div class="cal-time">
            <Clock :size="14" />
            <span>Time</span>
            <span class="ms-auto time-value">9:41 AM</span>
          </div>

          <!-- Task completion -->
          <div class="completion-section">
            <div class="completion-title">Task completion</div>

            <div class="completion-card">
              <div>
                <div class="completion-label">Task completed</div>
                <div class="completion-count">11 / 20</div>
              </div>
              <div class="donut green">
                <svg viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e9ecef"
                    stroke-width="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#22c55e"
                    stroke-width="3"
                    stroke-dasharray="55 45"
                    stroke-linecap="round"
                    transform="rotate(-90 18 18)"
                  />
                  <text
                    x="18"
                    y="21"
                    text-anchor="middle"
                    font-size="7"
                    fill="#22c55e"
                    font-weight="bold"
                  >
                    55%
                  </text>
                </svg>
              </div>
            </div>

            <div class="completion-card">
              <div>
                <div class="completion-label">In progress</div>
                <div class="completion-count">8 / 20</div>
              </div>
              <div class="donut purple">
                <svg viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e9ecef"
                    stroke-width="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#8b5cf6"
                    stroke-width="3"
                    stroke-dasharray="70 30"
                    stroke-linecap="round"
                    transform="rotate(-90 18 18)"
                  />
                  <text
                    x="18"
                    y="21"
                    text-anchor="middle"
                    font-size="7"
                    fill="#8b5cf6"
                    font-weight="bold"
                  >
                    70%
                  </text>
                </svg>
              </div>
            </div>

            <div class="row g-2 mt-1">
              <div class="col-6">
                <div class="mini-stat">
                  <span class="mini-label">Approved</span>
                  <div class="mini-bar approved"></div>
                  <span class="mini-pct">40%</span>
                </div>
              </div>
              <div class="col-6">
                <div class="mini-stat">
                  <span class="mini-label">Rejected</span>
                  <div class="mini-bar rejected"></div>
                  <span class="mini-pct text-danger">15%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Grid3x3,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Bell,
  Settings,
  Mail,
  Filter,
  RefreshCw,
  User,
  Calendar,
  Clock,
} from "lucide-vue-next";

const activeTeam = ref(1);
const activeTab = ref("Tasks");
const activeFilter = ref("All tasks");

const teams = [
  { id: 1, name: "Front End", desc: "Build a website interface", progress: 60 },
  { id: 2, name: "Back End", desc: "Build a website API", progress: 60 },
  { id: 3, name: "UX/UI Design", desc: "Design a website interface", progress: 60 },
];

const tabs = ["Tasks", "Issues", "Document", "Activity"];

const badges = [
  { label: "All tasks", cls: "badge-all", icon: Grid3x3 },
  { label: "To do", cls: "badge-todo", icon: RefreshCw },
  { label: "In process", cls: "badge-inprocess", icon: RefreshCw },
  { label: "Submitted", cls: "badge-submitted", icon: Filter },
  { label: "Approved", cls: "badge-approved", icon: ChevronRight },
  { label: "Rejected", cls: "badge-rejected", icon: ChevronDown },
];

const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Jan 2026 starts on Thursday (index 4)
const calCells = [
  ...Array(3)
    .fill(null)
    .map((_, i) => ({ key: `e${i}`, day: null })),
  ...Array(31)
    .fill(null)
    .map((_, i) => ({ key: i + 1, day: i + 1 })),
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap");
@import "bootstrap/dist/css/bootstrap.min.css";

* {
  box-sizing: border-box;
}

.app-wrapper {
  display: flex;
  height: 100vh;
  font-family: "DM Sans", sans-serif;
  background: #f8f9fb;
  color: #1a1d23;
  overflow: hidden;
}

/* ── SIDEBAR ─────────────────────────────── */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: #fff;
  border-right: 1px solid #eef0f3;
  display: flex;
  flex-direction: column;
  padding: 0 0 16px;
  overflow-y: auto;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #eef0f3;
  cursor: pointer;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.brand-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1d23;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-section-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 14px 16px 6px;
}

.sidebar-nav {
  padding: 0 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 4px;
}
.sidebar-item:hover {
  background: #f3f4f6;
}
.sidebar-item.active {
  background: #eff0fe;
}

.sidebar-item-info {
  flex: 1;
  min-width: 0;
}
.sidebar-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #1a1d23;
  display: block;
}
.sidebar-item-sub {
  font-size: 11px;
  color: #9ca3af;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.progress-bar-track {
  flex: 1;
  height: 4px;
  background: #e9ecef;
  border-radius: 99px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: #22c55e;
  border-radius: 99px;
}
.progress-label {
  font-size: 10px;
  color: #6b7280;
}

.avatar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}
.avatar-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #f472b6);
  border: 2px solid #fff;
  margin-left: -4px;
  display: inline-block;
}
.avatar-dot:first-child {
  margin-left: 0;
}
.avatar-more {
  font-size: 10px;
  color: #9ca3af;
  margin-left: 4px;
}

.btn-new-team {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 16px;
  padding: 7px 12px;
  background: none;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-new-team:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.sidebar-footer {
  margin-top: auto;
  padding: 14px 16px 0;
  border-top: 1px solid #eef0f3;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1d23, #374151);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-avatar.sm {
  width: 26px;
  height: 26px;
  font-size: 11px;
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1d23;
}
.user-email {
  font-size: 11px;
  color: #9ca3af;
}

/* ── MAIN AREA ────────────────────────────── */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── TOPNAV ───────────────────────────────── */
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #eef0f3;
  height: 52px;
  flex-shrink: 0;
}

.nav-tabs-custom {
  display: flex;
  gap: 2px;
}
.nav-tab {
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}
.nav-tab:hover {
  color: #1a1d23;
  background: #f3f4f6;
}
.nav-tab.active {
  color: #6366f1;
  font-weight: 600;
  background: #eff0fe;
}

.topnav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.icon-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}
.icon-btn.sm {
  padding: 3px 6px;
}

.btn-new-task {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: #1a1d23;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-new-task:hover {
  background: #374151;
}

.btn-invite {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-invite:hover {
  border-color: #6366f1;
  color: #6366f1;
}

/* ── CONTENT ROW ──────────────────────────── */
.content-row {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── CENTER CONTENT ───────────────────────── */
.center-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}
.content-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
.content-sub {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}
.badge-all {
  background: #1a1d23;
  color: #fff;
}
.badge-todo {
  background: #dbeafe;
  color: #2563eb;
}
.badge-inprocess {
  background: #fef3c7;
  color: #d97706;
}
.badge-submitted {
  background: #e9d5ff;
  color: #7c3aed;
}
.badge-approved {
  background: #d1fae5;
  color: #059669;
}
.badge-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.task-card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: box-shadow 0.15s;
}
.task-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
}

.task-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.task-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-task {
  background: #dbeafe;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 6px;
}
.priority-high {
  color: #ef4444 !important;
  background: #fee2e2 !important;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.task-body {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ── CALENDAR PANEL ───────────────────────── */
.calendar-panel {
  width: 300px;
  min-width: 300px;
  background: #fff;
  border-left: 1px solid #eef0f3;
  overflow-y: auto;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cal-month {
  font-size: 14px;
  font-weight: 700;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.cal-day-label {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  text-align: center;
  padding: 4px 0;
}
.cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.12s;
}
.cal-cell:hover:not(.empty) {
  background: #f3f4f6;
}
.cal-cell.today {
  background: #1a1d23;
  color: #fff;
  font-weight: 700;
}
.cal-cell.empty {
  pointer-events: none;
}

.cal-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  padding: 10px 12px;
  background: #f8f9fb;
  border-radius: 10px;
}
.time-value {
  font-weight: 600;
  color: #1a1d23;
}

.completion-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.completion-title {
  font-size: 14px;
  font-weight: 700;
}

.completion-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f8f9fb;
  border-radius: 10px;
}
.completion-label {
  font-size: 12px;
  color: #6b7280;
}
.completion-count {
  font-size: 13px;
  font-weight: 700;
}

.donut {
  width: 48px;
  height: 48px;
}
.donut svg {
  width: 100%;
  height: 100%;
}

.mini-stat {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 8px 10px;
}
.mini-label {
  font-size: 11px;
  color: #6b7280;
  display: block;
  margin-bottom: 4px;
}
.mini-bar {
  height: 4px;
  border-radius: 99px;
  background: #e9ecef;
  margin-bottom: 4px;
  position: relative;
  overflow: hidden;
}
.mini-bar.approved::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 40%;
  background: #22c55e;
  border-radius: 99px;
}
.mini-bar.rejected::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 15%;
  background: #ef4444;
  border-radius: 99px;
}
.mini-pct {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
}
</style>
