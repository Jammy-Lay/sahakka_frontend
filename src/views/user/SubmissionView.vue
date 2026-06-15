<template>
  <div>
    <!-- Review Button -->
    <n-button
      size="small"
      class="d-flex align-items-center gap-2 px-3"
      style="background:#111827; color:#fff; border-radius:999px; font-size:13px; font-weight:500; border:none;"
      @click="showModal = true"
    >
      <eye :size="14" />
      Review
    </n-button>

    <!-- Review Modal -->
    <n-modal v-model:show="showModal" :mask-closable="true">
      <div class="bg-white rounded-3 overflow-hidden" style="width:520px; max-width:95vw; box-shadow:0 8px 32px rgba(0,0,0,0.12);">

        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between px-4 py-3">
          <div class="d-flex align-items-center gap-2">
            <n-button text size="small" @click="showModal = false" class="d-flex align-items-center gap-1 text-secondary" style="font-size:13px;">
              <arrow-left :size="16" />
              <span>Back</span>
            </n-button>
            <!-- vertical divider -->
            <div style="width:1px; height:20px; background:#e4e4e7;" class="mx-1"></div>
            <div class="d-flex align-items-center gap-2">
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Sothatt"
                alt="avatar"
                class="rounded-circle"
                style="width:30px; height:30px; object-fit:cover; background:#f3f4f6;"
              />
              <span class="fw-medium" style="font-size:14px;">{{ task.assignee }}</span>
            </div>
          </div>
          <!-- Pending badge -->
          <span class="d-flex align-items-center gap-1 px-3 py-1 rounded-pill border"
            style="font-size:12px; font-weight:500; color:#d97706; background:#fef3c7; border-color:#fde68a !important;">
            <loader :size="13" class="spin" />
            Pending
          </span>
        </div>

        <n-divider style="margin:0; --n-color:#e4e4e7;" />

        <!-- Body -->
        <div class="px-4 pt-3 pb-4">

          <!-- Meta -->
          <div class="d-flex align-items-center gap-2 text-secondary mb-2" style="font-size:12.5px;">
            <calendar :size="14" />
            <span>submitted time: {{ task.submittedTime }}</span>
          </div>

          <h3 class="fw-semibold mb-3" style="font-size:16px; color:#111827;">{{ task.title }}</h3>

          <!-- File Attachment -->
          <div v-if="task.attachment" class="mb-3">
            <p class="fw-medium text-secondary mb-2" style="font-size:12px;">File attachment</p>
            <div class="d-flex align-items-center gap-2 rounded-3 border px-3 py-2 mb-2 bg-light" style="font-size:13px; color:#374151;">
              <file-text :size="15" class="text-secondary" />
              <span>{{ task.attachment }}</span>
            </div>
            <div class="rounded-3 overflow-hidden">
              <img
                :src="task.attachmentPreview"
                alt="Attachment preview"
                class="w-100 d-block"
                style="border-radius:10px;"
              />
            </div>
          </div>

          <!-- Message -->
          <div class="mb-4">
            <p class="fw-medium text-secondary mb-2" style="font-size:12px;">Message</p>
            <div class="rounded-3 border bg-light px-3 py-2" style="font-size:13.5px; color:#374151; min-height:44px;">
              {{ task.message }}
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-end gap-2">

            <!-- Reject Popover -->
            <n-popover
              v-model:show="showRejectPopover"
              trigger="click"
              placement="top-end"
              :show-arrow="true"
              style="padding:0; border-radius:12px; overflow:hidden;"
            >
              <template #trigger>
                <button
                  class="btn d-flex align-items-center gap-2"
                  style="background:#fee2e2; color:#dc2626; font-size:13px; font-weight:500; border:none; border-radius:8px;"
                  @click="showRejectPopover = true"
                >
                  <x :size="13" /> Reject
                </button>
              </template>

              <div class="p-3" style="min-width:240px;">
                <p class="fw-semibold mb-1" style="font-size:14px; color:#111827;">Reject this task?</p>
                <p class="text-secondary mb-2" style="font-size:12px;">Optionally leave a reason for the submitter.</p>
                <textarea
                  v-model="rejectReason"
                  class="form-control form-control-sm mb-3 bg-light border"
                  placeholder="Reason (optional)"
                  rows="3"
                  style="font-size:13px; resize:none; border-radius:8px;"
                />
                <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-sm btn-light" style="font-size:12px; border-radius:7px;" @click="showRejectPopover = false">Cancel</button>
                  <button class="btn btn-sm btn-danger" style="font-size:12px; border-radius:7px;" @click="handleReject">Confirm Reject</button>
                </div>
              </div>
            </n-popover>

            <!-- Approve Popover -->
            <n-popover
              v-model:show="showApprovePopover"
              trigger="click"
              placement="top-end"
              :show-arrow="true"
              style="padding:0; border-radius:12px; overflow:hidden;"
            >
              <template #trigger>
                <button
                  class="btn d-flex align-items-center gap-2"
                  style="background:#dcfce7; color:#16a34a; font-size:13px; font-weight:500; border:none; border-radius:8px;"
                  @click="showApprovePopover = true"
                >
                  <check :size="13" /> Approve
                </button>
              </template>

              <div class="p-3" style="min-width:240px;">
                <p class="fw-semibold mb-1" style="font-size:14px; color:#111827;">Approve this task?</p>
                <p class="text-secondary mb-3" style="font-size:12px;">This will mark the task as completed.</p>
                <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-sm btn-light" style="font-size:12px; border-radius:7px;" @click="showApprovePopover = false">Cancel</button>
                  <button class="btn btn-sm btn-success" style="font-size:12px; border-radius:7px;" @click="handleApprove">Confirm Approve</button>
                </div>
              </div>
            </n-popover>

          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, ArrowLeft, Calendar, FileText, X, Check, Loader } from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    default: () => ({
      assignee: 'Sothatt',
      submittedTime: '1 / Jan / 2026 / 09:30 AM',
      title: 'Fix login bug',
      attachment: 'Image.png',
      attachmentPreview: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      message: 'Done task',
      status: 'pending',
    }),
  },
})

const emit = defineEmits(['approve', 'reject'])

const showModal = ref(false)
const showRejectPopover = ref(false)
const showApprovePopover = ref(false)
const rejectReason = ref('')

function handleReject() {
  emit('reject', { reason: rejectReason.value })
  showRejectPopover.value = false
  showModal.value = false
  rejectReason.value = ''
}

function handleApprove() {
  emit('approve')
  showApprovePopover.value = false
  showModal.value = false
}
</script>

<style scoped>
.spin {
  animation: spin 1.5s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>