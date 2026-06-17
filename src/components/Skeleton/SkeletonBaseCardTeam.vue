<template>
    <div class="card border-0 shadow-sm rounded-4 h-100">
        <div class="card-body">
            <!-- workspace row -->
            <div class="d-flex gap-2 pb-2 mb-3 border-bottom border-2">
                <div class="skeleton" style="width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0"></div>
                <div class="d-flex flex-column gap-1">
                    <div class="skeleton" style="width: 60px; height: 10px"></div>
                    <div class="skeleton" style="width: 100px; height: 13px"></div>
                </div>
            </div>

            <!-- title -->
            <div class="d-flex gap-2 align-items-center mb-2">
                <div class="skeleton" style="width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0"></div>
                <div class="skeleton" style="width: 140px; height: 16px"></div>
            </div>

            <!-- description -->
            <div class="d-flex flex-column gap-1 ms-1 mt-2 mb-3">
                <div class="skeleton" style="width: 100%; height: 12px"></div>
                <div class="skeleton" style="width: 75%; height: 12px"></div>
            </div>

            <!-- progress -->
            <div class="d-flex justify-content-between mb-1">
                <div class="skeleton" style="width: 55px; height: 12px"></div>
                <div class="skeleton" style="width: 35px; height: 12px"></div>
            </div>
            <div class="skeleton mb-3" style="width: 100%; height: 8px; border-radius: 999px"></div>

            <!-- owner & members -->
            <div class="row d-flex justify-content-between align-items-center mb-3">
                <!-- owner -->
                <div class="col-6 d-flex align-items-center gap-2">
                    <div class="skeleton" style="width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0"></div>
                    <div class="d-flex flex-column gap-1" style="min-width: 0">
                        <div class="skeleton" style="width: 35px; height: 10px"></div>
                        <div class="skeleton" style="width: 70px; height: 12px"></div>
                    </div>
                </div>

                <!-- members -->
                <div class="col-6 d-flex align-items-center gap-2">
                    <div class="d-flex">
                        <div v-for="n in 3" :key="n" class="skeleton"
                            style="width: 21px; height: 21px; border-radius: 50%; margin-left: -6px"
                            :style="n === 1 ? 'margin-left:0' : 'margin-left:-8px'"></div>
                    </div>
                </div>
            </div>
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
