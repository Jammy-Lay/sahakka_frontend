<template>
    <div>
        <div class="row bg-body mb-3 pb-3">
            <div class="col-4">
                <div class="d-flex align-items-center gap-2 pt-3">
                    <div class="skeleton" style="width:30px; height:35px; border-radius:6px;"></div>
                    <div class="skeleton" style="width:110px; height:35px;"></div>
                </div>
            </div>
            <div class="col-8 d-flex justify-content-end">
                <div class="skeleton" style="width:100%; max-width:320px; height:36px; border-radius:14px;"></div>
            </div>
        </div>
        <div class="row">

            <div class="row g-3 mt-1">
                <div v-for="n in 8" :key="n" class="col-12 col-md-6 col-lg-4 col-xl-3">
                    <SkeletonBaseCardTeam />
                </div>
            </div>
        </div>

        <!-- pagination -->
        <div class="mt-3 d-flex justify-content-end gap-2">
            <div v-for="n in 4" :key="n" class="skeleton" style="width:32px; height:32px; border-radius:8px;">
            </div>
        </div>
    </div>
</template>

<script setup>
import SkeletonBaseCardTeam from "@/components/Skeleton/SkeletonBaseCardTeam.vue";
</script>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* Base skeleton style */
.skeleton {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
    border-radius: 8px;
}

</style>