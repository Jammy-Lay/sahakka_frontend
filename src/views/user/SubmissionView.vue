<template>
  <div class="pb-3">
    <SubmissionSkeleton v-if="submissionStore.loading" />
    <div v-else>
      <div class="pt-4 pb-2 bg-body position-sticky top-0">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div class="d-flex gap-2">
            <h2 class="fw-semibold fs-5 mb-1">Submissions :</h2>
            <h2 class="fs-5 fw-semibold mb-1">{{ getTeamById.title }}</h2>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span
            class="tab-title"
            :class="activeTab === 'all' ? 'tab-dark' : 'tab-default'"
            @click="activeTab = 'all'"
            ><layout-dashboard size="16" /> All Submissions
          </span>
          <span
            class="tab-title"
            :class="
              activeTab === 'pending'
                ? 'bg-orange-active text-white'
                : 'bg-orange text-orange'
            "
            @click="activeTab = 'pending'"
            ><CircleDashed size="16" /> Pending
          </span>
          <span
            class="tab-title"
            :class="
              activeTab === 'approved'
                ? 'bg-green-active text-white'
                : 'bg-green text-green'
            "
            @click="activeTab = 'approved'"
            ><CircleCheck size="16" /> Approved
          </span>
          <span
            class="tab-title"
            :class="
              activeTab === 'rejected' ? 'bg-red-active text-white' : 'bg-red text-danger'
            "
            @click="activeTab = 'rejected'"
            ><CircleX size="16" /> Rejected
          </span>
        </div>
      </div>

      <n-empty
        v-if="filteredSubmissions.length === 0"
        description="No Data"
        class="mt-8"
        style="--n-icon-size: 45px; font-size: 14px"
      />

      <div class="row g-3" v-else>
        <div
          class="col-md-6 col-lg-4"
          v-for="sub in filteredSubmissions"
          :key="sub.submission_id"
        >
          <div class="bg-white rounded-card p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex gap-2 align-items-center">
                <img
                  :src="sub.submitted_by?.avatar"
                  alt=""
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <p class="mb-0 fw-semibold fs-14">{{ sub.submitted_by?.name }}</p>
              </div>
              <span
                class="tab-info w-fit fw-medium fs-13"
                :class="[
                  submissionStatusConfig[sub.status]?.bg,
                  submissionStatusConfig[sub.status]?.text,
                ]"
              >
                <component :is="submissionStatusConfig[sub.status]?.icon" size="14" />
                {{ submissionStatusConfig[sub.status]?.label }}
              </span>
            </div>
            <div class="d-flex align-items-center gap-2 text-mute mb-2 fs-13">
              <calendar :size="15" />
              <span>submitted time : {{ formatDateTime(sub.created_at) }}</span>
            </div>
            <h6 class="mb-2 fw-semibold">Task : {{ sub.task?.title }}</h6>
            <p class="mb-2 text-mute fs-13">
              Message : {{ sub.message || "No message provided" }}
            </p>
            <base-button
              btn-name="Review"
              icon="eye"
              class="fs-13 d-block ms-auto"
              @click="openReview(sub)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal (unchanged) -->
    <n-modal v-model:show="showModal" :mask-closable="true">
      <div v-if="selectedSubmission" class="bg-white rounded-card" style="width: 600px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3">
          <div class="d-flex align-items-center gap-2">
            <n-button
              text
              size="small"
              @click="showModal = false"
              class="d-flex align-items-center text-dark fs-13"
            >
              <arrow-left size="16" class="me-1" /> Back
            </n-button>
            <div style="width: 1px; height: 20px; background: #e4e4e7" class="mx-1"></div>
            <div class="d-flex gap-2 align-items-center">
              <img
                :src="selectedSubmission.submitted_by?.avatar"
                alt=""
                class="rounded-circle object-fit-cover"
                style="width: 30px; height: 30px"
              />
              <p class="mb-0 fw-semibold fs-14">
                {{ selectedSubmission.submitted_by?.name }}
              </p>
            </div>
          </div>
          <span
            class="tab-info w-fit fw-medium fs-13"
            :class="[
              submissionStatusConfig[selectedSubmission.status]?.bg,
              submissionStatusConfig[selectedSubmission.status]?.text,
            ]"
          >
            <component
              :is="submissionStatusConfig[selectedSubmission.status]?.icon"
              size="14"
            />
            {{ submissionStatusConfig[selectedSubmission.status]?.label }}
          </span>
        </div>

        <n-divider style="margin: 0; --n-color: #e4e4e7" />

        <div class="px-3 pt-3 pb-3">
          <div class="d-flex align-items-center gap-2 text-mute mb-3 fs-13">
            <calendar :size="15" />
            <span
              >submitted time : {{ formatDateTime(selectedSubmission.created_at) }}</span
            >
          </div>
          <h6 class="mb-2 fw-semibold">Task : {{ selectedSubmission.task?.title }}</h6>
          <p class="mb-3 text-mute fs-13">
            Message : {{ selectedSubmission.message || "No message provided" }}
          </p>

          <div class="mb-3" v-if="selectedSubmission.file">
            <p class="fw-medium text-dark mb-2 fs-15">File attachment</p>
            <div
              v-if="isImageFile(selectedSubmission.file)"
              class="w-fit d-flex flex-column bg-accent rounded-btn border"
            >
              <div class="d-flex align-items-center gap-2 p-2 ps-3 text-mute">
                <file-text size="15" />
                <p class="mb-0 fs-14">{{ getFileName(selectedSubmission.file) }}</p>
              </div>
              <div
                style="width: 350px; height: 200px; border-radius: 0 0 12px 12px"
                class="overflow-hidden"
              >
                <n-image
                  :src="selectedSubmission.file"
                  object-fit="cover"
                  class="w-100 h-100"
                  style="display: block"
                  show-toolbar-tooltip
                />
              </div>
            </div>
            <a
              v-else
              :href="selectedSubmission.file"
              target="_blank"
              rel="noopener noreferrer"
              class="attach-upload-box mb-0 text-decoration-none"
              style="cursor: pointer"
            >
              <n-tooltip
                placement="bottom"
                trigger="hover"
                :show-arrow="false"
                :keep-alive-on-hover="false"
                :style="{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px' }"
              >
                <template #trigger>
                  <div class="attach-pdf-icon bg-blue">
                    <FileText size="18" color="#0088ff" />
                  </div>
                </template>
                Open PDF
              </n-tooltip>
              <span class="fs-13 text-dark fw-medium flex-grow-1 text-truncate">
                {{ getFileName(selectedSubmission.file) }}
              </span>
            </a>
          </div>

          <div class="mb-2">
            <label class="fs-14 text-dark mb-1">Feedback</label>
            <textarea
              v-model="feedback"
              placeholder="Feedback"
              class="form-control fs-13 rounded-btn-sm bg-white mb-3 base-input"
              style="min-height: 90px; resize: vertical; border: 1px solid #e4e4e7"
            />
            <div class="d-flex align-items-center gap-2 z-3">
              <label class="fs-14 text-dark">Review Status :</label>
              <n-popover
                v-model:show="showStatusPop"
                trigger="click"
                placement="bottom-start"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 140px"
              >
                <template #trigger>
                  <span
                    class="tab-info w-fit fw-medium cursor-pointer"
                    :class="
                      selectedStatus
                        ? [
                            reviewStatusConfig[selectedStatus]?.bg,
                            reviewStatusConfig[selectedStatus]?.text,
                          ]
                        : ['bg-accent', 'text-mute']
                    "
                  >
                    <component
                      v-if="selectedStatus"
                      :is="reviewStatusConfig[selectedStatus]?.icon"
                      size="14"
                    />
                    {{
                      selectedStatus
                        ? reviewStatusConfig[selectedStatus]?.label
                        : "Select Status"
                    }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in reviewStatusConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                    @click="
                      selectedStatus = key;
                      showStatusPop = false;
                    "
                  >
                    <component :is="cfg.icon" size="14" />
                    {{ cfg.label }}
                  </div>
                </div>
              </n-popover>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-3 align-items-center">
            <button
              class="btn btn-outline-light border-0 text-dark rounded-card fs-14 px-3 py-2 fw-semibold"
              @click="showModal = false"
            >
              Close
            </button>
            <button
              class="btn bg-btn rounded-card py-2 px-3 d-flex align-items-center gap-2 fs-14"
              :disabled="isLoading"
              @click="handleSend"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              <Send v-else :size="16" />
              {{ isLoading ? "Sending..." : "Send" }}
            </button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  ArrowLeft,
  Calendar,
  FileText,
  CircleCheck,
  CircleX,
  CircleDashed,
  Send,
} from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useSubmissionStore } from "@/stores/user/submission";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@/utils/toast";
import { storeToRefs } from "pinia";
import SubmissionSkeleton from "@/components/Skeleton/SubmissionSkeleton.vue";
import { useTeamStore } from "@/stores/user/team";

