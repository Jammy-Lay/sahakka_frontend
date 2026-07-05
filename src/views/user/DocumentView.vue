<template>
  <n-modal v-model:show="deleteModal" :mask-closable="true">
    <div class="bg-white rounded-card" style="width: 380px">
      <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
        <span class="fw-medium fs-15">Delete Document</span>
        <n-button
          text
          size="small"
          @click="deleteModal = false"
          class="hover-circle p-1 rounded-circle"
        >
          <X size="18" />
        </n-button>
      </div>
      <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
      <div class="px-4 pt-3 pb-3">
        <p class="fs-13 text-mute mb-4 text-center">Are you sure you want to delete ?</p>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50"
            @click="deleteModal = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50 py-2"
            @click="deleteDocHandling"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </n-modal>

  <n-modal v-model:show="showModal" :mask-closable="true">
    <div class="bg-white rounded-card" style="width: 400px">
      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
        <span class="fw-medium fs-15">Create Document</span>
        <n-button
          text
          size="small"
          @click="showModal = false"
          class="hover-circle p-1 rounded-circle"
        >
          <x size="18" />
        </n-button>
      </div>

      <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />

      <div class="px-4 pt-2 pb-3">
        <label class="mb-2 fs-12 fw-medium d-block required">Document Name</label>
        <BaseInput
          v-model="documentName"
          input-placeholder="Document name"
          input-class="py-1 fs-13 rounded-btn-sm mb-3"
        />
        <!-- Create team -->
        <button
          class="btn bg-btn w-100 fs-13 rounded-btn py-2"
          :disabled="loading"
          @click="createDocument"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
          {{ loading ? "Creating..." : "Create Document" }}
        </button>
      </div>
    </div>
  </n-modal>

  <main class="py-4">
    <div v-if="isLoading">
      <TitleTeamSkeleton class="mb-4" />
      <SkeletonDocument />
    </div>
    <div class="container-fluid p-0" v-else>
      <div class="row g-2">
        <div class="col-lg-5">
          <h2 class="fw-semibold fs-5 mb-1">
            {{ getTeamById?.title }}
          </h2>
          <p class="text-secondary fs-13 mb-0">
            {{ getTeamById?.description }}
          </p>
        </div>
        <div
          class="col-lg-7 ms-auto text-end d-flex gap-3 align-items-start justify-content-end"
        >
          <div
            class="form-control rounded-btn d-flex align-items-center py-2"
            style="width: 300px"
          >
            <input
              v-model="searchDoc"
              type="text"
              class="search-input shadow-none outline-none border-0 w-100 fs-13"
              placeholder="Search document"
            />
            <Search color="var(--bs-gray)" size="18" />
          </div>
          <base-btn
            @click="showModal = true"
            class="btn rounded-btn rounded-btn pe-3 ps-3 fs-13 py-2"
            icon="PlusIcon"
            btn-name="New document"
          >
          </base-btn>
        </div>
      </div>
      <n-empty
        v-if="document.length === 0"
        description="No Data"
        class="mt-8"
        style="--n-icon-size: 45px; font-size: 14px"
      />
      <div v-else class="row pt-4 g-3">
  <div v-for="(doc, index) in document" :key="index" class="col-md-6 col-lg-4">
    <document-card
      :avatar="doc.created_by.avatar"
      :user-name="doc.created_by.name"
      :document-title="doc.title"
      :created-at="doc.created_at"
      :document-id="doc.document_id"
      :is-owner="isOwner"
      @delete-action="
        (docId) => {
          deleteModal = true;
          document_id = docId;
        }
      "
      @update-title="updateTitle"
      @download-action="downloadDocHandling"
    />
  </div>
</div>
    </div>
  </main>
</template>

<script setup>
import BaseBtn from "@/components/BaseBtn.vue";
import BaseInput from "@/components/BaseInput.vue";
import DocumentCard from "@/components/DocumentCard.vue";
import SkeletonDocument from "@/components/Skeleton/SkeletonDocument.vue";
import TitleTeamSkeleton from "@/components/team/TitleTeamSkeleton.vue";
import { useDocumentStore } from "@/stores/user/document";
import { useTeamStore } from "@/stores/user/team";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import { notify } from "@/utils/toast";
import { Search } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const toast = notify(router);

