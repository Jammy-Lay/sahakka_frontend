<template>
    <div class="container-fluid px-4">

        <!-- header -->
        <div class="d-flex align-items-center justify-content-between mb-4 px-2">
            <div class="d-flex align-items-center gap-2">
                <div class="skeleton" style="width:30px; height:36px; border-radius:6px;"></div>
                <div class="skeleton" style="width:90px; height:36px;"></div>
            </div>
            <div class="d-flex gap-2">
                <div class="skeleton" style="width:160px; height:36px; border-radius:8px;"></div>
                <div class="skeleton" style="width:110px; height:36px; border-radius:8px;"></div>
            </div>
        </div>

        <!-- main profile card -->
        <div class="profile-main-card rounded-4 overflow-hidden">

            <!-- blue banner -->
            <div class="profile-header-bg"></div>

            <div class="px-5 pb-5 pt-0">
                <div class="row align-items-end">

                    <!-- avatar section -->
                    <div class="col-lg-auto text-center text-lg-start">
                        <div class="avatar-container">
                            <div class="skeleton"
                                style="width:150px; height:150px; border-radius:50%; border:5px solid #fff;"></div>
                            <!-- pencil btn -->
                            <div class="skeleton" style="
                position:absolute; bottom:4px; right:4px;
                width:32px; height:32px; border-radius:50%;
              "></div>
                        </div>
                    </div>

                    <!-- name & info -->
                    <div class="col-lg mt-3">
                        <div class="skeleton mb-3" style="width:200px; height:30px;"></div>
                        <div class="d-flex flex-wrap gap-3">
                            <div class="skeleton" style="width:180px; height:30px; border-radius:6px;"></div>
                            <div class="skeleton" style="width:150px; height:30px; border-radius:6px;"></div>
                        </div>
                    </div>

                </div>

                <!-- divider -->
                <div class="skeleton my-4" style="width:100%; height:1px; border-radius:0;"></div>

                <!-- stats row -->
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="stat-card rounded-3 p-3">
                            <div class="skeleton mb-2" style="width:100px; height:11px;"></div>
                            <div class="d-flex align-items-center gap-2">
                                <div class="skeleton" style="width:10px; height:10px; border-radius:50%;"></div>
                                <div class="skeleton" style="width:120px; height:18px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card rounded-3 p-3">
                            <div class="skeleton mb-2" style="width:40px; height:11px;"></div>
                            <div class="d-flex align-items-center gap-2">
                                <div class="skeleton" style="width:18px; height:18px; border-radius:4px;"></div>
                                <div class="skeleton" style="width:100px; height:18px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card rounded-3 p-3">
                            <div class="skeleton mb-2" style="width:60px; height:11px;"></div>
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="skeleton" style="width:18px; height:18px; border-radius:4px;"></div>
                                    <div class="skeleton" style="width:130px; height:18px;"></div>
                                </div>
                                <div class="skeleton" style="width:16px; height:16px; border-radius:4px;"></div>
                            </div>
                        </div>
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

.profile-main-card {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    background: #fff;
}

.profile-header-bg {
    height: 120px;
    background: linear-gradient(110deg, #3b82f6 0%, #60a5fa 50%, #bfdbfe 100%);
    opacity: 0.5;
}

.avatar-container {
    position: relative;
    margin-top: -75px;
    display: inline-block;
}

.stat-card {
    background: #f3f4f6;
    border: 1px solid #f1f5f9;
}
</style>