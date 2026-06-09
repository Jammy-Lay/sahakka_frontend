<template>
  <router-link v-for="(section, index) in getTeamSection" :key="section.id"
    :to="`/workspace/${currentRouteWorkspaceId}/team/${currentRouteTeamId}/${section.name.toLowerCase()}`" :class="[
      'team-section text-decoration-none text-mute fs-15 d-flex justify-content-center align-items-center bg-white',
      getSectionClass(section.name),
    ]" :style="{ borderRightColor: getBorderColor(index) }" active-class="active-section">
    {{ section.name }}
  </router-link>

  <n-popover trigger="click" placement="bottom" :show-arrow="false" v-model:show="showInvitePopover"
    style="border-radius: 12px; width: 400px; padding: 0; margin-right: 12px; margin-top: 12px;">
    <template #trigger>
      <div
        class="team-section d-flex justify-content-center align-items-center gap-2 cursor-pointer fw-medium invite-hover">
        <Mail size="14" />
        <span class="fs-14">Invite</span>
      </div>
    </template>

    <div class="d-flex align-items-center justify-content-between" style="padding: 0 10px; padding-top: 10px">
      <span class="fw-bold fs-15 ps-1 m-0">Invite people</span>
      <n-button text size="small" @click="showInvitePopover = false" class="text-dark hover-circle p-2 rounded-circle">
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
          <BaseButton
            :btnName="isInviteLoading ? 'Inviting...' : 'Invite'"
            class="fs-13 rounded-btn-sm fw-medium text-nowrap h-100"
            :disabled="isInviteLoading"
            @click="handleInvite"
          />
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
        <!-- Generate token -->
        <BaseButton
          :btnName="isGenerateLoading ? 'Generating...' : 'Generate passcode'"
          class="w-100 fs-14 rounded-btn-sm py-2"
          :disabled="isGenerateLoading"
          @click="handleGenerate"
        />
      </div>
    </div>
  </n-popover>
</template>

<script setup>
import { computed, h, onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/user/team";
import { Mail, X, Copy } from "lucide-vue-next";
import { useInviteStore } from "@/stores/user/invite";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";

const route = useRoute();
const currentRouteWorkspaceId = computed(() => route.params.workspace_id);
const currentRouteTeamId = computed(() => route.params.team_id);
const currentSection = computed(() => route.path.split("/").pop()?.toLowerCase());
const inviteStore = useInviteStore();
const teamStore = useTeamStore();
const { getTeamSection } = storeToRefs(teamStore);

const showInvitePopover = ref(false);
const inviteEmail = ref("");
const passcode = ref("");
const isInviteLoading = ref(false);
const isGenerateLoading = ref(false);

const activeBorderColor = computed(() => {
  const map = {
    tasks: "#0088ff",
    issues: "#ff383c",
    documents: "#00C3D0",
    activity: "#6155F5",
  };
  return map[currentSection.value] ?? "#0088ff";
});

onMounted(async () => {
  await teamStore.getTeamSectionStore(currentRouteTeamId.value);
});

watch(currentRouteTeamId, async (team_id) => {
  if (team_id) await teamStore.getTeamSectionStore(team_id);
});

function getSectionClass(name) {
  const map = {
    tasks: "section-task",
    issues: "section-issue",
    documents: "section-document",
    activity: "section-activity",
  };
  return map[name.toLowerCase()] ?? "";
}

function getBorderColor(index) {
  const activeIndex = getTeamSection.value.findIndex(
    (s) => s.name.toLowerCase() === currentSection.value
  );
  return index === activeIndex || index === activeIndex - 1
    ? activeBorderColor.value
    : "#E4E4E7";
}

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
  passcode.value = ""
};
</script>

<style scoped>
.team-section {
  flex: 1;
  align-self: stretch;
  border-right: 1px solid #e4e4e7;
  padding: 0;
  margin: 0;
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

.invite-hover {
  transition: 0.3s;
  background-color: white;
}

.invite-hover:hover {
  background-color: #171717 !important;
  color: white !important;
}
</style>