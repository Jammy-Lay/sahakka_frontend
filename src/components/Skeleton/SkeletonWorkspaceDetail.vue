<template>
    <div class="container-fluid">
        <!-- back button -->
        <div class="skeleton mb-3" style="width: 160px; height: 38px; border-radius: 8px"></div>

        <div class="row">
            <!-- ── Left Panel ── -->
            <div class="col-xl-8">
                <div class="row g-3">
                    <!-- BaseCard skeleton -->
                    <div class="col-12">
                        <SkeletonBaseCard />
                    </div>

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

            <!-- ── Right Panel ── -->
            <div class="col-xl-4">
                <div class="row g-4 pt-4">
                    <!-- title -->
                    <div class="col-12">
                        <div class="d-flex align-items-center gap-2">
                            <div class="skeleton" style="width: 30px; height: 30px; border-radius: 6px"></div>
                            <div class="skeleton" style="width: 100px; height: 26px"></div>
                        </div>
                    </div>

                    <!-- recent teams table card -->
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 p-4">
                            <div class="mb-3">
                                <div class="skeleton mb-2" style="width: 210px; height: 18px"></div>
                                <div class="skeleton" style="width: 90px; height: 12px"></div>
                            </div>
                            <!-- table header -->
                            <div class="d-flex gap-3 px-1 mb-2">
                                <div class="skeleton" style="width: 100px; height: 12px"></div>
                                <div class="skeleton ms-auto" style="width: 60px; height: 12px"></div>
                                <div class="skeleton" style="width: 60px; height: 12px"></div>
                            </div>
                            <!-- table rows -->
                            <div v-for="n in 5" :key="n" class="d-flex align-items-center gap-2 py-2"
                                :style="n < 5 ? 'border-bottom: 1px solid rgba(0,0,0,0.06)' : ''">
                                <div class="skeleton"
                                    style="width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0"></div>
                                <div class="d-flex flex-column gap-1 flex-grow-1">
                                    <div class="skeleton" style="width: 110px; height: 12px"></div>
                                    <div class="skeleton" style="width: 75px; height: 10px"></div>
                                </div>
                                <div class="skeleton" style="width: 50px; height: 20px; border-radius: 20px"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SkeletonBaseCard from "./SkeletonBaseCard.vue";
import SkeletonBaseCardTeam from "./SkeletonBaseCardTeam.vue";
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
