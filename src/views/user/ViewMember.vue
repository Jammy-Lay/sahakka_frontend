<template>
  <div class="mt-4">
    <table v-if="loading" class="table table-hover table-borderless align-middle shadow-sm">
      <thead>
        <tr>
          <th class="text-muted">No.</th>
          <th class="text-muted">Name</th>
          <th class="text-muted">Email</th>
          <th class="text-muted">Joined at</th>
          <th class="text-muted">Role</th>
          <th class="text-muted" v-if="isOwner">kick</th>
        </tr>
      </thead>
      <tbody class="rounded-4">
        <tr v-for="(row, index) in getAllMembersByTeam" :key="index">
          <td class="text-muted">{{ index + 1 }}</td>
          <td class="text-muted">{{ row.name }}</td>
          <td class="text-muted">{{ row.email }}</td>
          <td class="text-muted">{{ date(row.joined_at) }}</td>
          <td class="text-muted" >
            <RoleDropdown :my-role="row.role" @change-role="changeRole" v-if="isOwner" :user-id="row.user_id"/>
            <span class="role" v-else>{{ row.role }}</span>
          </td>
          <td class="text-muted" v-if="isOwner">
            <button
              class="btn btn-danger btn-sm rounded-btn px-2 d-flex align-items-center gap-1"
              @click="() => console.log(row.user_id)"
            >
              <Ban size="16" /> <span>Kick</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useMemberStore } from "@/stores/user/member";
import { useAuthStore } from "@/stores/auth";
import { Ban } from "lucide-vue-next";
import RoleDropdown from "@/components/RoleDropdown.vue";

const route = useRoute();

const workspace_id = route.params.workspace_id;
const team_id = route.params.team_id;

const useMember = useMemberStore();
const { getAllMembers, getAllMembersByTeam, myWorkspace, myCurrentWorkspace } =
  storeToRefs(useMember);

const useAuth = useAuthStore();
const { getMe } = storeToRefs(useAuth);

const date = (date) => new Date(date).toLocaleDateString("en-GB", { dateStyle: "medium" });

const isOwner = ref(false);
const loading = ref(true);

onMounted(async () => {
  await useMember.getAllTeamMembers(workspace_id, team_id);
  await useMember.getMyWorkspace(workspace_id);
  console.log("get member by team", getAllMembersByTeam.value);
  console.log("get me", getMe.value);
  console.log("get my workspace", myWorkspace.value);
  if (myCurrentWorkspace.value.my_role === "owner") isOwner.value = true;
  // loading.value = true;
});

const changeRole = async (userID, role, fn) => {
  await useMember.updateRole(workspace_id, team_id, userID, role);
  // await useMember.getAllTeamMembers(workspace_id, team_id);
  fn();
}

</script>

<style scoped>
table {
  --bs-table-hover-bg: rgba(var(--bs-emphasis-color-rgb), 0.025);
  border-radius: 12px;
  overflow: hidden;
  thead tr th {
    font-size: 14px;
    padding: 16px 30px;
  }
  thead {
    border-bottom: 1px solid var(--bs-border-color);
  }
  tbody tr:not(:last-child) {
    border-bottom: 1px solid var(--bs-border-color);
  }
  tbody tr td {
    padding: 10px 30px;
  }
}

.role {
  text-transform: capitalize;
  color: #209f5b;
}
</style>
