<template>
  <router-link :to="{ name: 'editor', params: { document_id: documentId } }" class="text-decoration-none">
    <n-card class="rounded-4" :bordered="false" style="padding: 0.75rem;">
      <template #cover>
        <div class="decorate-container w-100 p-3 overflow-hidden" style="border-radius: 0.75rem;"
          :style="{ backgroundColor: getSequentialColor(documentId) }">
          <div class="h-100 d-flex flex-column justify-content-center">
            <h3 class="fw-normal z-2 position-relative"
              :style="{ color: getSequentialColor(documentId, undefined, 30) }">Sahakka</h3>
            <h2 class="fw-normal z-2 position-relative"
              :style="{ color: getSequentialColor(documentId, undefined, 30) }">Document</h2>
          </div>
        </div>
      </template>
      <div style="height: 1rem;"></div>
      <div class="doc-title d-flex align-items-center justify-content-between">
        <div class="doc-title-1 d-flex gap-2 w-100 align-items-center">
          <file color="var(--bs-info)" size="26" />
          <h5 ref="editTitle" :contenteditable="edit" @dblclick.prevent="editAction" @keydown="lineBreak" @click.prevent
            class="title w-100 m-0 fw-semibold">
            {{ documentTitle.length > 10 ? documentTitle.substring(0, 10) + '...' : documentTitle }}</h5>
        </div>
        <base-btn v-if="edit" class="btn rounded-btn" btn-name="Rename"
          @click.prevent="$emit('updateTitle', documentId, editTitle.innerText, updateTitleHandling(action))" />
        <n-icon-wrapper v-else :size="32" :border-radius="999" class="bg-dark px-1">
          <arrow-up-right size="28" />
        </n-icon-wrapper>
      </div>
      <div style="height: 1rem;"></div>
      <div class="doc-user d-flex justify-content-between align-items-center">
        <div class="doc-pfp d-flex align-items-center text-secondary">
          <div class="d-flex gap-2 align-items-center">
            <img :src="avatar" alt="" class="border rounded-circle profile" />
            <h6 class="fw-normal m-0">{{ userName }}</h6>
          </div>

          <dot size="24" />
          <h6 class="fw-normal m-0">{{ date(createdAt) }}</h6>
        </div>
        <n-popover placement="bottom-end" trigger="click" :show-arrow="false" @update:show="" class="p-2"
          style="border-radius: 12px;">
          <template #trigger>
            <n-button quaternary circle @click.prevent class="px-2"><more-vertical-icon size="20" /></n-button>
          </template>

          <div class="d-flex flex-column">
            <n-button class="rounded-3 fw-bold d-flex justify-content-start px-2  " @click.prevent="editAction"
              quaternary>
              <template #icon>
                <brush-icon size="16" />
              </template>
              <span>Rename</span>
            </n-button>

            <n-button class="rounded-3 fw-bold d-flex justify-content-start px-2  " type="error" quaternary @click.prevent="$emit('deleteAction', documentId)">
              <template #icon>
                <trash2-icon size="16"/>
              </template>
              <span>Delete</span>
            </n-button>
          </div>
        </n-popover>
      </div>
    </n-card>
  </router-link>

</template>

<script setup>
  import { ArrowUpRight, BrushIcon, Dot, File, MoreVerticalIcon, Trash2Icon, } from 'lucide-vue-next';
  import { nextTick, ref } from 'vue';
  import BaseBtn from './BaseBtn.vue';

  const date = (date) => new Date(date).toLocaleDateString('en-GB', { dateStyle: 'medium' })
  
  defineProps({
    documentTitle: String,
    documentId: Number,
    userName: String,
    userId: String,
    avatar: String,
    createdAt: String
  })

  /**
   * This function generate color from data id
   * @param { number } id 
   * @param { "-" | "+" } operation
   * @param { undefined } operation
   * @param { number } lightReduce 
   */
  function getSequentialColor(id, operation = '-', light = 0) {
    // Multiply by a large prime number to scatter adjacent IDs far apart
    const hue = (id * 200) % 360;
    return `hsl(from hsl(${hue}, 83%, 80%) h s calc(l ${operation} ${light}))`;
  }


  const edit = ref(false);
  const editTitle = ref(null);

  async function editAction() {
    if (!edit.value) {
      edit.value = !edit.value;
    }

    await nextTick();

    if (edit.value) {
      editTitle.value.focus();

      const range = document.createRange();
      range.selectNodeContents(editTitle.value);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function lineBreak(e) {
    if (e.key === 'Enter') {
      editTitle.value.blur()
      edit.value = false;
      window.getSelection().removeAllRanges();
    }
  }

  function updateTitleHandling() {
    editTitle.value.blur()
    edit.value = false;
    window.getSelection().removeAllRanges();
  }

</script>

<style>

  .profile {
    width: 30px;
    height: 30px;
  }

  .decorate-container {
    height: 140px;
    /* background-color: var(--bs-dark); */
  }

  .doc-gradient {
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
  }

  /* Added deep selector targeting to override Naive UI card padding cleanly */

  .n-card>.n-card-content {
    padding: 0;
  }

  :deep(.n-card-cover) {
    overflow: hidden;
  }

  :deep(.n-card__content) {
    padding: 0 !important;
  }

  h5.title:focus {
    width: fit-content !important;
    max-width: 150px;
    display: inline-block;
    overflow: hidden;
    text-wrap: nowrap;
    outline: 1px solid var(--bs-dark);
    background-color: hsl(from var(--bs-gray) h s l / 0.2);
    border-radius: 8px;
    padding: 2px 4px;
    scale: .9;
  }


</style>