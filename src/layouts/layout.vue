<template>
  <div class="app-wrapper">
    <!-- NAVBAR -->
    <header class="navbar" :style="{ borderBottomColor: activeBorderColor }">
      <!-- LEFT -->
      <div
        class="navbar-left d-flex align-items-center justify-content-between ps-3 bg-accent"
      >
        <n-popover
          trigger="click"
          placement="bottom-start"
          :show-arrow="false"
          v-model:show="showPopover"
          style="padding: 0; border-radius: 16px; width: 267px; margin-top: 12px"
        >
          <template #trigger>
            <div class="workspace-trigger d-flex align-items-center gap-2">
              <img
                src="https://i.pinimg.com/control1/1200x/80/41/85/804185369bb31d52a4c279c6202fca14.jpg"
                alt=""
                style="width: 25px; height: 25px"
                class="rounded-circle object-fit-cover"
              />
              <span class="fs-13 fw-bold">
                <n-ellipsis style="max-width: 150px" :tooltip="false">
                  {{ currentWorkspace?.workspace_name ?? "My Workspace" }}
                </n-ellipsis>
              </span>
              <chevron-down size="16" />
            </div>
          </template>

          <!-- POPUP CONTENT -->
          <div class="p-2">
            <!-- PROFILE HEADER -->
            <div
              class="rounded-btn p-2 border border-2 mb-2"
              style="background-color: #fcfcfc"
            >
              <div class="d-flex align-items-center gap-2 mb-3">
                <img
                  :src="getMe.avatar"
                  style="width: 32px; height: 32px"
                  class="rounded-circle object-fit-cover flex-shrink-0"
                />
                <div class="overflow-hidden">
                  <div class="fw-bold fs-13">{{ getMe.name }}</div>
                  <div class="text-mute fs-11">{{ getMe.email }}</div>
                </div>
              </div>
              <BaseButton class="fs-11 rounded-btn-sm" btnName="View Profile" />
            </div>

            <!-- MY WORKSPACE -->
            <div class="d-flex align-items-center justify-content-between px-2 py-1 mb-2">
              <span class="fs-13 fw-semibold">My Workspace</span>
              <n-popover
                trigger="click"
                placement="right"
                :show-arrow="false"
                style="border-radius: 12px; width: 210px; padding: 0; margin-left: 18px"
              >
                <template #trigger>
                  <button
                    class="btn rounded-btn-sm fs-12 btn-outline px-2 border text-nowrap"
                  >
                    <plus size="13" /> New
                  </button>
                </template>

                <div style="padding: 10px">
                  <h6 class="fw-semibold fs-13 ps-1">Workspace name</h6>
                  <BaseInput input-placeholder="Name" input-class="py-1 fs-14 rounded-btn-sm my-2" /> 
                  <BaseButton
                    btnName="Create workspace"
                    class="w-100 fs-13 rounded-btn-sm"
                  />
                </div>
              </n-popover>
            </div>

            <div
              v-for="ws in myWorkspaces"
              :key="ws.workspace_id"
              @click="switchWorkspace(ws.workspace_id)"
              :class="[
                'd-flex align-items-center justify-content-between text-dark px-2 py-1 mb-1 rounded workspace-item',
                { 'workspace-item--active': openOptionId === ws.workspace_id },
              ]"
            >
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="ws.creator?.avatar"
                  style="width: 22px; height: 22px"
                  class="rounded-circle object-fit-cover"
                />
                <span class="fs-13">
                  <n-ellipsis
                    style="max-width: 160px"
                    :tooltip="{
                      style: {
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '8px',
                      },
                    }"
                  >
                    {{ ws.workspace_name }}
                  </n-ellipsis>
                </span>
              </div>
              <n-popover
                trigger="click"
                placement="right"
                :show-arrow="false"
                @update:show="(val) => (openOptionId = val ? ws.workspace_id : null)"
                style="border-radius: 12px; width: 105px; padding: 0; margin-left: 18px"
              >
                <template #trigger>
                  <n-button
                    text
                    size="small"
                    :class="[
                      'btn-option rounded-circle text-dark p-1',
                      { 'btn-option--active': openOptionId === ws.workspace_id },
                    ]"
                    @click.stop
                  >
                    <more-horizontal size="14" />
                  </n-button>
                </template>

                <div class="p-1 fs-13">
                  <div
                    class="d-flex align-items-center rounded gap-2 px-2 py-1 fw-bold workspace-item"
                    @click="handleRename(ws)"
                  >
                    <Pencil size="13" />
                    Rename
                  </div>

                  <div
                    class="d-flex align-items-center rounded gap-2 px-2 py-1 text-danger fw-bold workspace-item"
                    @click="handleDelete(ws)"
                  >
                    <Trash2 size="13" />
                    Delete
                  </div>
                </div>
              </n-popover>
            </div>

            <n-divider style="margin: 10px 0" />

            <!-- INVITED WORKSPACE -->
            <div class="d-flex align-items-center justify-content-between px-2 py-1 mb-2">
              <span class="fs-12 fw-semibold">Invited Workspace</span>
              <button
                class="btn rounded-btn-sm fs-12 btn-outline px-2 border text-nowrap"
              >
                <plus size="13" /> Join
              </button>
            </div>

            <n-empty
              description="No Data"
              v-if="joinedWorkspaces.length === 0"
              class="my-2"
              style="--n-icon-size: 25px; font-size: 10px"
            />

            <n-scrollbar style="max-height: 132px" v-else>
              <div
                v-for="ws in joinedWorkspaces"
                :key="ws.workspace_id"
                @click="switchWorkspace(ws.workspace_id)"
                :class="[
                  'd-flex align-items-center justify-content-between text-dark px-2 py-1 mb-1 rounded workspace-item',
                  { 'workspace-item--active': openOptionId === ws.workspace_id },
                ]"
              >
                <div class="d-flex align-items-center gap-2">
                  <img
                    :src="ws.creator?.avatar"
                    style="width: 22px; height: 22px"
                    class="rounded-circle object-fit-cover"
                  />
                  <span class="fs-13">
                    <n-ellipsis
                      style="max-width: 160px"
                      :tooltip="{
                        style: {
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '8px',
                        },
                      }"
                    >
                      {{ ws.workspace_name }}
                    </n-ellipsis>
                  </span>
                </div>
                <n-popover
                  trigger="click"
                  placement="right"
                  :show-arrow="false"
                  @update:show="(val) => (openOptionId = val ? ws.workspace_id : null)"
                  style="border-radius: 8px; width: 90px; padding: 0; margin-left: 18px"
                >
                  <template #trigger>
                    <n-button
                      text
                      size="small"
                      :class="[
                        'btn-option rounded-circle text-dark p-1',
                        { 'btn-option--active': openOptionId === ws.workspace_id },
                      ]"
                      @click.stop
                    >
                      <more-horizontal size="14" />
                    </n-button>
                  </template>

                  <div class="p-1 fs-13">
                    <div
                      class="d-flex align-items-center text-danger rounded gap-2 px-2 py-1 fw-bold workspace-item"
                      @click="handleRename(ws)"
                    >
                      <Log-out size="15" />
                      Leave
                    </div>
                  </div>
                </n-popover>
              </div>
            </n-scrollbar>

            <n-divider style="margin: 6px 0" />

            <!-- MEMBERS & INVITE -->
            <div
              class="d-flex align-items-center gap-2 px-2 py-1 rounded mb-1 mt-2 workspace-item"
            >
              <users size="15" />
              <span style="font-size: 13px">Members</span>
            </div>
            <div
              class="d-flex align-items-center justify-content-between px-2 py-1 rounded workspace-item"
            >
              <div class="d-flex align-items-center gap-2">
                <mail size="15" />
                <span style="font-size: 13px">Invite people</span>
              </div>
              <chevron-right size="14" />
            </div>

            <n-divider style="margin: 10px 0" />

            <!-- LOGOUT -->
            <button
              @click="handleLogout"
              class="btn bg-danger text-white rounded-btn w-100 fs-14 mt-2 text-nowrap"
            >
              <Log-out size="18" />
              Log out
            </button>
          </div>
        </n-popover>

        <button
          class="border-0 bg-dark text-white h-100 d-flex align-items-center px-2"
          @click="leftOpen = !leftOpen"
        >
          <panel-right-open size="18" v-if="leftOpen" />
          <panel-right-close size="18" v-else />
        </button>
      </div>

      <!-- CENTER -->
      <div class="navbar-center d-flex align-items-center">
        <router-link
          v-for="(section, index) in getTeamSection"
          :key="section.id"
          :to="`/workspace/${currentRouteWorkspaceId}/team/${currentRouteTeamId}/${section.name.toLowerCase()}`"
          :class="[
            'team-section text-decoration-none text-mute fs-15 d-flex justify-content-center align-items-center',
            getSectionClass(section.name),
          ]"
          :style="{
            borderRightColor: getBorderColor(index),
          }"
          active-class="active-section"
        >
          {{ section.name }}
        </router-link>

        <n-dropdown trigger="click" :options="inviteOptions">
          <div
            class="team-section d-flex justify-content-center align-items-center gap-2 cursor-pointer fw-bold"
          >
            <Mail size="14" />
            <span class="fs-14">Invite</span>
          </div>
        </n-dropdown>
      </div>
    </header>

    <!-- BODY -->
    <div class="app-body">
      <!-- LEFT SIDEBAR -->
      <aside
        class="sidebar-left d-flex flex-column bg-accent"
        :class="{ closed: !leftOpen }"
      >
        <div class="sidebar-content">
          <div class="px-3">
            <div class="d-flex align-items-center justify-content-between py-3">
              <h6 class="fs-13 mb-0">Team</h6>
              <button class="btn px-2 py-1 rounded-btn text-nowrap fs-12 btn-ghost">
                <Plus size="15" class="me-1" /> New Team
              </button>
            </div>
            <n-scrollbar style="max-height: 635px">
              <div class="d-flex flex-column gap-2">
                <router-link
                  v-for="t in teamList"
                  :key="t.team_id"
                  :to="`/workspace/${currentRouteWorkspaceId}/team/${t.team_id}/${currentSection}`"
                  class="text-decoration-none"
                >
                  <div
                    class="card py-2 px-3 rounded-btn text-nowrap"
                    :style="
                      String(t.team_id) === String(currentRouteTeamId)
                        ? {
                            borderColor: activeBorderColor,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                          }
                        : {
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'transparent',
                          }
                    "
                  >
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <div>
                        <h6 class="mb-1 fw-semibold">{{ t.title }}</h6>
                        <p class="mb-0 fs-11 text-mute">{{ t.description }}</p>
                      </div>
                      <chevron-right size="18" />
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <p class="mb-0 fs-12">60%</p>
                      <n-progress
                        type="line"
                        :percentage="60"
                        color="#34C759"
                        :height="5"
                        processing
                        :show-indicator="false"
                      />
                    </div>
                    <n-avatar-group :options="mapMembers(t.members)" :size="25" :max="4">
                      <template #avatar="{ option: { name, src } }">
                        <n-tooltip
                          :style="{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '8px',
                          }"
                        >
                          <template #trigger>
                            <n-avatar :src="src" />
                          </template>
                          {{ name }}
                        </n-tooltip>
                      </template>
                      <template #rest="{ options: restOptions, rest }">
                        <n-dropdown
                          :options="createDropdownOptions(restOptions)"
                          placement="top"
                          size="small"
                          :style="{ borderRadius: '12px' }"
                        >
                          <n-avatar class="fs-14 text-dark bg-mute">+{{ rest }}</n-avatar>
                        </n-dropdown>
                      </template>
                    </n-avatar-group>
                  </div>
                </router-link>
              </div>
            </n-scrollbar>
          </div>
        </div>
        <div class="sidebar-footer d-flex align-items-center gap-2 p-2">
          <img
            :src="getMe.avatar"
            alt=""
            style="width: 32px; height: 32px"
            class="rounded-circle object-fit-cover flex-shrink-0"
          />
          <div class="d-flex flex-column overflow-hidden">
            <span class="fw-semibold fs-13">{{ getMe.name }}</span>
            <span class="text-muted fs-11">{{ getMe.email }}</span>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content pt-5 ps-5"><router-view></router-view></main>

      <!-- RIGHT SIDEBAR -->
      <aside class="sidebar-right pt-5">Right Sidebar</aside>
    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted, computed, watch } from "vue";
