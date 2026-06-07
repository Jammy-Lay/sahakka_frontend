<template>
  <div>
    <n-card class="rounded-4" :bordered="false" style="width: 400px; padding: 0.75rem">
      <template #cover>
        <div
          class="decorate-container w-100 p-3 position-relative overflow-hidden"
          style="border-radius: 0.75rem"
        >
          <h3 class="text-light fw-normal m-0">Sahakka</h3>
          <h2 class="text-light fw-normal m-0">Document</h2>
          <div class="doc-gradient position-absolute">
            <div class="light"></div>
            <div class="main"></div>
          </div>
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup></script>

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