const workspace_id = computed(() => route.params.workspace_id);
const team_id = computed(() => route.params.team_id);

const isLoading = ref(true);
const loading = ref(false);

// Document and search
const document_id = ref(null);
const searchDoc = ref("");

const documentName = ref("");

// Show modal
const showModal = ref(false);
const deleteModal = ref(false);

const useDocument = useDocumentStore();
const { getDocumentByTeam } = storeToRefs(useDocument);

const useTeam = useTeamStore();
const { getTeamById } = storeToRefs(useTeam);

const workspaceStore = UseWorkspaceStore();
const { getAllWorkspace } = storeToRefs(workspaceStore);

const document = computed(() => {
  return getDocumentByTeam.value.filter((doc) => {
    return doc.title.toLowerCase().includes(searchDoc.value.trim().toLocaleLowerCase());
  });
});

const isOwner = computed(() => {
  const ws = getAllWorkspace.value.find((w) => w.workspace_id == workspace_id.value);
  return ws?.my_role === "owner";
});

async function createDocument() {
  if (!documentName.value) {
    toast.error("Name is required");
    return;
  }
  if (documentName.value.length < 3) {
    toast.error("Name must be at least 3 characters");
    return;
  }

  try {
    loading.value = true;
    const newDoc = await useDocument.createDocument(
      workspace_id.value,
      team_id.value,
      documentName.value
    );
    documentName.value = "";
    showModal.value = false;
    toast.success(newDoc.message);
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
}

async function deleteDocHandling() {
  try {
    loading.value = true;
    const deleteDoc = await useDocument.deleteDocument(
      workspace_id.value,
      team_id.value,
      document_id.value
    );
    deleteModal.value = false;
    toast.success(deleteDoc.message);
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateTitle(docId, title) {
  try {
    const currentDoc = getDocumentByTeam.value.find((doc) => doc.document_id === docId);
    if (currentDoc?.title === title.trim()) return;

    const message = await useDocument.updateTitleDocument(
      workspace_id.value,
      team_id.value,
      docId,
      title.trim()
    );
    if (message) toast.success(message);
  } catch (error) {
    toast.error(error.message);
    await useDocument.getAllDocument(workspace_id.value, team_id.value);
  }
}

async function downloadDocHandling(docId, title) {
  try {
    await useDocument.downloadDocument(
      workspace_id.value,
      team_id.value,
      docId,
      title
    );
  } catch (error) {
    toast.error(error.message);
  }
}

onMounted(async () => {
  await useDocument.getAllDocument(workspace_id.value, team_id.value);
  isLoading.value = false;
});
</script>

<style scoped>
.decorate-container {
  height: 120px;
  background-color: var(--bs-dark);
}

.doc-gradient {
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
}

/* Un-nested for safer CSS compilation compatibility */
.doc-gradient .main {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: var(--bs-info);
  position: absolute;
  top: 0;
  right: -35%;
  filter: blur(30px);
}

.doc-gradient .light {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: color-mix(in srgb, var(--bs-info) 10%, var(--bs-light) 80%);
  position: absolute;
  top: 50px;
  right: -10%;
  filter: blur(20px);
  z-index: 2;
}

/* Added deep selector targeting to override Naive UI card padding cleanly */
:deep(.n-card-cover) {
  overflow: hidden;
}

:deep(.n-card__content) {
  padding: 0 !important;
}

:deep(i.n-base-icon) {
  fill: black !important;
}

:deep(.n-card-header) {
  padding: 16px !important;
  border-bottom: 1px solid var(--bs-border-color);
}

:deep(.n-card__footer) {
  width: 100%;
  padding: 16px !important;
  margin: 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  gap: 10px;
}

.search-input:focus {
  outline: none;
}

.form-control:has(.search-input:focus) {
  outline: 1px solid #171717;
}
</style>
