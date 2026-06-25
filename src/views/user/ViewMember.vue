<template>
  <div>
    <div class="p-2 pt-3">
      <h4 class="fw-bold">Members</h4>
      <div class="d-flex align-items-center gap-3">
        <!-- Replace the h6 and keep filter button static -->
        <h6 class="text-mute">
          Manage members access :
          <span class="fw-semibold text-dark">
            {{ selectedTeamId === null ? "All Members" : selectedTeamLabel }}
          </span>
        </h6>

        <!-- Filter by Team -->
        <n-popover
          trigger="click"
          placement="bottom-end"
          :show-arrow="false"
          v-model:show="showFilterPop"
          style="border-radius: 12px; padding: 6px; width: 150px; margin-right: -30px"
        >
          <template #trigger>
            <button
              class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1 ms-auto"
            >
              <Filter size="16" /> Filter
            </button>
          </template>
          <div class="d-flex flex-column gap-1">
            <div
              class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
              :class="selectedTeamId === null ? 'fw-semibold bg-accent' : ''"
              @click="handleFilterChange(null)"
            >
              <Users size="15" /> All Members
            </div>
            <div
              v-for="team in getTeamByWorkspace"
              :key="team.team_id"
              class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
              :class="selectedTeamId === team.team_id ? 'fw-semibold bg-accent' : ''"
              @click="handleFilterChange(team.team_id)"
            >
              <Users size="15" /> {{ team.title }}
            </div>
          </div>
        </n-popover>

        <div
          class="form-control rounded-btn d-flex align-items-center py-2"
          style="width: 300px"
        >
          <input
            v-model="searchMember"
            type="text"
            class="search-input shadow-none outline-none border-0 w-100 fs-13"
            placeholder="Search member"
          />
          <Search color="var(--bs-gray)" size="18" />
        </div>
        <BaseButton
          @click="showModal = true"
          class="btn rounded-btn pe-3 ps-3 fs-13 py-2"
          icon="PlusIcon"
          btn-name="New Member"
        />
      </div>

      <div class="mt-4">
        <n-data-table
          class="my-custom-table"
          :columns="columns"
          :data="filteredData"
          :row-props="rowProps"
          :loading="loading"
        />
      </div>
    </div>

    <n-modal v-model:show="showKickModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 380px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Kick Member</span>
          <n-button
            text
            size="small"
            @click="showKickModal = false"
            class="hover-circle p-1 rounded-circle"
          >
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-3 pb-3">
          <p class="fs-13 text-mute mb-4 text-center">
            Are you sure you want to kick
            <span class="fw-semibold text-dark">{{ kickTarget?.name }}</span>
            {{ selectedTeamId !== null ? "from this team?" : "from this workspace?" }}
          </p>
          <div class="d-flex gap-2">
            <button
              class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50"
              @click="showKickModal = false"
            >
              Cancel
            </button>
            <button
              class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50"
              @click="confirmKick"
              :disabled="isKicking"
            >
              <span v-if="isKicking" class="spinner-border spinner-border-sm me-2"></span>
              {{ isKicking ? "Kicking..." : "Kick" }}
            </button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import BaseButton from "@/components/BaseButton.vue";
import { ref, computed, h, onMounted, render } from "vue";
import { NPopover } from "naive-ui";
import { Ban } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@/utils/toast";
import { useMemberStore } from "@/stores/user/member";
import { useTeamStore } from "@/stores/user/team";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const toast = notify(router);

const workspace_id = computed(() => route.params.workspace_id);

// Stores
const memberStore = useMemberStore();
const teamStore = useTeamStore();
const authStore = useAuthStore();

const { getAllMemberInWorkspace, getAllMemberInTeam } = storeToRefs(memberStore);
const { getTeamByWorkspace } = storeToRefs(teamStore);
const { getMe } = storeToRefs(authStore);

const isOwner = computed(
  () =>
    getAllMemberInWorkspace.value.find((m) => m.user_id === getMe.value?.user_id)
      ?.role === "owner"
);

// Loading
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      memberStore.getAllMemberInWorkspaceStore(workspace_id.value),
      teamStore.getTeamByWorkspaceStore(workspace_id.value),
    ]);
  } finally {
    loading.value = false;
  }
});

// UI State
const showFilterPop = ref(false);
const showModal = ref(false);
const searchMember = ref("");
const selectedTeamId = ref(null);
const openPop = ref({});
const showKickModal = ref(false);
const kickTarget = ref(null);
const isKicking = ref(false);

const selectedTeamLabel = computed(() => {
  const team = getTeamByWorkspace.value.find((t) => t.team_id === selectedTeamId.value);
  return team?.title ?? "All Members";
});

const roleConfig = {
  member: { bg: "bg-blue", text: "text-blue" },
  moderator: { bg: "bg-purple", text: "text-purple" },
  owner: { bg: "bg-green", text: "text-green" },
};

const editableRoles = {
  member: { bg: "bg-blue", text: "text-blue" },
  moderator: { bg: "bg-purple", text: "text-purple" },
};

function isPopOpen(id, type) {
  return !!openPop.value[`${id}_${type}`];
}

function closePop(id, type) {
  openPop.value[`${id}_${type}`] = false;
}

async function handleFilterChange(teamId) {
  selectedTeamId.value = teamId;
  showFilterPop.value = false;

  loading.value = true;
  try {
    if (teamId !== null) {
      await memberStore.getAllMemberInTeamStore(workspace_id.value, teamId);
    } else {
      await memberStore.getAllMemberInWorkspaceStore(workspace_id.value);
    }
  } finally {
    loading.value = false;
  }
}

