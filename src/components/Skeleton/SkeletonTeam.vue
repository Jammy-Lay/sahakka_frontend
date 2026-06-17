<template>
    <div class="container-fluid">
        <!-- back button -->
        <div class="skeleton mb-3" style="width: 160px; height: 38px; border-radius: 8px"></div>

        <div class="row">
            <!-- ── Left Panel ── -->
            <div class="col-xl-3">
                    <!-- Teams section -->
                    <div class="col-12">
                        <div class="skeleton mt-3 mb-3" style="width: 80px; height: 28px"></div>
                        <div class="row g-3 mt-1">
                            <div v-for="n in 4" :key="n" class="col-12 col-lg-6">
                                <SkeletonBaseCardTeam />
                            </div>
                        </div>
                    </div>
                </div>
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

.skeleton {
    position: relative;
    overflow: hidden;
    background: #e2e2e2;
    border-radius: 8px;
    flex-shrink: 0;
}

.skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
}
</style>
