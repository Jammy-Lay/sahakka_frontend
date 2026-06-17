<template>
  <router-link :to="{ name: 'editor', params: { document_id: documentId } }" class="text-decoration-none">
    <n-card class="rounded-4 h-100" :bordered="false" style="padding: 0.75rem;">
      <template #cover>
        <div class="decorate-container w-100 p-3 overflow-hidden" style="border-radius: 0.75rem;"
          :style="{ backgroundColor: getSequentialColor(documentId) }">
          <div class="h-100 position-relative d-flex flex-column align-items-center justify-content-center">
            <!-- <h3 class="fw-bold z-2 position-relative"
              :style="{ color: getSequentialColor(documentId, undefined, 50) }">{{ userName }}</h3>
            <h2 class="fw-normal fst-italic z-2 position-relative"
              :style="{ color: getSequentialColor(documentId, undefined, 50) }">Document</h2> -->
            <file-text class="z-2 position-absolute icon-doc-1" size="70"
              :fill="getSequentialColor(documentId, undefined, 0)"
              :color="getSequentialColor(documentId, undefined, 50)" />
            <file-text class="position-absolute icon-doc z-1" size="70"
              :color="getSequentialColor(documentId, undefined, 50)" />
          </div>
        </div>
      </template>
      <div style="height: 1rem;"></div>
      <div class="doc-title d-flex align-items-center justify-content-between">
        <div class="doc-title-1 d-flex gap-2 w-100 align-items-center">
          <!-- <file color="var(--bs-info)" size="26" /> -->
          <h5 ref="editTitle" :contenteditable="edit" @dblclick.prevent="editAction" @keydown="lineBreak" @click.prevent
            class="title w-100 m-0 fw-semibold">
            {{ documentTitle.length > 20 && !edit ? documentTitle.substring(0, 20) + '...' : documentTitle }}
          </h5>
        </div>
        <base-btn v-if="edit" class="btn rounded-btn" btn-name="Rename"
          @click.prevent="$emit('updateTitle', documentId, editTitle.innerText, updateTitleHandling(action))" />
        <!-- <n-icon-wrapper v-else :size="30" class="bg-dark w-fit h-fit p-1 rounded-circle">
          <arrow-up-right size="20" />
        </n-icon-wrapper> -->
      </div>
      <div style="height: 1rem;"></div>
      <div class="doc-user d-flex justify-content-between align-items-center">
        <div class="doc-pfp d-flex align-items-center text-secondary gap-2 flex-wrap">
          <div class="d-flex gap-2 align-items-center">
            <img :src="avatar" alt="" class="border rounded-circle profile" />
            <h6 class="fw-normal m-0 text-nowrap">{{ userName }}</h6>
            <dot size="24" />
          </div>

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

            <n-button class="rounded-3 fw-bold d-flex justify-content-start px-2  " type="error" quaternary
              @click.prevent="$emit('deleteAction', documentId)">
              <template #icon>
                <trash2-icon size="16" />
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
  import { ArrowUpRight, BrushIcon, Dot, File, FileText, MoreVerticalIcon, Trash2Icon, } from 'lucide-vue-next';
  import { nextTick, ref } from 'vue';
  import BaseBtn from './BaseBtn.vue';

  const date = (date) => new Date(date).toLocaleDateString('en-GB', { dateStyle: 'medium' })

  defineProps({
    documentTitle: String,
    documentId: Number,
    userName: String,
    userId: Number,
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
    const hue = (id * 10) % 360;
    return `hsl(from hsl(${hue}, 83%, 85%) h s calc(l ${operation} ${light}))`;
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
    scale: .9;
    display: block;
    box-sizing: border-box;
  }

  .icon-doc-1 {
    right: 50%;
    transform: translateX(20px);
    rotate: -20deg;
  }

  .icon-doc {
    left: 50%;
    transform: translateX(-20px);
    rotate: 20deg;
  }


</style>