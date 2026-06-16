<template>
  <div>
    <n-popover trigger="click" placement="bottom-start" :show-arrow="false" v-model:show="showPopover"
      style="padding: 0; border-radius: 16px; width: 267px; margin-top: 12px">
      <template #trigger>
        <div class="workspace-trigger d-flex align-items-center gap-2"  @click="showPopover = !showPopover">
          <img :src="currentWorkspace?.creator?.avatar" alt="" style="width: 25px; height: 25px"
            class="rounded-circle object-fit-cover" />
          <span class="fs-13 fw-bold">
            <n-ellipsis style="max-width: 150px" :tooltip="false">
              {{ currentWorkspace?.workspace_name ?? "My Workspace" }}
            </n-ellipsis>
          </span>
          <chevron-down size="16" />
        </div>
      </template>

      <div class="p-2">
        <div class="rounded-btn p-2 border border-2 mb-2" style="background-color: #fcfcfc">
          <div class="d-flex align-items-center gap-2 mb-3">
            <img :src="getMe.avatar" style="width: 32px; height: 32px"
              class="rounded-circle object-fit-cover flex-shrink-0" />
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
          <n-popover trigger="click" placement="right" :show-arrow="false"
            style="border-radius: 12px; width: 210px; padding: 0; margin-left: 18px;">
            <template #trigger>
              <button class="btn rounded-btn-sm fs-12 btn-outline px-2 border text-nowrap">
                <plus size="13" /> New
              </button>
            </template>
            <div style="padding: 10px">
              <h6 class="fw-semibold fs-13 ps-1">Workspace name</h6>
              <BaseInput v-model="newWorkspaceName" input-placeholder="Name"
                input-class="py-1 fs-13 rounded-btn-sm my-2" />
              <!-- Create Workspace -->

              <BaseBtn btnName="Create workspace" class="w-100 fs-13 rounded-btn-sm py-1" :loading="isLoading"
                @click="handleCreateWorkspace" />
            </div>
          </n-popover>
        </div>

        <div v-for="ws in myWorkspaces" :key="ws.workspace_id" @click="switchWorkspace(ws.workspace_id)" :class="[
          'd-flex align-items-center justify-content-between text-dark px-2 py-1 mb-1 rounded workspace-item',
          { 'workspace-item--active': openOptionId === ws.workspace_id },
        ]">
          <div class="d-flex align-items-center gap-2">
            <img :src="ws.creator?.avatar" style="width: 22px; height: 22px" class="rounded-circle object-fit-cover" />
            <span class="fs-13">
              <n-ellipsis style="max-width: 160px" :tooltip="{
                style: { fontSize: '11px', padding: '4px 8px', borderRadius: '8px' },
              }">
                {{ ws.workspace_name }}
              </n-ellipsis>
            </span>
          </div>
          <n-popover trigger="click" placement="right" :show-arrow="false"
            @update:show="(val) => (openOptionId = val ? ws.workspace_id : null)"
            style="border-radius: 12px; width: 105px; padding: 0; margin-left: 18px">
            <template #trigger>
              <n-button text size="small" :class="[
                'btn-option rounded-circle text-dark p-1',
                { 'btn-option--active': openOptionId === ws.workspace_id },
              ]" @click.stop>
                <more-horizontal size="14" />
              </n-button>
            </template>
            <div class="p-1 fs-13">
              <div class="d-flex align-items-center rounded gap-2 px-2 py-1 fw-bold workspace-item" @click="
                selectedWs = ws;
              renameName = ws.workspace_name;
              showRenameModal = true;
              ">
                <Pencil size="13" /> Rename
              </div>
              <div class="d-flex align-items-center rounded gap-2 px-2 py-1 text-danger fw-bold workspace-item" @click="
                selectedWs = ws;
              showDeleteModal = true;
              ">
                <Trash2 size="13" /> Delete
              </div>
            </div>
          </n-popover>
        </div>

        <n-divider style="margin: 10px 0; --n-color: #e4e4e7" />

        <!-- INVITED WORKSPACE -->
        <div class="d-flex align-items-center justify-content-between px-2 py-1 mb-2">
          <span class="fs-12 fw-semibold">Invited Workspace</span>
          <n-popover trigger="click" placement="right" :show-arrow="false" v-model:show="showJoinPopover"
            style="border-radius: 12px; width: 380px; padding: 0; margin-left: 18px">
            <template #trigger>
              <button class="btn rounded-btn-sm fs-12 btn-outline px-2 border text-nowrap">
                <plus size="13" /> Join
              </button>
            </template>

            <div class="d-flex align-items-center justify-content-between" style="padding: 0 10px; padding-top: 10px">
              <span class="fw-bold fs-15 ps-1">Join with code or token</span>
              <n-button text size="small" @click="showJoinPopover = false"
                class="text-dark hover-circle p-2 rounded-circle">
                <x size="16" />
              </n-button>
            </div>

            <n-divider style="margin: 5px 0; --n-color: #ebebeb" />

            <div style="padding: 10px">
              <div class="p-2 rounded-btn bg-accent border border-1">
                <p class="fs-13 mb-2 ps-1 text-dark">Code or token</p>
                <BaseInput v-model="joinCode" input-placeholder="XXXXXXXX"
                  input-class="fs-14 bg-white mb-2 py-2 rounded-btn-sm" />
                <!-- Join Workspace -->
                <BaseButton btnName="Join" class="w-100 fs-14 py-2 rounded-btn-sm" @click="handleJoin" />
              </div>
            </div>
          </n-popover>
        </div>

        <n-empty description="No Data" v-if="joinedWorkspaces.length === 0" class="my-2"
          style="--n-icon-size: 25px; font-size: 10px" />

        <n-scrollbar style="max-height: 132px" v-else>
          <div v-for="ws in joinedWorkspaces" :key="ws.workspace_id" @click="switchWorkspace(ws.workspace_id)" :class="[
            'd-flex align-items-center justify-content-between text-dark px-2 py-1 mb-1 rounded workspace-item',
            { 'workspace-item--active': openOptionId === ws.workspace_id },
          ]">
            <div class="d-flex align-items-center gap-2">
              <img :src="ws.creator?.avatar" style="width: 22px; height: 22px"
                class="rounded-circle object-fit-cover" />
              <span class="fs-13">
                <n-ellipsis style="max-width: 160px" :tooltip="{
                  style: { fontSize: '11px !important', padding: '5px 14px !important', borderRadius: '8px !important' },
                }">
                  {{ ws.workspace_name }}
                </n-ellipsis>
              </span>
            </div>
            <n-popover trigger="click" placement="right" :show-arrow="false"
              @update:show="(val) => (openOptionId = val ? ws.workspace_id : null)"
              style="border-radius: 8px; width: 90px; padding: 0; margin-left: 18px">
              <template #trigger>
                <n-button text size="small" :class="[
                  'btn-option rounded-circle text-dark p-1',
                  { 'btn-option--active': openOptionId === ws.workspace_id },
                ]" @click.stop>
                  <more-horizontal size="14" />
                </n-button>
              </template>
              <div class="p-1 fs-13">
                <!-- Leave Workspace (Don't do that)  -->
                <div class="d-flex align-items-center text-danger rounded gap-2 px-2 py-1 fw-bold workspace-item"
                  @click="handleLeave(ws)">
                  <Log-out size="15" /> Leave
                </div>
              </div>
            </n-popover>
          </div>
        </n-scrollbar>

        <n-divider style="margin: 6px 0; --n-color: #e4e4e7" />

        <div class="d-flex align-items-center gap-2 px-2 py-1 rounded mb-1 mt-2 workspace-item">
          <users size="15" />
          <span style="font-size: 13px">Members</span>
        </div>
        <n-popover trigger="click" placement="right" :show-arrow="false" v-model:show="showInvitePopover"
          style="border-radius: 12px; width: 400px; padding: 0; margin-left: 11px">
          <template #trigger>
            <div class="d-flex align-items-center justify-content-between px-2 py-1 rounded workspace-item">
              <div class="d-flex align-items-center gap-2">
                <mail size="15" />
                <span class="f-13">Invite people</span>
              </div>
              <chevron-right size="14" />
            </div>
          </template>

          <div class="d-flex align-items-center justify-content-between" style="padding: 0 10px; padding-top: 10px">
            <span class="fw-bold fs-15 ps-1 m-0">Invite people</span>
            <n-button text size="small" @click="showInvitePopover = false"
              class="text-dark hover-circle p-2 rounded-circle">
              <x size="16" />
            </n-button>
          </div>

          <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
          <div style="padding: 10px">
            <div class="d-flex gap-2">
              <div class="w-100">
                <BaseInput v-model="inviteEmail" input-placeholder="Email" input-class="fs-14 w-100 rounded-btn-sm" />
              </div>
              <div>
                <!-- Invite by email -->
                <BaseButton :btnName="isInviteLoading ? 'Inviting...' : 'Invite'"
                  class="fs-13 rounded-btn-sm fw-medium text-nowrap h-100" :disabled="isInviteLoading"
                  @click="handleInvite" />
              </div>
            </div>

            <div class="rounded-btn mt-3 bg-accent" style="padding: 10px">
              <p class="fs-13 fw-semibold mb-2 ps-1">Passcode</p>
              <div class="row my-2 pe-4 g-0 gx-2">
                <div class="col-10">
                  <BaseInput v-model="passcode" input-placeholder="XXXXXXXX" isDisabled
                    input-class="fs-14 bg-white rounded-btn-sm" />
                </div>
                <div class="col-1">
                  <button
                    class="btn btn-outline border rounded-btn py-2 h-100 fs-13 fw-semibold text-nowrap d-flex align-items-center gap-1"
                    @click="handleCopy">
                    <copy size="13" /> Copy
                  </button>
                </div>
              </div>
              <!-- Generate Token  -->
              <BaseButton btnName="Generate passcode" class="w-100 fs-14 rounded-btn-sm py-2" @click="handleGenerate" />
            </div>
          </div>
        </n-popover>

        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />

        <!-- logout -->
        <button @click="showLogoutModal = true"
          class="btn bg-danger text-white rounded-btn w-100 fs-14 mt-2 text-nowrap">
          <Log-out size="18" /> Log out
        </button>
      </div>
    </n-popover>
    <!-- Rename Modal -->
    <n-modal v-model:show="showRenameModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 400px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Rename Workspace</span>
          <n-button text size="small" @click="showRenameModal = false"
            class="hover-circle p-1 rounded-circle">
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-2 pb-3">
          <label class="mb-2 fs-12 fw-medium d-block">Workspace Name</label>
          <BaseInput v-model="renameName" input-placeholder="New name" input-class="py-1 fs-13 rounded-btn-sm mb-4" />
          <BaseBtn btnName="Save" class="w-100 fs-13 rounded-btn py-2" @click="handleRename" />
        </div>
      </div>
    </n-modal>

    <!-- Delete Modal -->
    <n-modal v-model:show="showDeleteModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 380px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Delete Workspace</span>
          <n-button text size="small" @click="showDeleteModal = false"
            class="hover-circle p-1 rounded-circle">
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-3 pb-3">
          <p class="fs-13 text-mute mb-4 text-center">
            Are you sure you want to delete
            <span class="fw-semibold text-dark">{{ selectedWs?.name }}</span> ?
          </p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50" @click="showDeleteModal = false">
              Cancel
            </button>
            <button class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50" @click="handleDelete">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? "Loading..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </n-modal>

    <n-modal v-model:show="showLogoutModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 380px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Log Out</span>
          <n-button text size="small" @click="showLogoutModal = false"
            class="hover-circle p-1 rounded-circle">
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-3 pb-3">
          <p class="fs-13 text-mute mb-4 text-center">
            Are you sure you want to log out?
          </p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50" @click="showLogoutModal = false">
              Cancel
            </button>
            <button class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50" @click="handleLogout">
              Log out
            </button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted ,computed} from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { useTeamStore } from "@/stores/user/team"
