<template>
		<router-link :to="{name: 'editor'}" class="text-decoration-none">
      <n-card class="rounded-4" :bordered="false" style="padding: 0.75rem;">
        <template #cover>
          <div class="decorate-container w-100 p-3 position-relative overflow-hidden" style="border-radius: 0.75rem;">
            <div class="doc-gradient position-absolute z-0">
              <div class="light"></div>
              <div class="main"></div>
            </div>
            <div class="h-100 d-flex flex-column justify-content-center">
              <h3 class="text-light fw-normal z-2 position-relative">Sahakka</h3>
              <h2 class="text-light fw-normal z-2 position-relative">Document</h2>
            </div>
          </div>
        </template>
        <div style="height: 1rem;"></div>
        <div class="doc-title d-flex align-items-center justify-content-between">
          <div class="doc-title-1 d-flex gap-2">
                <file color="var(--bs-info)" size="28"/>
            <h4 class="title m-0 fw-semibold">Front End</h4>
          </div>
          <n-icon-wrapper :size="32" :border-radius="999" class="bg-dark">
                <arrow-up-right size="28" />
          </n-icon-wrapper>
        </div>
        <div style="height: 1rem;"></div>
        <div class="doc-user d-flex justify-content-between align-items-center">
          <div class="doc-pfp d-flex align-items-center text-secondary">
            <div class="d-flex gap-2 align-items-center">
              <img src="https://i.pinimg.com/736x/0e/ff/ff/0effff1bae1f8db12601c3f4feb59240.jpg" alt=""
                class="border rounded-circle profile" />
              <h6 class="fw-normal m-0">Jammy</h6>
            </div>
      
                <dot size="24"/>
            <h6 class="fw-normal m-0">{{date}}</h6>
          </div>
          <n-button circle tertiary type="default" size="small">
                <more-vertical-icon size="20"/>
          </n-button>
        </div>
      </n-card>
    </router-link>
</template>

<script setup>
import { ArrowUpRight, Dot, File, MoreVertical, MoreVerticalIcon } from 'lucide-vue-next';

const date = new Intl.DateTimeFormat('en-uk', {dateStyle: 'long'}).format(new Date());

</script>

<style>

.profile {
		width: 40px;
		height: 40px;
}

.decorate-container {
  height: 140px;
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
  z-index: 1;
}

/* Added deep selector targeting to override Naive UI card padding cleanly */

.n-card > .n-card-content {
	padding: 0;
}

:deep(.n-card-cover) {
  overflow: hidden;
}
:deep(.n-card__content) {
  padding: 0 !important;
}
</style>