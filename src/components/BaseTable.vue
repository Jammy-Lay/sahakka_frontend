<template>
  <div class="table-responsive border rounded-3 bg-white shadow-sm">
    <table class="table table-hover align-middle mb-0 actual-card">
      <thead class="table-light">
        <tr>
          <th
            v-for="th in column"
            :key="th.key"
            class="py-3 px-4 text-secondary text-uppercase fw-bold text-start align-middle"
          >
            {{ th.label }}
          </th>
          <th
            class="py-3 pe-7 text-secondary text-uppercase fw-bold align-middle text-end actions-th"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="loading">
          <tr v-for="n in skeletonsToRender" :key="'skeleton-row-' + n">
            <td
              v-for="col in column"
              :key="'skeleton-col-' + col.key"
              class="px-4"
            >
              <div class="skeleton-shimmer skeleton-text"></div>
            </td>
            <td class="pe-5">
              <div class="d-flex gap-5">
                <div class="skeleton-shimmer skeleton-btn"></div>
                <div class="skeleton-shimmer skeleton-btn"></div>
              </div>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr v-for="row in rows" :key="row.id">
            <td v-for="col in column" :key="col.key" class="px-4">
              <slot :name="`col-${col.key}`" :value="row[col.key]">
                <span class="text-dark fw-medium">{{ row[col.key] }}</span>
              </slot>
            </td>
            <td class="px-4">
              <div class="d-flex justify-content-center gap-2">
                <button
                  class="btn border-0"
                  
                  @click="$emit('edit', row)"
                >
                  <SquarePen />
                </button>
                <button
                  class="btn border-0"
                  @click="$emit('delete', row)"
                >
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDeleteArticleStore } from "@/stores/deleteArticle";
let deleteArt = useDeleteArticleStore();

const props = defineProps({
  rows: { type: Array, default: () => [] },
  column: { type: Array, default: () => [] },
  loading: Boolean,
  itemPerPage: Number,
  pagination: Object,
});

defineEmits(["delete", "edit"]);

const skeletonsToRender = computed(() => {
  const p = props.pagination;
  const perPage = props.itemPerPage || 3;

  if (!p || p.totalItems === 0) return perPage;

  const itemsBeforeThisPage = (p.currentPage - 1) * perPage;
  const itemsRemaining = p.totalItems - itemsBeforeThisPage;

  // Logic to show exactly the remaining items, but at least 1
  return Math.min(perPage, Math.max(1, itemsRemaining));
});
</script>

<style scoped>
.actions-th {
  width: 120px;
  white-space: nowrap;
}

/* The Shimmer Base */
.skeleton-shimmer {
  background: #eee;
  background: linear-gradient(90deg, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 4px;
}

.skeleton-text {
  height: 12px;
  width: 100%;
}

.skeleton-btn {
  height: 30px;
  width: 30px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Ensure row height doesn't change when loading finishes */
tr {
  height: 75px;
}

.actual-card {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
