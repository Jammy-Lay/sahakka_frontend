<template>
    <h4 class="fw-bold ls py-3">{{ title }}</h4>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: "Title",
    },
});
</script>
