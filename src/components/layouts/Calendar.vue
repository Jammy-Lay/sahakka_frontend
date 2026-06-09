<template>
  <div class="py-3 pe-3 bg-body">
    <div class="py-2 pe-2">
      <VCalendar
        v-model="selectedDate"
        expanded
        title-position="left"
        :attributes="attrs"
        :masks="{ weekdays: 'WWW' }"
      >
        <template #footer>
          <n-divider style="margin: 10px 0; --n-color: #e4e4e7" />
          <div
            class="d-flex align-items-center justify-content-between bg-white px-4 pb-2"
            style="border-radius: 16px;"
          >
            <p class="mb-0 fs-17">Time</p>
            <p class="mb-0 fs-16 rounded-pill bg-accent" style="padding: 5px 12px;">
              {{ currentTime }}
            </p>
          </div>
        </template>
      </VCalendar>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Calendar as VCalendar } from "v-calendar";
import "v-calendar/style.css";

const selectedDate = ref(new Date());
const currentTime = ref("");

const attrs = ref([
  {
    highlight: {
      color: "gray",
      fillMode: "solid",
    },
    dates: new Date(),
  },
]);

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

let timer;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
:deep(.vc-container) {
  border: none !important;
  box-shadow: none !important;
  width: 100% !important;
  border-radius: 16px;
}

:deep(.vc-header) {
  margin-bottom: 15px;
}

:deep(.vc-title) {
  font-size: 18px !important;
  background-color: transparent !important;
  font-weight: 600 !important;
}

:deep(.vc-weekday) {
  font-size: 13px !important;
  color: #a3a3a3 !important;
  font-weight: 500 !important;
  text-transform: uppercase;
}

:deep(.vc-weeks) {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

:deep(.vc-week) {
  min-height: unset !important;
}

:deep(.vc-day-content) {
  font-size: 18px !important;
  font-weight: 400 !important;
  height: 35px !important;
  width: 35px !important;
}

:deep(.vc-day.is-not-in-month) {
  visibility: hidden !important;
}

:deep(.vc-week:last-child) {
  display: none !important;
}

:deep(.vc-arrow) {
  border-radius: 8px !important;
  background-color: transparent !important;
  color: #171717 !important;
}

:deep(.vc-highlight) {
  width: 35px !important;
  height: 35px !important;
  border-radius: 50% !important;
  background-color: #e3e3e3 !important;
  color: #171717 !important;
}

:deep(.vc-day-content.vc-focusable) {
  color: #171717 !important;
}

:deep(.vc-nav-item.is-active) {
  color: white !important;
  background-color: #171717 !important;
  font-weight: 500 !important;
}

:deep(.vc-nav-item) {
  color: #171717 !important;
  font-weight: 500 !important;
}

:deep(.vc-nav-item:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.vc-day-content:focus) {
  box-shadow: 0 0 0 1px #a3a3a3 !important;
}
</style>
