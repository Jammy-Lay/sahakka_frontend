<template>
    <div class="page-bg p-4">

        <!-- back button -->
        <div class="skeleton mb-3" style="width:150px; height:38px; border-radius:8px;"></div>

        <div class="row">

            <!-- ── Left: Team Card ── -->
            <div class="col-6">
                <div class="team-card card p-4 mb-4 border-0">

                    <!-- workspace pill + title + desc -->
                    <div class="d-flex align-items-start justify-content-between mb-3">
                        <div class="d-flex flex-column gap-2">
                            <div class="skeleton" style="width:100px; height:22px; border-radius:20px;"></div>
                            <div class="skeleton" style="width:160px; height:20px;"></div>
                            <div class="skeleton" style="width:220px; height:13px;"></div>
                            <div class="skeleton" style="width:180px; height:13px;"></div>
                        </div>
                    </div>

                    <hr />

                    <!-- stats row -->
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="stat-box d-flex align-items-center gap-2 rounded-3 p-3">
                                <div class="skeleton"
                                    style="width:34px; height:34px; border-radius:8px; flex-shrink:0;"></div>
                                <div class="d-flex flex-column gap-1">
                                    <div class="skeleton" style="width:70px; height:11px;"></div>
                                    <div class="skeleton" style="width:30px; height:14px;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stat-box d-flex align-items-center gap-2 rounded-3 p-3">
                                <div class="skeleton"
                                    style="width:34px; height:34px; border-radius:8px; flex-shrink:0;"></div>
                                <div class="d-flex flex-column gap-1">
                                    <div class="skeleton" style="width:70px; height:11px;"></div>
                                    <div class="skeleton" style="width:80px; height:14px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- ── Right: Members Table ── -->
            <div class="col-6">
                <div class="skeleton mb-2" style="width:100px; height:12px;"></div>

                <!-- table rows -->
                <div class="table-skeleton rounded-3 mt-5">
                    <div v-for="n in 3" :key="n" class="d-flex align-items-center gap-3 px-3 py-2"
                        :style="n < 3 ? 'border-bottom: 1px solid rgba(0,0,0,0.06)' : ''">
                        <div class="skeleton" style="width:36px; height:36px; border-radius:50%; flex-shrink:0;"></div>
                        <div class="d-flex flex-column gap-1 flex-grow-1">
                            <div class="skeleton" style="width:100px; height:12px;"></div>
                            <div class="skeleton" style="width:140px; height:10px;"></div>
                        </div>
                        <div class="skeleton" style="width:55px; height:22px; border-radius:20px;"></div>
                    </div>
                </div>
            </div>

           <!-- kanban columns -->
        <div class="col-12">
            <div class="row">
                <div v-for="col in 5" :key="col" class="col-12 col-sm-6 col-lg-4 col-xl mb-3">
                    <div class="board-col h-100">

                        <!-- column header -->
                        <div class="d-flex align-items-end justify-content-between mb-3">
                            <div class="skeleton" style="width:100%; height:45px; border-radius:30px;"></div>
                        </div>

                        <!-- task cards -->
                        <div v-for="card in cardCounts[col - 1]" :key="card" class="task-card">

                            <!-- header: title + badge -->
                            <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                                <div class="d-flex flex-column gap-1 flex-grow-1">
                                    <div class="skeleton" style="height:13px; width:80%;"></div>
                                    <div class="skeleton" style="height:10px; width:50%;"></div>
                                </div>
                                <div class="skeleton"
                                    style="width:48px; height:20px; border-radius:8px; flex-shrink:0;"></div>
                            </div>

                            <!-- description -->
                            <div class="d-flex flex-column gap-1 mb-3">
                                <div class="skeleton" style="width:100%; height:11px;"></div>
                                <div class="skeleton" style="width:70%; height:11px;"></div>
                            </div>

                            <!-- team info box -->
                            <div class="info-box mb-3">
                                <div class="skeleton"
                                    style="width:14px; height:14px; border-radius:4px; flex-shrink:0;"></div>
                                <div class="d-flex flex-column gap-1 flex-grow-1">
                                    <div class="skeleton" style="width:90px; height:12px;"></div>
                                    <div class="skeleton" style="width:120px; height:10px;"></div>
                                </div>
                            </div>

                            <!-- dates -->
                            <div class="date-section mb-2">
                                <div class="d-flex align-items-center gap-1">
                                    <div class="skeleton" style="width:12px; height:12px; border-radius:3px;"></div>
                                    <div class="skeleton" style="width:130px; height:10px;"></div>
                                </div>
                                <div class="d-flex align-items-center gap-1">
                                    <div class="skeleton" style="width:12px; height:12px; border-radius:3px;"></div>
                                    <div class="skeleton" style="width:110px; height:10px;"></div>
                                </div>
                            </div>

                            <!-- footer: avatar + date -->
                            <div class="task-footer d-flex justify-content-between align-items-center mt-2">
                                <div class="d-flex align-items-center gap-1">
                                    <div class="skeleton" style="width:20px; height:20px; border-radius:50%;"></div>
                                    <div class="skeleton" style="width:70px; height:10px;"></div>
                                </div>
                                <div class="skeleton" style="width:55px; height:10px;"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div>
    </div>
</template>

<script setup>
const cardCounts = [3, 4, 2, 3, 2]
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

.page-bg {
    background: #f4f6f9;
    min-height: 85vh;
}

.stat-box {
    background: #f8fafc;
}

.table-skeleton {
    background: #fff;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.board-col {
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 14px 12px;
}

.task-card {
    background: #fff;
    border: 0.5px solid #e3e3e3;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 8px;
}

.task-card:last-child {
    margin-bottom: 0;
}

.info-box {
    display: flex;
    gap: 8px;
    background: #f7f7f7;
    padding: 8px;
    border-radius: 10px;
}

.date-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>