function rowProps(row) {
  return { style: "cursor: pointer;" };
}

function kickMember(row) {
  kickTarget.value = row;
  showKickModal.value = true;
}

async function confirmKick() {
  if (!kickTarget.value) return;
  isKicking.value = true;
  try {
    if (selectedTeamId.value !== null) {
      await memberStore.removeFromTeam(
        workspace_id.value,
        selectedTeamId.value,
        kickTarget.value.user_id
      );
      await memberStore.getAllMemberInTeamStore(workspace_id.value, selectedTeamId.value);
    } else {
      await memberStore.removeFromWorkspace(workspace_id.value, kickTarget.value.user_id);
      await memberStore.getAllMemberInWorkspaceStore(workspace_id.value);
    }
    toast.success("Member removed successfully");
    showKickModal.value = false;
    kickTarget.value = null;
  } catch (err) {
    toast.error(err.message);
  } finally {
    isKicking.value = false;
  }
}

async function handleRoleChange(row, newRole) {
  try {
    await memberStore.updateRole(workspace_id.value, selectedTeamId.value, row.user_id, {
      role: newRole,
    });
    row.role = newRole;

    if (selectedTeamId.value !== null) {
      await memberStore.getAllMemberInTeamStore(workspace_id.value, selectedTeamId.value);
    } else {
      await memberStore.getAllMemberInWorkspaceStore(workspace_id.value);
    }

    toast.success("Role updated successfully");
  } catch (err) {
    toast.error(err.message);
  }
}

const memberSource = computed(() =>
  selectedTeamId.value !== null ? getAllMemberInTeam.value : getAllMemberInWorkspace.value
);

const filteredData = computed(() =>
  memberSource.value.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.value.toLowerCase()) ||
      m.email.toLowerCase().includes(searchMember.value.toLowerCase())
  )
);

const date = (date) =>
  new Date(date).toLocaleDateString("en-GB", { dateStyle: "long" });
// Table columns
const columns = [
  {
    title: "Name",
    key: "name",
    render(row) {
      return h("div", { class: "d-flex align-items-center gap-2" }, [
        h("img", {
          src: row.avatar,
          class: "rounded-circle",
          style: "width: 28px; height: 28px; object-fit: cover;",
          onError: (e) => {
            e.target.src = "/default-avatar.png";
          },
        }),
        h("span", { class: "fs-13" }, row.name),
      ]);
    },
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Join",
    key: "joined_at",
    render(row) {
      return h("div", date(row.joined_at))
    }
  },
  {
    title: "Role",
    key: "role",
    render(row) {
      const badge = h(
        "span",
        {
          class: `tab-info w-fit fw-medium d-inline-block ${roleConfig[row.role]?.bg} ${
            roleConfig[row.role]?.text
          }`,
        },
        row.role.charAt(0).toUpperCase() + row.role.slice(1)
      );

      // Not owner or viewing owner row → static badge only
      if (!isOwner.value || row.role === "owner") {
        return badge;
      }

      // Owner viewing non-owner rows → popover with member/moderator only
      return h(
        NPopover,
        {
          show: isPopOpen(row.user_id, "role"),
          trigger: "click",
          placement: "bottom-start",
          showArrow: false,
          style: "border-radius: 12px; padding: 6px; width: 140px;",
          "onUpdate:show": (val) => {
            openPop.value[`${row.user_id}_role`] = val;
          },
        },
        {
          trigger: () =>
            h(
              "span",
              {
                class: `tab-info w-fit fw-medium cursor-pointer d-inline-block ${
                  roleConfig[row.role]?.bg
                } ${roleConfig[row.role]?.text}`,
                onClick: (e) => e.stopPropagation(),
              },
              row.role.charAt(0).toUpperCase() + row.role.slice(1)
            ),
          default: () =>
            h(
              "div",
              {},
              Object.entries(editableRoles).map(([key]) =>
                h(
                  "div",
                  {
                    class:
                      "d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize",
                    onClick: () => {
                      closePop(row.user_id, "role");
                      handleRoleChange(row, key);
                    },
                  },
                  key.charAt(0).toUpperCase() + key.slice(1)
                )
              )
            ),
        }
      );
    },
  },
  {
    title: "Kick Member",
    key: "kick",
    render(row) {
      const isDisabled = !isOwner.value || row.role === "owner";

      return h(
        "button",
        {
          class: `btn btn-sm fs-13 text-white rounded-btn d-flex align-items-center gap-1 px-3 ${
            isDisabled ? "bg-danger opacity-50" : "bg-danger"
          }`,
          disabled: isDisabled,
          onClick: (e) => {
            e.stopPropagation();
            if (!isDisabled) kickMember(row);
          },
        },
        [h(Ban, { size: 14 }), "Kick"]
      );
    },
  },
];
</script>

<style scoped>
.search-input:focus {
  outline: none;
}

.form-control:has(.search-input:focus) {
  outline: 1px solid #171717;
}

.my-custom-table :deep(.n-data-table-wrapper) {
  border-radius: 16px !important;
  overflow: hidden !important;
  border: 1px solid #e4e4e7 !important;
}

.my-custom-table :deep(.n-data-table-th) {
  background-color: #f5f5f5 !important;
  color: #171717 !important;
  border-bottom: 1px solid #e4e4e7;
  padding: 16px 24px !important;
  font-weight: 600 !important;
}

.my-custom-table :deep(.n-data-table-td) {
  padding: 14px 24px !important;
}
</style>
