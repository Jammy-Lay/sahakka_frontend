<template>
    <div>

        <!-- header -->
        <div class="d-flex align-items-center gap-2 mb-1 pt-3">
            <div class="skeleton" style="width: 30px; height: 30px; border-radius: 6px;"></div>
            <div class="skeleton" style="width: 120px; height: 28px;"></div>
        </div>

        <!-- tabs -->
        <div class="d-flex gap-3 mt-3 mb-1 tab-row">
            <div v-for="n in 4" :key="n" class="skeleton" style="width: 90px; height: 14px; border-radius: 6px;">
            </div>
        </div>
        <div class="tab-underline mb-3"></div>

        <!-- table -->
        <div class="table-skeleton rounded-3">

            <!-- table header -->
            <div class="table-header-row d-flex gap-3 px-3 py-3">
                <div v-for="n in 5" :key="n" class="skeleton" :style="{ width: headerWidths[n - 1], height: '12px' }">
                </div>
            </div>

            <!-- table rows -->
            <div v-for="row in 9" :key="row" class="table-row d-flex align-items-center gap-3 px-3"
                :style="row < 9 ? 'border-bottom: 1px solid rgba(0,0,0,0.06)' : ''">

                <!-- avatar + name -->
                <div class="d-flex align-items-center gap-2" style="width: 200px;">
                    <div class="skeleton" style="width: 36px; height: 36px; border-radius: 50%; flex-shrink:0;"></div>
                    <div class="d-flex flex-column gap-1">
                        <div class="skeleton" style="width: 90px; height: 12px;"></div>
                        <div class="skeleton" style="width: 120px; height: 10px;"></div>
                    </div>
                </div>

                <!-- role -->
                <div class="skeleton" style="width: 60px; height: 22px; border-radius: 20px; margin-left: auto;"></div>

                <!-- status -->
                <div class="skeleton" style="width: 60px; height: 22px; border-radius: 20px;"></div>

                <!-- date -->
                <div class="skeleton" style="width: 80px; height: 12px;"></div>

                <!-- actions -->
                <div class="d-flex gap-2 ms-auto">
                    <div class="skeleton" style="width: 30px; height: 30px; border-radius: 8px;"></div>
                    <div class="skeleton" style="width: 30px; height: 30px; border-radius: 8px;"></div>
                </div>

            </div>


        </div>
        <!-- pagination -->
        <div class="d-flex justify-content-end align-items-center gap-2 px-3 py-3">
            <div v-for="n in 5" :key="n" class="skeleton" style="width: 28px; height: 28px; border-radius: 6px;">
            </div>
        </div>
    </div>
</template>

<script setup>
const headerWidths = ['140px', '80px', '80px', '100px', '80px']
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

.tab-row {
    padding-top: 12px;
}

.tab-underline {
    width: 90px;
    height: 2px;
    background: #e2e2e2;
    border-radius: 2px;
    margin-top: 8px;
}

.table-skeleton {
    background: #fff;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.table-header-row {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.table-row {
    height: 60px;
}
</style>