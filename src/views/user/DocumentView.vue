<template>
  <div class="row">
    <div class="col-4">
      <document-card/>
    </div>
    <div class="col-4">
      <document-card/>
    </div>
    <div class="col-4">
      <document-card/>
    </div>
  </div>
</template>

<script setup>
import DocumentCard from '@/components/DocumentCard.vue';

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
