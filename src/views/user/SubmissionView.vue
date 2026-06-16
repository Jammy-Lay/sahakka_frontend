<template>
  <div>
    <div class="position-sticky top-0 z-1 pt-4 pb-2 bg-body">
      <div class="d-flex align-items-start justify-content-between mb-2">
        <div>
          <h2 class="fw-semibold fs-5 mb-1">Hello</h2>
          <p class="text-secondary fs-13 mb-0">Description</p>
        </div>
      </div>
    </div>
    
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="bg-white rounded-card p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex gap-2 align-items-center">
              <img
                src="../../assets/image/default-avatar.png"
                alt=""
                class="rounded-circle"
                style="width: 30px; height: 30px"
              />
              <p class="mb-0 fw-semibold fs-14">Jammy</p>
            </div>
            <span class="tab-info w-fit fw-medium text-orange bg-orange fs-13">
              <CircleDashed size="14" /> Pending
            </span>
          </div>
          <div class="d-flex align-items-center gap-2 text-mute mb-2 fs-13">
            <calendar :size="15" />
            <span>submitted time : 1 / Jan / 2026 / 09:30 AM</span>
          </div>
          <h6 class="mb-2 fw-semibold">Fix Login bug</h6>
          <p class="mb-2 text-mute fs-13">Lorem ipsum dolor sit amet.</p>
          <base-button
            btn-name="Review"
            icon="eye"
            class="fs-13 d-block ms-auto"
            @click="showModal = true"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="bg-white rounded-card p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex gap-2 align-items-center">
              <img
                src="../../assets/image/default-avatar.png"
                alt=""
                class="rounded-circle"
                style="width: 30px; height: 30px"
              />
              <p class="mb-0 fw-semibold fs-14">Jammy</p>
            </div>
            <span class="tab-info w-fit fw-medium text-orange bg-orange fs-13">
              <CircleDashed size="14" /> Pending
            </span>
          </div>
          <div class="d-flex align-items-center gap-2 text-mute mb-2 fs-13">
            <calendar :size="15" />
            <span>submitted time : 1 / Jan / 2026 / 09:30 AM</span>
          </div>
          <h6 class="mb-2 fw-semibold">Fix Login bug</h6>
          <p class="mb-2 text-mute fs-13">Lorem ipsum dolor sit amet.</p>
          <base-button
            btn-name="Review"
            icon="eye"
            class="fs-13 d-block ms-auto"
            @click="showModal = true"
          />
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <n-modal v-model:show="showModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 600px">
        <!-- Header -->
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
                src="../../assets/image/default-avatar.png"
                alt=""
                class="rounded-circle"
                style="width: 30px; height: 30px"
              />
              <p class="mb-0 fw-semibold fs-14">Jammy</p>
            </div>
          </div>
          <span class="tab-info w-fit fw-medium text-orange bg-orange fs-13">
            <CircleDashed size="14" /> Pending
          </span>
        </div>

        <n-divider style="margin: 0; --n-color: #e4e4e7" />

        <!-- Body -->
        <div class="px-3 pt-3 pb-3">
          <div class="d-flex align-items-center gap-2 text-mute mb-3 fs-13">
            <calendar :size="15" />
            <span>submitted time : 1 / Jan / 2026 / 09:30 AM</span>
          </div>

          <h6 class="mb-2 fw-semibold">Fix Login bug</h6>
          <p class="mb-3 text-mute fs-13">Lorem ipsum dolor sit amet.</p>

          <!-- File Attachment -->
          <div class="mb-3">
            <p class="fw-medium text-dark mb-2 fs-15">File attachment</p>
            <div class="w-fit d-flex flex-column bg-accent rounded-btn border">
              <div class="d-flex align-items-center gap-2 p-2 ps-3 text-mute">
                <file-text size="15" />
                <p class="mb-0 fs-14">Image.png</p>
              </div>
              <div style="width: 400px; height: 200px; border-radius: 0 0 12px 12px;" class="overflow-hidden">
                <n-image
                  :src="Image"
                  object-fit="cover"
                  class="w-100 h-100"
                  style="display: block"
                  show-toolbar-tooltip
                />
              </div>
            </div>
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
                style="border-radius: 12px; padding: 6px; width: 140px;"
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
            <base-button
              btn-name="Send"
              icon="send"
              class="py-2 rounded-card px-3 fs-14"
              @click="handleSend"
            />
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  ArrowLeft,
  Calendar,
  FileText,
  CircleCheck,
  CircleX,
  CircleDashed,
} from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import Image from "@/assets/image/style 1.png";

const showModal = ref(false);
const showStatusPop = ref(false);
const selectedStatus = ref(null);
const feedback = ref("");

const reviewStatusConfig = {
  approved: { icon: CircleCheck, bg: "bg-green", text: "text-green", label: "Approved" },
  rejected: { icon: CircleX, bg: "bg-red", text: "text-danger", label: "Rejected" },
};

function handleSend() {
  if (!selectedStatus.value) {
    console.warn("Please select a status first!");
    return;
  }

  const payload = {
    status: selectedStatus.value,
    feedback: feedback.value,
  };

  console.log("Review Payload:", payload);

  feedback.value = "";
  selectedStatus.value = null;
  showModal.value = false;
}
</script>

<style scoped></style>
