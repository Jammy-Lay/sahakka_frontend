<template>

  <n-popover placement="bottom-end" trigger="click" :show-arrow="false" :show="show" class="p-2 rounded-4">
    <template #trigger>
      <n-button quaternary @click.prevent="show = !show" class="px-2 rounded-4 fw-semibold role" strong secondary :type="type">{{ myRole }}</n-button>
    </template>

    <div class="d-flex flex-column gap-2">
      <n-button v-for="role in getRole" class="rounded-3 fw-bold d-flex justify-content-start px-2" strong secondary :type="role.type" @click="$emit('changeRole', userId, role.role, role.fn)">
        <div class="dot rounded-circle" :class="role.style"></div>
        <span>{{ role.role }}</span>
      </n-button>
    </div>
  </n-popover>

</template>

<script setup>
import { ref } from 'vue';

defineProps({
  myRole: String,
  userId: Number
})
const show = ref(false);
const type = ref('Success');

const getRole = [
  { role: 'Moderator', fn: () => { updateRole('warning') }, style: 'moderator', type: 'warning' },
  { role: 'Member', fn: () => { updateRole('info') }, style: 'member', type: 'info' }
];

const updateRole = (t) => {
  show.value = false;
  type.value = t
}

</script>

<style scoped>

.dot {
  --size: 8px;
  width: var(--size);
  height: var(--size);
  margin-right: 4px;
}

.role {
  text-transform: capitalize;
}

.moderator {
  background-color: #f09f2d;
}

.member {
  background-color: #1682ee;
}

</style>