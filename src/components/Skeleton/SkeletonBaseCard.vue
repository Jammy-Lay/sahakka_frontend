<template>
    <div class="card border-0 rounded-4 p-4 shadow-sm">

        <!-- header: icon + name/owner + menu dot -->
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-3 align-items-center">
                <div class="skeleton" style="width:48px; height:48px; border-radius:10px; flex-shrink:0;"></div>
                <div class="d-flex flex-column gap-2">
                    <div class="skeleton" style="width:120px; height:16px;"></div>
                    <div class="skeleton" style="width:90px; height:12px;"></div>
                </div>
            </div>
            <div class="skeleton" style="width:4px; height:18px; border-radius:4px;"></div>
        </div>

        <!-- stats row -->
        <div class="row g-3 mt-2">
            <div v-for="n in 3" :key="n" class="col-4">
                <div class="skeleton rounded-3" style="height:80px;"></div>
            </div>
        </div>

        <!-- members -->
                <div class="col-6 d-flex align-items-center gap-2 pt-4">
                    <div class="d-flex">
                        <div v-for="n in 3" :key="n" class="skeleton"
                            style="width: 21px; height: 21px; border-radius: 50%; margin-left: -6px"
                            :style="n === 1 ? 'margin-left:0' : 'margin-left:-8px'"></div>
                    </div>
                </div>

        <!-- progress -->
        <div class="mt-3">
            <div class="d-flex justify-content-between mb-2">
                <div class="skeleton" style="width:55px; height:12px;"></div>
                <div class="skeleton" style="width:35px; height:12px;"></div>
            </div>
            <div class="skeleton" style="width:100%; height:7px; border-radius:999px;"></div>
        </div>

    </div>
</template>

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