import {
  ChevronDown,
  ChevronRight,
  PanelRightOpen,
  PanelRightClose,
  Mail,
  Users,
  Plus,
  MoreHorizontal,
  LogOut,
  FolderKanban,
  Settings,
} from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { useTeamStore } from "@/stores/user/team";
import { storeToRefs } from "pinia";
import BaseButton from "@/components/BaseButton.vue";
import { useAuthStore } from "@/stores/auth";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import BaseInput from "@/components/BaseInput.vue";

const route = useRoute();
const router = useRouter();

// reactive route params
const currentRouteWorkspaceId = computed(() => route.params.workspace_id);
const currentRouteTeamId = computed(() => route.params.team_id);

const leftOpen = ref(true);
const showPopover = ref(false);
const openOptionId = ref(null);

const teamStore = useTeamStore();
const { getTeamSection, getTeamByWorkspace } = storeToRefs(teamStore);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

const workspaceStore = UseWorkspaceStore();
const {
  myWorkspaces,
  joinedWorkspaces,
  getAllWorkspace,
  currentWorkspace,
  currentWorkspaceId,
} = storeToRefs(workspaceStore);

onMounted(async () => {
  await authStore.getMeStore();
  await workspaceStore.getMyWorkspaceStore();
  await teamStore.getTeamByWorkspaceStore(currentRouteWorkspaceId.value);
  await teamStore.getTeamSectionStore(currentRouteTeamId.value);
});