const route = useRoute();
const router = useRouter();
const toast = notify(router);
const workspace_id = computed(() => route.params.workspace_id);
const team_id = computed(() => route.params.team_id);

const submissionStore = useSubmissionStore();
const { getAllSubmissionByTeam } = storeToRefs(submissionStore);

const teamStore = useTeamStore();
const { getTeamById } = storeToRefs(teamStore);

const showModal = ref(false);
const showStatusPop = ref(false);
const selectedStatus = ref(null);
const feedback = ref("");
const selectedSubmission = ref(null);
const isLoading = ref(false);

const activeTab = ref("all");

const filteredSubmissions = computed(() => {
  if (activeTab.value === "all") return getAllSubmissionByTeam.value;
  return getAllSubmissionByTeam.value.filter((s) => s.status === activeTab.value);
});

const submissionStatusConfig = {
  pending: { icon: CircleDashed, bg: "bg-orange", text: "text-orange", label: "Pending" },
  approved: { icon: CircleCheck, bg: "bg-green", text: "text-green", label: "Approved" },
  rejected: { icon: CircleX, bg: "bg-red", text: "text-danger", label: "Rejected" },
};

const reviewStatusConfig = {
  approved: { icon: CircleCheck, bg: "bg-green", text: "text-green", label: "Approved" },
  rejected: { icon: CircleX, bg: "bg-red", text: "text-danger", label: "Rejected" },
};

