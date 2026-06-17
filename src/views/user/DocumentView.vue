<template>

  <n-modal-provider>

    <n-modal v-model:show="showModal">
      <document-modal @close="showModal = false" @create-document="createDocument" />
    </n-modal>

    <n-modal v-model:show="deleteModal" class="rounded-4 p-4">
      <n-card style="width: 300px" title="Delete document">
        <template #header-extra>
          <n-button quaternary circle @click="deleteModal = false">
            <X/>
          </n-button>
        </template>
        <div class="my-4">
          <p class="border rounded-4 p-3 text-danger fw-bold" style="background-color: #EFF0ED;">Are you sure you want to delete?</p>
        </div>
        <template #footer class="">
          <n-button quaternary class="rounded-btn">Cancel</n-button>
          <n-button type="error" class="rounded-btn" @click="deleteDocHandling">Delete</n-button>
        </template>
      </n-card>
    </n-modal>
  </n-modal-provider>

  <main class="py-4">

    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-5 ms-auto text-end d-flex gap-3">
          <input type="text" class="form-control rounded-btn shadow-none">
          <base-btn @click="showModal = true" class="btn rounded-btn rounded-btn" icon="PlusIcon"
            btn-name="New document">
          </base-btn>
        </div>
      </div>
      <div class="pt-4"></div>
      <div class="row g-3">
        <div v-for="(doc, index) in getDocumentByTeam" :key="index" class="col-4">
          <document-card :avatar="doc.created_by.avatar" :user-name="doc.created_by.name" :document-title="doc.title"
            :created-at="doc.created_at" :document-id="doc.document_id" @delete-action="(docId) => { deleteModal = true; document_id = docId}"
            @update-title="updateTitle" />
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
  import BaseBtn from '@/components/BaseBtn.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import DocumentModal from '@/components/DocumentModal.vue';
  import { useDocumentStore } from '@/stores/user/document';
  import { notify } from '@/utils/toast';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();

  const workspace_id = route.params.workspace_id;
  const team_id = route.params.team_id;

  const document_id = ref(null);

  const showModal = ref(false);

  const useDocument = useDocumentStore();
  const { getDocumentByTeam } = storeToRefs(useDocument)


  onMounted(async () => {
    await useDocument.getAllDocument(workspace_id, team_id)
  })

  async function createDocument(title) {

    const newDoc = await useDocument.createDocument(workspace_id, team_id, title);
    showModal.value = false;
    if (newDoc) {
      getDocumentByTeam.value.unshift(newDoc.data);
      notify().success(newDoc.message);
      return;
    }
    notify().error(newDoc.message);

  }

  async function deleteDocHandling() {
    const deleteDoc = await useDocument.deleteDocument(workspace_id, team_id, document_id.value);
    deleteModal.value = false;
    if (deleteDoc.result) {
      const indexofDoc = getDocumentByTeam.value.findIndex(doc => doc.document_id === document_id.value)
      getDocumentByTeam.value.splice(indexofDoc, 1);
      return notify().success(deleteDoc.message);
    }
    notify().error(deleteDoc.message);
  }

  async function updateTitle(docId, title) {
    const updateTitle = await useDocument.updateTitleDocument(workspace_id, team_id, docId, title);
    if (updateTitle) {
      return notify().success(updateTitle);
    }
    notify().error(updateTitle);
  }

  const deleteModal = ref(false);

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
    padding: 0 0 10px !important;
    border-bottom: 1px solid var(--bs-border-color);
  }

  :deep(.n-card__footer) {
    padding: 10px 0 0 !important;
    text-align: end;
  }

</style>
