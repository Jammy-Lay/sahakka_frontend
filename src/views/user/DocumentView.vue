<template>

  <main class="py-5">

    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-5 ms-auto text-end">
          <n-modal-provider>
            <base-btn @click="showModal = true" class="btn rounded-btn rounded-btn" icon="PlusIcon" btn-name="New document">
            </base-btn>

            <n-modal v-model:show="showModal">
              <document-modal 
                @close="() => showModal = false"
                @create-document="createDocument"
              />
            </n-modal>
          </n-modal-provider>
        </div>
      </div>
      <div class="pt-4"></div>
      <div class="row g-3">
        <div v-for="(doc, index) in getDocumentByTeam" :key="index" class="col-6">
          <document-card 
            :avatar="doc.created_by.avatar" 
            :user-name="doc.created_by.name" 
            :document-title="doc.title"
            :created-at="doc.created_at" 
            :document-id="doc.document_id" 
            @delete-action="deleteDocHandling"
          />
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

  const showModal = ref(false);
  
  const useDocument = useDocumentStore();
  const { getDocumentByTeam } = storeToRefs(useDocument)


  onMounted(async () => {
    await useDocument.getAllDocument(workspace_id, team_id)
    console.log(getDocumentByTeam.value);
  })

  async function createDocument(title) {

    const newDoc = await useDocument.createDocument(workspace_id, team_id, {title});
    // console.log('new ', newDoc);
    showModal.value = false
    if (newDoc) {
      getDocumentByTeam.value.unshift(newDoc.data)
      notify().success(newDoc.message);
      return;
    }
    notify().error(newDoc.message);
  }

  async function deleteDocHandling(docId) {
    const deleteDoc = await useDocument.deleteDocument(workspace_id, team_id, docId);
    if (deleteDoc) {
      const indexofDoc = getDocumentByTeam.value.findIndex(doc => doc.document_id === docId)
      getDocumentByTeam.value.splice(indexofDoc, 1);
      notify().success(deleteDoc);
      return;
    }
    notify().error(deleteDoc);
  }

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

</style>
