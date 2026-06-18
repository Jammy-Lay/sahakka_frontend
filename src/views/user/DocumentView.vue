<template>

  <n-modal-provider>

    <n-modal v-model:show="showModal">
      <document-modal @close="showModal = false" @create-document="createDocument" />
    </n-modal>

    <n-modal v-model:show="deleteModal" class="rounded-4">
      <n-card title="Delete document" style="width: 380px">
        <template #header-extra>
          <n-button quaternary circle @click="deleteModal = false">
            <X />
          </n-button>
        </template>
        <div class="mt-4 px-4">
          <p>Are you sure you want to delete?</p>
        </div>
        <template #footer>
          <n-button quaternary class="rounded-btn border w-50">Cancel</n-button>
          <n-button type="error" class="rounded-btn w-50" @click="deleteDocHandling">Delete</n-button>
        </template>
      </n-card>
    </n-modal>

  </n-modal-provider>

  <main class="py-4">

    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-4">
          <h2 class="fw-semibold fs-5 mb-1">{{ getTeamByWorkspace[0]?.title }}</h2>
          <p class="text-secondary fs-13 mb-0">{{ getTeamByWorkspace[0]?.description }}</p>
        </div>
        <div class="col-5 ms-auto text-end d-flex gap-3 align-items-start">
          <div class="form-control rounded-btn d-flex align-items-center">
            <input v-model="searchDoc" type="text" class="search-input shadow-none outline-none border-0 w-100"
              placeholder="Search document">
            <Search color="var(--bs-gray)" class="" />
          </div>
          <base-btn @click="showModal = true" class="btn rounded-btn rounded-btn" icon="PlusIcon"
            btn-name="New document">
          </base-btn>
        </div>
      </div>
      <div class="pt-4"></div>
      <div class="row g-3">
        <div v-if="document.length > 0" v-for="(doc, index) in document" :key="index" class="col-4">
          <document-card :avatar="doc.created_by.avatar" :user-name="doc.created_by.name" :document-title="doc.title"
            :created-at="doc.created_at" :document-id="doc.document_id"
            @delete-action="(docId) => { deleteModal = true; document_id = docId }" @update-title="updateTitle" />
        </div>
        <n-empty v-else description="No Data" class="mt-8"
          style="--n-icon-size: 45px; font-size: 14px" />

      </div>
    </div>
  </main>
</template>

<script setup>
  import BaseBtn from '@/components/BaseBtn.vue';
  import DocumentCard from '@/components/DocumentCard.vue';
  import DocumentModal from '@/components/DocumentModal.vue';
  import { useDocumentStore } from '@/stores/user/document';
  import { useTeamStore } from '@/stores/user/team';
  import { notify } from '@/utils/toast';
  import { Search } from 'lucide-vue-next';
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();

  const workspace_id = route.params.workspace_id;
  const team_id = route.params.team_id;

  const document_id = ref(null);

  const showModal = ref(false);

  const useDocument = useDocumentStore();
  const { getDocumentByTeam } = storeToRefs(useDocument);

  const searchDoc = ref('');
  const document = computed(() => {
    return getDocumentByTeam.value.filter(doc => {
      return doc.title.toLowerCase().includes(searchDoc.value.trim().toLocaleLowerCase())
    })
  })


  const useTeam = useTeamStore();
  const { getTeamByWorkspace } = storeToRefs(useTeam);

  onMounted(async () => {
    await useDocument.getAllDocument(workspace_id, team_id)
    await useTeam.getTeamByWorkspaceStore(workspace_id);
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

</style>
