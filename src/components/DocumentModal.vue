<script setup>
import { ref } from 'vue';

const inputTitle = ref('')
</script>

<template>
  <n-card style="width: 600px" title="Create new document" class="rounded-4 p-3" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <template #header-extra>
      <n-button @click="$emit('close')" quaternary circle>
        <x/>
      </n-button>
    </template>
    <label for="" class="mt-3">Document title</label>
    <input v-model="inputTitle" type="text" class="form-control mt-3" placeholder="Document title">
    <template #footer>
      <div class="d-flex justify-content-end gap-2">
        <n-button class="px-3 py-2 rounded-btn" quaternary :bordered="false" @click="$emit('close')">Close</n-button>
        <n-button class="px-3 py-2 rounded-btn bg-btn" quaternary :bordered="false" @click="$emit('createDocument', inputTitle)">Create Document</n-button>
      </div>
    </template>
  </n-card>
</template>

<style scoped>

:deep(.n-card-header) {
  padding: 0 !important;
}
:deep(.n-card__footer) {
  padding: 0 !important;
  margin-top: 20px;
}
.form-control:focus {
  --primary: #171717;
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
  border-color: var(--primary);
  outline: 0;
  box-shadow: 0 0 0 .25rem hsl(from var(--primary) h s l / 20%) !important;
}
</style>