onMounted(async () => {
  teamStore.getTeamByIdStore(workspace_id.value, team_id.value);
  submissionStore.getAllSubmissionByTeamStore(workspace_id.value, team_id.value);
});

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} / ${month} / ${year} / ${time}`;
};

const getFileName = (url) => {
  if (!url) return "";
  try {
    return decodeURIComponent(url.split("/").pop());
  } catch {
    return url.split("/").pop();
  }
};

const isImageFile = (url) => /\.(jpe?g|png|gif|webp)$/i.test(url || "");

const openReview = (sub) => {
  selectedSubmission.value = sub;
  selectedStatus.value =
    sub.status === "approved" || sub.status === "rejected" ? sub.status : null;
  feedback.value = "";
  showModal.value = true;
};

async function handleSend() {
  if (!feedback.value) {
    toast.error("Feedback is required");
    return;
  }

  if (!selectedStatus.value) {
    toast.error("Status is required");
    return;
  }

  try {
    isLoading.value = true;
    await submissionStore.updateSubmission(
      workspace_id.value,
      team_id.value,
      selectedSubmission.value.submission_id,
      { status: selectedStatus.value, feedback: feedback.value }
    );
    await submissionStore.getAllSubmissionByTeamStore(workspace_id.value, team_id.value);
    feedback.value = "";
    selectedStatus.value = null;
    selectedSubmission.value = null;
    toast.success("Submission reviewed successfully");
    showModal.value = false;
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