// watch route changes → save last visited team + sync workspace id
watch(
  () => route.params,
  async ({ workspace_id, team_id }) => {
    if (workspace_id && team_id) {
      // save to localStorage
      workspaceStore.setLastVisitedTeam(workspace_id, team_id);
      // sync current workspace name
      currentWorkspaceId.value = workspace_id;
      // reload sections when team changes
      await teamStore.getTeamSectionStore(team_id);
    }
    if (workspace_id && !team_id) {
      currentWorkspaceId.value = workspace_id;
    }
  },
  { immediate: true, deep: true }
);

// switch workspace → navigate to last visited team or first team
const switchWorkspace = async (id) => {
  currentWorkspaceId.value = id;
  await teamStore.getTeamByWorkspaceStore(id);

  const savedTeamId = workspaceStore.lastVisitedTeam[id];
  const targetTeamId = savedTeamId ?? getTeamByWorkspace.value?.[0]?.team_id;

  if (targetTeamId) {
    router.push(`/workspace/${id}/team/${targetTeamId}/tasks`);
    showPopover.value = false;
  }
};

// logout
const handleLogout = () => {
  localStorage.removeItem("lastVisitedTeam");
  authStore.logout(); // call your logout action
  router.push({ name: "login" });
};

function renderIcon(Icon) {
  return () => h(Icon, { size: 16 });
}