import { useInviteStore } from "@/stores/user/invite";;
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";

const route = useRoute();
const router = useRouter();
const inviteStore = useInviteStore();

const currentRouteWorkspaceId = computed(() => route.params.workspace_id);
const currentRouteTeamId = computed(() => route.params.team_id);
// const currentSection = computed(() => route.path.split("/").pop()?.toLowerCase());

const showPopover = ref(false);
const showRenameModal = ref(false);
const showDeleteModal = ref(false);
const showJoinPopover = ref(false);
const showInvitePopover = ref(false);
const isInviteLoading = ref(false);
const isGenerateLoading = ref(false);

const openOptionId = ref(null);
const showLogoutModal = ref(false);

const renameName = ref("");
const selectedWs = ref(null);
const newWorkspaceName = ref("");
const joinCode = ref("");
const inviteEmail = ref("");
const passcode = ref("");

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

const workspaceStore = UseWorkspaceStore();
const {
  myWorkspaces,
  joinedWorkspaces,
  currentWorkspace,
  currentWorkspaceId,
} = storeToRefs(workspaceStore);

const teamStore = useTeamStore();
const { getTeamByWorkspace } = storeToRefs(teamStore);

// =======================================================by sothatt

import { notify } from "@/utils/toast";
import { useCrudWorkspaceStore } from "@/stores/workspaces/workspaces";
import BaseBtn from "../BaseBtn.vue";
const toast = notify(router);

