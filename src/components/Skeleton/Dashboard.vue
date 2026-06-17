<template>
    <div class="pt-4">

        <!-- header -->
        <div class="d-flex align-items-center justify-content-between mb-3 pb-3">
            <div class="skeleton" style="width: 120px; height: 28px;"></div>
            <div class="skeleton" style="width: 80px; height: 26px; border-radius: 20px;"></div>
        </div>

        <!-- stat cards row -->
        <div class="row g-4">
            <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-xl-3">
                <div
                    class="dashboard-card rounded-4 border-0 shadow-sm d-flex justify-content-between align-items-start">
                    <div class="d-flex flex-column gap-2">
                        <div class="skeleton" style="width: 80px; height: 12px;"></div>
                        <div class="skeleton" style="width: 60px; height: 24px;"></div>
                        <div class="skeleton" style="width: 100px; height: 12px;"></div>
                    </div>
                    <div class="skeleton" style="width: 48px; height: 48px; border-radius: 14px;"></div>
                </div>
            </div>
        </div>

        <div class="row g-4 mt-1">

            <!-- project overview card -->
            <div class="col-12 col-xl-6">
                <div class="card p-4 rounded-4 border-0 shadow-sm h-100">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="skeleton" style="width: 140px; height: 20px;"></div>
                        <div class="skeleton" style="width: 80px; height: 14px;"></div>
                    </div>
                    <div class="project-overview">
                        <!-- donut -->
                        <div class="donut-wrap">
                            <div class="skeleton" style="width: 140px; height: 140px; border-radius: 50%;"></div>
                        </div>
                        <!-- right side -->
                        <div class="overview-content">
                            <div class="overview-stats">
                                <div v-for="n in 3" :key="n" class="overview-stat">
                                    <div class="skeleton mb-2" style="width: 40px; height: 18px; margin: 0 auto;"></div>
                                    <div class="skeleton" style="width: 60px; height: 10px; margin: 0 auto;"></div>
                                </div>
                            </div>
                            <div class="overview-bars">
                                <div v-for="n in 3" :key="n" class="overview-bar-item">
                                    <div class="d-flex justify-content-between mb-1">
                                        <div class="skeleton" style="width: 80px; height: 12px;"></div>
                                        <div class="skeleton" style="width: 30px; height: 12px;"></div>
                                    </div>
                                    <div class="skeleton" style="width: 100%; height: 8px; border-radius: 4px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- recent users table card -->
            <div class="col-12 col-xl-6">
                <div class="card p-4 rounded-4 border-0 shadow-sm">
                    <div class="mb-3">
                        <div class="skeleton mb-2" style="width: 180px; height: 20px;"></div>
                        <div class="skeleton" style="width: 120px; height: 12px;"></div>
                    </div>
                    <!-- table header -->
                    <div class="d-flex gap-3 mb-2 px-1">
                        <div class="skeleton" style="width: 80px; height: 12px;"></div>
                        <div class="skeleton" style="width: 80px; height: 12px;"></div>
                        <div class="skeleton ms-auto" style="width: 60px; height: 12px;"></div>
                    </div>
                    <!-- table rows -->
                    <div v-for="n in 5" :key="n" class="d-flex align-items-center gap-3 py-2"
                        :style="n < 5 ? 'border-bottom: 0.5px solid #f0f0f0' : ''">
                        <div class="skeleton" style="width: 32px; height: 32px; border-radius: 50%;"></div>
                        <div class="d-flex flex-column gap-1 flex-grow-1">
                            <div class="skeleton" style="width: 100px; height: 12px;"></div>
                            <div class="skeleton" style="width: 140px; height: 10px;"></div>
                        </div>
                        <div class="skeleton" style="width: 60px; height: 22px; border-radius: 20px;"></div>
                    </div>
                </div>
            </div>

            <!-- engagement card -->
            <div class="col-12">
                <div class="engagement-card">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="skeleton" style="width: 200px; height: 18px;"></div>
                        <div class="skeleton" style="width: 90px; height: 30px; border-radius: 8px;"></div>
                    </div>
                    <div class="d-flex gap-4 mb-4">
                        <div class="d-flex flex-column gap-2">
                            <div class="skeleton" style="width: 80px; height: 12px;"></div>
                            <div class="skeleton" style="width: 120px; height: 28px;"></div>
                        </div>
                        <div class="d-flex flex-column gap-2">
                            <div class="skeleton" style="width: 80px; height: 12px;"></div>
                            <div class="skeleton" style="width: 120px; height: 28px;"></div>
                        </div>
                    </div>
                    <!-- chart area -->
                    <div class="skeleton" style="width: 100%; height: 220px; border-radius: 12px;"></div>
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
}

.skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite linear;
}

.dashboard-card {
    background: #fff;
    min-height: 135px;
    padding: 22px;
}

.project-overview {
    align-items: center;
    display: grid;
    gap: 28px;
    grid-template-columns: 170px 1fr;
}

.donut-wrap {
    display: flex;
    justify-content: center;
}

.overview-content {
    display: flex;
    flex-direction: column;
    gap: 22px;
    min-width: 0;
}

.overview-stats {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.overview-stat {
    background: #f8fafc;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
}

.overview-bars {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.overview-bar-item span {
    font-size: 12px;
}

.engagement-card {
    background: #fff;
    border: 0.5px solid #e3e3e3;
    border-radius: 16px;
    padding: 20px 24px;
}

@media (max-width: 575px) {
    .project-overview {
        grid-template-columns: 1fr;
    }

    .overview-stats {
        grid-template-columns: 1fr;
    }
}
</style>