const teamList = computed(() => getTeamByWorkspace.value ?? []);

function mapMembers(members = []) {
  return members.map((m) => ({ name: m.name, src: m.avatar }));
}

function createDropdownOptions(options) {
  return options.map((option) => ({
    key: option.name,
    label: option.name,
    props: { style: "font-size: 11px;" },
  }));
}

function getSectionClass(name) {
  const map = {
    tasks: "section-task",
    issues: "section-issue",
    documents: "section-document",
    activity: "section-activity",
  };
  return map[name.toLowerCase()] ?? "";
}

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

const currentSection = computed(() => route.path.split("/").pop()?.toLowerCase());

function getBorderColor(index) {
  const activeIndex = getTeamSection.value.findIndex(
    (s) => s.name.toLowerCase() === currentSection.value
  );

  if (index === activeIndex || index === activeIndex - 1) {
    return activeBorderColor.value;
  }

  return "#ccc";
}

const inviteOptions = [
  { label: "Workspace 1", key: "workspace1", icon: renderIcon(FolderKanban) },
  { label: "Team Members", key: "members", icon: renderIcon(Users) },
  { label: "Settings", key: "settings", icon: renderIcon(Settings) },
];
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
.workspace-trigger {
  cursor: pointer;
  user-select: none;
}
.navbar-center {
  flex: 1;
  height: 100%;
  padding: 0;
  margin: 0;
}
.team-section {
  flex: 1;
  align-self: stretch;
  border-right: 1px solid;
  padding: 0;
  margin: 0;
}
.team-section {
  flex: 1;
  align-self: stretch;
  border-right: 1px solid #ccc;
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
  border-right: 1px solid #ccc;
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
  border-top: 1px solid #ccc;
  flex-shrink: 0;
  white-space: nowrap;
  overflow-x: hidden;
}
.main-content {
  flex: 1;
  overflow-y: auto;
}
.sidebar-right {
  width: 300px;
  flex-shrink: 0;
  border-left: 1px solid #ccc;
  overflow-y: auto;
}
.workspace-item:hover {
  background: #f5f5f5;
  cursor: pointer;
}

.workspace-item--active {
  background: #f5f5f5;
}

.btn-option:hover {
  background-color: #ccc !important;
}

.btn-option--active {
  background: #ccc !important;
}

.active-card {
  border: 1.6px solid transparent;
}

.section-task.active-section {
  color: #0088ff !important;
  background-color: #b2dbff !important;
}
.section-issue.active-section {
  color: #ff383c !important;
  background-color: #ffc3c4 !important;
}
.section-document.active-section {
  color: #00c3d0 !important;
  background-color: #b2ecf8 !important;
}
.section-activity.active-section {
  color: #6155f5 !important;
  background-color: #cfccfc !important;
}

:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical) {
  right: -2px !important;
  height: 123px !important;
  top: 2px !important;
}

:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical .n-scrollbar-rail__scrollbar) {
  width: 4px !important;
}
</style>
