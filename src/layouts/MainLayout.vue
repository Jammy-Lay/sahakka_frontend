<template>
  <div class="app-wrapper bg-body">
    <header class="navbar" :style="{ borderBottomColor: activeBorderColor }">
      <div
        class="navbar-left d-flex align-items-center justify-content-between ps-3 bg-accent"
      >
        <WorkspaceList @close-sidebar="leftOpen = false" />
        <button
          class="border-0 bg-dark text-white h-100 d-flex align-items-center px-2"
          @click="leftOpen = !leftOpen"
        >
          <panel-right-open size="18" v-if="leftOpen" />
          <panel-right-close size="18" v-else />
        </button>
      </div>
      <div class="navbar-center d-flex align-items-center">
        <TeamSectionTabs />
      </div>
    </header>

    <div class="app-body">
      <aside
        class="sidebar-left d-flex flex-column bg-accent"
        :class="{ closed: !leftOpen }"
      >
        <div class="sidebar-content">
          <TeamList />
        </div>
        <FooterSidebarSkeleton v-if="authStore.loading" />
        <div class="sidebar-footer d-flex align-items-center gap-2 p-2" v-else>
          <img
            :src="getMe.avatar"
            style="width: 32px; height: 32px"
            class="rounded-circle object-fit-cover flex-shrink-0"
          />
          <div class="d-flex flex-column overflow-hidden">
            <span class="fw-semibold fs-13">{{ getMe.name }}</span>
            <span class="text-muted fs-11">{{ getMe.email }}</span>
          </div>
        </div>
      </aside>

      <main class="main-content pb-3 px-4">
        <router-view />
      </main>
      <aside class="sidebar-right d-none d-lg-block" v-if="showCalendar"><Calendar /></aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import WorkspaceList from "@/components/layouts/WorkspaceList.vue";
import TeamSectionTabs from "@/components/layouts/TeamSectionTabs.vue";
import TeamList from "@/components/layouts/TeamList.vue";
import Calendar from "@/components/layouts/Calendar.vue";
import FooterSidebarSkeleton from "@/components/team/FooterSidebarSkeleton.vue";

const route = useRoute();
const leftOpen = ref(true);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

const workspaceStore = UseWorkspaceStore();
const { currentWorkspaceId } = storeToRefs(workspaceStore);

const activeBorderColor = computed(() => {
  const section = route.params.section ?? route.path.split("/").pop();
  const map = {
    tasks: "#0088ff",
    issues: "#ff383c",
    documents: "#00C3D0",
    activity: "#6155F5",
  };
  return map[section?.toLowerCase()] ?? "#0088ff";
});

onMounted(async () => {
  await authStore.getMeStore();

  watch(
    () => route.params,
    ({ workspace_id, team_id }) => {
      if (workspace_id) {
        workspaceStore.setLastVisitedTeam(workspace_id, team_id, getMe.value?.user_id);
        currentWorkspaceId.value = workspace_id;
      }
    },
    { immediate: true, deep: true }
  );
});

const showCalendar = computed(() => {
  return route.name !== "viewMember";
});
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.navbar {
  display: flex;
  align-items: stretch;
  height: 35px;
  border-bottom: 1.6px solid #0088ff;
  padding: 0;
  margin: 0;
}
.navbar-left {
  width: 300px;
  height: 100%;
}
.navbar-center {
  flex: 1;
  height: 100%;
  padding: 0;
  margin: 0;
}
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.sidebar-left {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid #e4e4e7;
  overflow-x: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.sidebar-left.closed {
  width: 0;
  opacity: 0;
  border-right: none;
}
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar-footer {
  border-top: 1px solid #e4e4e7;
  flex-shrink: 0;
  white-space: nowrap;
  overflow-x: hidden;
}
.main-content {
  flex: 1;
  overflow-y: auto;
}
.main-content::-webkit-scrollbar {
  appearance: none;
  display: none;
}
.sidebar-right {
  width: 400px;
  flex-shrink: 0;
  overflow-y: auto;
}
.sidebar-right::-webkit-scrollbar {
  appearance: none;
  display: none;
}
</style>
