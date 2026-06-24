<script setup>
import { ref } from 'vue';

const inputTitle = ref('')
</script>

<template>
  <n-card style="width: 380px" title="Create new document" class="rounded-4" :bordered="false" size="small" role="dialog" aria-modal="true">
    <template #header-extra>
      <!-- <n-button @click="$emit('close')" quaternary circle>
        <x/>
      </n-button> -->
       <n-button
            text
            size="small"
            @click="$emit('close')"
            class="hover-circle p-1 rounded-circle"
          >
            <X size="18" />
          </n-button>
    </template>
    <div class="px-3">
      <label for="" class="mt-3">Document title</label>
      <input v-model="inputTitle" type="text" class="form-control mt-2 rounded-btn shadow-none w-100" placeholder="Document title">
    </div>
    <template #footer>
      <!-- <n-button class="px-3 py-2 rounded-btn" quaternary :bordered="false" @click="$emit('close')">Close</n-button> -->
      <n-button class="px-3 py-3 rounded-btn bg-btn w-100" quaternary :bordered="false" @click="$emit('createDocument', inputTitle)">Create Document</n-button>
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
.form-control {
  font-size: small;
}
.form-control:focus {
  --primary: #171717;
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
  border-color: var(--primary);
  outline: 0;
  /* box-shadow: 0 0 0 .25rem hsl(from var(--primary) h s l / 20%) !important; */
}
</style>