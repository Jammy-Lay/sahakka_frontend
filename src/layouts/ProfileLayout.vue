<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      width="260"
      content-style="display: flex; flex-direction: column; height: 100%;"
    >
      <!-- TOP SECTION -->
      <div style="flex: 1">
        <!-- LOGO / HOME / BRAND -->
        <div class="sidebar-top">
          <div class="sidebar-home d-flex items-center gap-2 me-10 mb-3" @click="goHome">
            <House size="16" />
            Home
          </div>

          <div class="sidebar-brand" @click="goHome" style="cursor: pointer">Sahakka</div>
        </div>

        <!-- NAV -->
        <nav class="sidebar-nav">
          <router-link
            to="/settings/profile"
            class="nav-item"
            active-class="nav-item--active"
          >
            <User size="14" />
            Profile
          </router-link>

          <router-link
            to="/settings/password"
            class="nav-item"
            active-class="nav-item--active"
          >
            <Lock size="14" />
            Password
          </router-link>

          <router-link
            to="/settings/support"
            class="nav-item"
            active-class="nav-item--active"
          >
            <HelpCircle size="14" />
            Support
          </router-link>
        </nav>
      </div>

      <!-- FOOTER (fixed bottom) -->
      <div class="sidebar-footer">
        <img :src="profileStore.user?.avatar" class="footer-avatar" />

        <div class="footer-info">
          <span class="footer-name">
            {{ profileStore.user?.name }}
          </span>

          <span class="footer-email">
            {{ profileStore.user?.email }}
          </span>
        </div>
      </div>
    </n-layout-sider>

    <!-- MAIN -->
    <n-layout-content style="height: 100vh; overflow-y: auto">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProfileStore } from "@/stores/profile/profile";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useTeamStore } from "@/stores/user/team";

const profileStore = useProfileStore();
const workspaceStore = UseWorkspaceStore();
const teamStore = useTeamStore();
const router = useRouter();
const lastVisited = ref(null);

async function goHome() {
  if (!lastVisited.value) {
    router.push("/no-workspace");
    return;
  }

  const { workspace_id, team_id } = lastVisited.value;

  // validate workspace
  await workspaceStore.getMyWorkspaceStore();
  const validWorkspace = workspaceStore.getAllWorkspace.find(
    (w) => String(w.workspace_id) === String(workspace_id)
  );

  if (!validWorkspace) {
    const firstWs = workspaceStore.getAllWorkspace[0];
    if (!firstWs) {
      router.push("/no-workspace");
      return;
    }
    await teamStore.getTeamByWorkspaceStore(firstWs.workspace_id);
    const firstTeam = teamStore.getTeamByWorkspace[0];
    if (!firstTeam) {
      router.push("/no-workspace");
      return;
    }
    router.push(`/workspace/${firstWs.workspace_id}/team/${firstTeam.team_id}/tasks`);
    return;
  }

  // validate team
  await teamStore.getTeamByWorkspaceStore(workspace_id);
  const teams = teamStore.getTeamByWorkspace;
  const validTeam = teams?.find((t) => String(t.team_id) === String(team_id));

  if (!validTeam) {
    if (teams && teams.length > 0) {
      router.push(`/workspace/${workspace_id}/team/${teams[0].team_id}/tasks`);
      return;
    }
    const firstWs = workspaceStore.getAllWorkspace[0];
    if (!firstWs) {
      router.push("/no-workspace");
      return;
    }
    await teamStore.getTeamByWorkspaceStore(firstWs.workspace_id);
    const firstTeam = teamStore.getTeamByWorkspace[0];
    if (!firstTeam) {
      router.push("/no-workspace");
      return;
    }
    router.push(`/workspace/${firstWs.workspace_id}/team/${firstTeam.team_id}/tasks`);
    return;
  }

  router.push(`/workspace/${workspace_id}/team/${team_id}/tasks`);
}

onMounted(async () => {
  await profileStore.getProfile();

    const userId = profileStore.user?.user_id;
    if (userId) {
      const raw = localStorage.getItem(`lastVisited_${userId}`);
      if (raw) {
        try {
          lastVisited.value = JSON.parse(raw);
        } catch (err) {
          console.error("Failed to parse lastVisited:", err);
        }
      }
    }
});
</script>
<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Sidebar ── */
.sidebar {
  width: 190px;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: sticky;
  top: 0;
}

/* ── Main ── */
.main {
  flex: 1;
  padding: 32px 28px;
  height: 100%;
  overflow-y: auto;
}

.sidebar-top {
  flex: 1;
  padding: 22px 0 12px;
}

.sidebar-home {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #8a8fa8;
  padding: 0 18px 4px;
  cursor: pointer;
}

.sidebar-brand {
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -1px;
  color: #1a1a2e;
  padding: 0 15px 8px;
  line-height: 1.1;
}

/* Nav items */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #5c6070;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}

.nav-item:hover {
  background: #f0f2f5;
  color: #1a1a2e;
}

.nav-item--active {
  background: #1a1a2e !important;
  color: #fff !important;
  font-weight: 600;
}

/* Sidebar footer */
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 12px;
  border-top: 1px solid #e8eaf0;
}

.footer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.footer-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.footer-name {
  font-size: 12px;
  font-weight: 700;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-email {
  font-size: 10px;
  color: #aab0c4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.n-layout-sider .sidebar-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-nav {
  flex: 1;
}

.sidebar-footer {
  margin-top: auto;
}
</style>
