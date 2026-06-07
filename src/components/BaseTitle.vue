<template>
    <h4 class="fw-bold ls">{{ title }}</h4>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: "Title",
    },
});
</script>