const crudWorkspaceStore = useCrudWorkspaceStore();
// const newWorkspaceName = ref("");

let isLoading = ref(false);

const maxWorkspace = myWorkspaces.value;

// ==========================end
const reuseonMount = async () => {
  await authStore.getMeStore();
  await workspaceStore.getMyWorkspaceStore();
};

onMounted(async () => {
  reuseonMount();
});

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

// ==============================handle create workspace
const handleCreateWorkspace = async () => {
  const name = newWorkspaceName.value.trim();
  if (!name) {
    toast.error("Workspace name is required");
    return;
  }
  if (name.length < 3) {
    toast.error("Workspace name must be at least 3 characters");
    return;
  }
  if (maxWorkspace.length >= 5) {
    toast.error(" Maximum 5 workspaces allowed");
    return;
  }

  try {
    isLoading.value = true;
    const res = await crudWorkspaceStore.createWorkspace(name);
    newWorkspaceName.value = "";

    toast.success("Workspace created successfully");
    reuseonMount();
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

// ==============================================handle Rename workspace

const handleRename = async () => {
  let reName = renameName.value.trim();

  if (!reName) {
    toast.error("Workspace name is required");
    return;
  }

  if (reName.length < 3) {
    toast.error("Workspace name must be at least 3 characters");
    return;
  }

  try {
    await crudWorkspaceStore.updateWorkspace(selectedWs.value.workspace_id, reName);

    toast.success("Workspace updated successfully");

    showRenameModal.value = false;
    renameName.value = "";
    selectedWs.value = null;

    await reuseonMount();
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
    reName = "";
  }
};

// ================================================handle delete workspace
const deleteErr = ref("");
const handleDelete = async () => {
  if (myWorkspaces.value.length == 1) {
    deleteErr.value = "Cannot delete the last workspace";
    toast.error("Cannot delete the last workspace");
    return;
  }
  try {
    isLoading.value = true;
    await crudWorkspaceStore.deleteWorkspace(selectedWs.value.workspace_id);

    toast.success("Workspace deleted successfully");

    showDeleteModal.value = false;
    selectedWs.value = null;

    await reuseonMount();
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleLeave = (ws) => {
  console.log("leave", ws);
};

// ==================================================handlejoin
const joinErr = ref("");
const handleJoin = async () => {
  const token = joinCode.value.trim();
  console.log(token);

  if (!token) {
    joinErr.value = "Token is required";
    toast.error("Token is required");
    return;
  }

  try {
    joinErr.value = "";

    await crudWorkspaceStore.joinByToken(token);

    toast.success("Joined workspace successfully");

    joinCode.value = "";
    showJoinPopover.value = false;

    await reuseonMount();
  } catch (error) {
    joinErr.value = error.message;
    toast.error(error.message);
  } finally {
  }
};

const handleInvite = async () => {
  if (!inviteEmail.value.trim()) return;

  isInviteLoading.value = true;
  try {
    await inviteStore.inviteByEmail(
      currentRouteWorkspaceId.value,
      currentRouteTeamId.value,
      inviteEmail.value
    );

    inviteEmail.value = "";
    showInvitePopover.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isInviteLoading.value = false;
  }
};
const handleGenerate = async () => {
  isGenerateLoading.value = true;
  try {
    const res = await inviteStore.generatePasscode(
      currentRouteWorkspaceId.value,
      currentRouteTeamId.value
    );

    passcode.value = res.data.token;
  } catch (error) {
    console.error(error);
  } finally {
    isGenerateLoading.value = false;
  }
};

const handleCopy = async () => {
  await navigator.clipboard.writeText(passcode.value);
};
const handleLogout = () => {
  localStorage.removeItem("lastVisitedTeam");
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<style scoped>
.btn-option {
  background-color: transparent !important;
}

.btn-option:hover {
  background-color: #e4e4e7 !important;
}

.btn-option--active {
  background: #e4e4e7 !important;
}

/* #F2F2F3 */

:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical) {
  right: -2px !important;
  height: 123px !important;
  top: 2px !important;
}

:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical .n-scrollbar-rail__scrollbar) {
  width: 4px !important;
}
</style>
