<template>
  <nav aria-label="Page navigation" class="d-flex align-items-center justify-content-between mt-4 px-2">
    <div class="text-secondary small fw-medium">
      Showing <span class="text-dark">{{ from }}</span> to 
      <span class="text-dark">{{ to }}</span> of 
      <span class="text-dark">{{ totalItems }}</span> entries
    </div>

    <ul class="pagination pagination-modern mb-0">
      <li class="page-item" :class="{ disabled: !hasPreviousPage }">
        <a
          href="#"
          @click.prevent="emit('changePage', currentPage - 1)"
          class="page-link shadow-sm"
        >
          <i class="bi bi-chevron-left small"></i>
          <span class="ms-1 d-none d-sm-inline">Previous</span>
        </a>
      </li>

      <li
        class="page-item mx-1"
        v-for="value in totalPages"
        :key="value"
        :class="{ active: value === currentPage }"
      >
        <a 
          class="page-link rounded-circle border-0 shadow-sm" 
          @click.prevent="emit('changePage', value)" 
          href="#"
        >
          {{ value }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: !hasNextPage }">
        <a
          class="page-link shadow-sm"
          href="#"
          @click.prevent="emit('changePage', currentPage + 1)"
        >
          <span class="me-1 d-none d-sm-inline">Next</span>
          <i class="bi bi-chevron-right small"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
  hasNextPage: Boolean,
  hasPreviousPage: Boolean,
  totalItems: Number,   
  itemPerPage: Number  
});

const emit = defineEmits(["changePage"]);

// CALCULATE THE "FROM" NUMBER
const from = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.itemPerPage + 1;
});

// CALCULATE THE "TO" NUMBER
const to = computed(() => {
  const currentMax = props.currentPage * props.itemPerPage;
  return Math.min(currentMax, props.totalItems);
});
</script>

<style scoped>
.pagination-modern .page-link {
  color: #555;
  background-color: #fff;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.pagination-modern .rounded-circle {
  width: 38px;
  height: 38px;
  padding: 0;
}

.pagination-modern .page-item.active .page-link {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}

.pagination-modern .page-item.disabled .page-link {
  color: #ced4da;
  pointer-events: none;
  background-color: #fff;
  border-color: #f1f3f5;
  box-shadow: none !important;
}

.pagination-modern .page-item:first-child .page-link,
.pagination-modern .page-item:last-child .page-link {
  border-radius: 20px;
}
</style>