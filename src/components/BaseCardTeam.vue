<template>
    <div class="card border-0 shadow-sm rounded-4 cursor-pointer h-100" @click="$emit('view')">
        <div class="card-body">

            <!-- Workspace -->
            <div class="d-flex gap-2 pb-2 mb-3 border-bottom border-2">
                <Layers2 size="24" />
                <div>
                    <p class="m-0 fs-8 text-secondary text-truncate-1">Workspace</p>
                    <p class="m-0 fs-7 fw-semibold text-truncate-1">{{ workspace }}</p>
                </div>
            </div>

            <!-- Title -->
            <div class="d-flex gap-2 align-items-center">
                <BriefcaseBusiness size="20" />
                <h6 class="m-0 fw-semibold ls text-truncate-1">{{ title }}</h6>
            </div>

            <!-- Description -->
            <p class="text-secondary m-0 fs-7 ms-1 mt-2 mb-3 text-truncate-2">{{ description }}</p>

            <!-- Progress Bar -->
            <div class="d-flex justify-content-between mb-1">
                <p class="m-0 fs-7">Progress</p>
                <p class="m-0 fs-7">{{ progress }}%</p>
            </div>
            <div class="mb-3">
                <n-progress type="line" :percentage="Number(progress)" :show-indicator="false" processing :height="8"
                    color="#34C759" />
            </div>

            <!-- Owner & Members -->
            <div class="row d-flex justify-content-between align-items-center mb-3">
                <div class="col-6 d-flex align-items-center gap-2" style="min-width: 0;">
                    <n-avatar round :size="30" :src="owner?.avatar" style="flex-shrink: 0;" />
                    <div style="min-width: 0;">
                        <p class="m-0 fs-9 text-secondary text-truncate-1">Owner</p>
                        <p class="m-0 fs-10 fw-semibold text-truncate-1">{{ owner?.name }}</p>
                    </div>
                </div>
                <div class="col-6 d-flex align-items-center gap-2" style="min-width: 0;">
                    <div style="flex-shrink: 0; overflow: hidden;"> <!-- ← wrap avatar group -->
                        <n-avatar-group :options="members.map((m) => ({ name: m.name, src: m.avatar }))" :size="30"
                            :max="3">
                            <template #avatar="{ option: { name, src } }">
                                <n-tooltip>
                                    <template #trigger>
                                        <n-avatar :src="src" />
                                    </template>
                                    {{ name }}
                                </n-tooltip>
                            </template>
                            <template #rest="{ options: restOptions, rest }">
                                <n-dropdown :options="createDropdownOptions(restOptions)" placement="top"
                                    :theme-overrides="dropdownTheme" style="min-width: 150px; padding: 7px 4px">
                                    <n-avatar style="cursor: default">+{{ rest }}</n-avatar>
                                </n-dropdown>
                            </template>
                        </n-avatar-group>
                    </div>
                    <div style="min-width: 0;"> <!-- ← allow text to shrink -->
                        <p class="m-0 fs-9 text-secondary text-truncate-1" style="white-space: nowrap;">Members</p>
                        <p class="m-0 fs-10 fw-bold text-truncate-1">{{ members.length }} People</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Layers2, BriefcaseBusiness, ArrowRight } from "lucide-vue-next";

defineProps({
    workspace: { type: String, default: "" },
    title: { type: String, default: "-" },
    description: { type: String, default: "" },
    progress: { type: [Number, String], default: 0 },
    owner: { type: Object, default: () => ({}) },  // { name, avatar }
    members: { type: Array, default: () => [] },    // [{ name, avatar, role }]
});

defineEmits(["view"]);

const dropdownTheme = { common: { borderRadius: "8px" } };

function createDropdownOptions(list) {
    return list.map((o) => ({ key: o.name, label: o.name }));
}
</script>
<style scoped>
.text-truncate-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>