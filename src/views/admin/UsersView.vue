<template>
    <div v-if="loading">
        <Loading></Loading>
    </div>
    <div v-else>
        <div class="d-flex align-items-center mb-1">
            <div class="d-flex align-items-center gap-2">
                <Users  class="text-prime" :size="30" />
                <BaseTitle title="View Users" class="mb-0" />
            </div>
        </div>

        <n-tabs type="line" animated default-value="allUsers">
            <n-tab-pane name="allUsers" tab="Users">
                <div class="row pt-3 g-4">
                    <div class="col-lg-12">
                        <n-data-table :columns="columnsAllUsers" :data="dataAllUsers"
                            :pagination="dataAllUsers.length >= 9 ? { pageSize: 9, } : false" :bordered="false"
                            class="task-table" />
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="userActive" tab="Users Active">
                <div class="row pt-3 g-4">
                    <div class="col-lg-12">
                        <n-data-table :columns="columnsUserActive" :data="dataUsersActive"
                            :pagination="dataUsersActive.length >= 9 ? { pageSize: 9 } : false" :bordered="false"
                            class="task-table" />
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="newRegister" tab="User Register">
                <div class="row pt-3 g-4">
                    <div class="col-lg-12">
                        <n-data-table :columns="columnsNewRegister" :data="dataNewRegister"
                            :pagination="dataNewRegister.length >= 9 ? { pageSize: 9 } : false" :bordered="false"
                            class="task-table" />
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="userBlock" tab="User Blocked">
                <div class="row pt-3 g-4">
                    <div class="col-lg-12">
                        <n-data-table :columns="columnsUserBlock" :data="dataUserBlock"
                            :pagination="dataUserBlock.length >= 9 ? { pageSize: 9 } : false" :bordered="false"
                            class="task-table" />
                    </div>
                </div>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup>
import { h, onMounted, ref } from "vue";
import { NTag, NAvatar, NProgress, NDropdown } from "naive-ui";
import {
    EllipsisVertical,
    CircleCheck,
    CircleX,
} from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";
import { computed } from "vue";
import { useUserStore } from "@/stores/admin/users";
import api from "@/api/https";
import { useToast } from "vue-toastification";
import Loading from "@/components/layouts/Loading.vue";

const loading = ref(false)
const toast = useToast();
const usersStore = useUserStore();

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const getAllUsers = async () => {
    loading.value = true;

    try {
        await usersStore.fetchUsers();
    } catch (error) {
        toast.error("Failed to load");
    } finally {
        loading.value = false;
    }
};

const dataAllUsers = computed(() => {
    return [...(usersStore.users || [])]
        .sort((a, b) => a.id - b.id);
});
const options = (row) => {

    if (row.is_verified === 0) {
        return [
            {
                label: "User not verified",
                key: "not_verified",
                disabled: true,
            },
        ];
    }


    if (row.is_active === 1) {
        return [
            {
                label: () =>
                    h("div", { class: "d-flex align-items-center gap-2 text-danger" }, [
                        h(CircleX, { size: 16 }),
                        "Block",
                    ]),
                key: "block",
            },
        ];
    }
    return [
        {
            label: () =>
                h("div", { class: "d-flex align-items-center gap-2 text-success" }, [
                    h(CircleCheck, { size: 16 }),
                    "Active",
                ]),
            key: "active",
        },
    ];
};

const handleAction = async (key, row) => {
    loading.value = true;
    try {
        if (key === "active" && row.is_active === 0) {
            try {
                await api.patch(`/sahakka-admin/users/${row.id}/activate`);
                await usersStore.fetchUsers();

                toast.success(`${row.name} activated successfully`);
            } catch (error) {
                toast.error(error.response?.data?.message || "Activation failed");
            }
        } else if (key === "active" && row.is_active === 1) {
            toast.success("This user is already activated");
        }

        if (key === "block" && row.is_active === 1) {
            try {
                await api.patch(`/sahakka-admin/users/${row.id}/suspend`);
                await usersStore.fetchUsers();

                toast.success(`${row.name} has been blocked`);
            } catch (error) {
                toast.error(error.response?.data?.message || "Block failed");
            }
        } else if (key === "block" && row.is_active === 0) {
            toast.error("This user is already blocked");

        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Action failed");
    } finally {
        loading.value = false;
    }

};
const columnsAllUsers = [
    {
        title: "ID",
        key: "id",
    },
    {
        title: "NAME",
        key: "name",
    },
    {
        title: "EMAIL",
        key: "email",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, row.email),
    },
    {
        title: "DATE",
        key: "date",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, formatDate(row.created_at)),
    },
    {
        title: "STATUS",
        key: "status",
        render: (row) => {

            let type = "default";
            let label = "Unknown";

            if (row.is_active === 1 && row.is_verified === 0) {
                type = "info";
                label = "New Register";
            }
            else if (row.is_active === 1 && row.is_verified === 1) {
                type = "success";
                label = "Active";
            }
            else {
                type = "error";
                label = "Blocked";
            }

            return h(
                NTag,
                {
                    type,
                    round: true,
                },
                { default: () => label }
            );
        },
    },
    {
        title: "ACTION",
        key: "action",
        render(row) {
            return h(
                NDropdown,
                {
                    options: options(row),
                    trigger: "click",
                    onSelect: (key) => handleAction(key, row),
                },
                {
                    default: () =>
                        h(
                            EllipsisVertical,
                            {
                                size: 18,
                                style: {
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                },
                            },
                        ),
                }
            );
        },
    },
];


const dataUsersActive = computed(() => {
    return [...(usersStore.users || [])]
        .filter(user => user.is_active === 1 && user.is_verified === 1)
        .sort((a, b) => a.id - b.id);
});

const columnsUserActive = [
    {
        title: "ID",
        key: "id",
    },
    {
        title: "NAME",
        key: "name",
    },
    {
        title: "EMAIL",
        key: "email",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, row.email),
    },
    {
        title: "DATE",
        key: "date",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, formatDate(row.created_at)),
    },
    {
        title: "STATUS",
        key: "status",
        render: (row) => {

            let type = "default";
            let label = "Unknown";

            if (row.is_active === 1 && row.is_verified === 0) {
                type = "info";
                label = "New Register";
            }
            else if (row.is_active === 1 && row.is_verified === 1) {
                type = "success";
                label = "Active";
            }
            else {
                type = "error";
                label = "Blocked";
            }

            return h(
                NTag,
                {
                    type,
                    round: true,
                },
                { default: () => label }
            );
        },
    },
    {
        title: "ACTION",
        key: "action",
        render(row) {
            return h(
                NDropdown,
                {
                    options: options(row),
                    trigger: "click",
                    onSelect: (key) => handleAction(key, row),
                },
                {
                    default: () =>
                        h(
                            EllipsisVertical,
                            {
                                size: 18,
                                style: {
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                },
                            },
                        ),
                }
            );
        },
    },
];

const dataNewRegister = computed(() => {
    return [...(usersStore.users || [])]
        .filter(user => user.is_active === 1 && user.is_verified === 0)
        .sort((a, b) => a.id - b.id);
});

const columnsNewRegister = [
    {
        title: "ID",
        key: "id",
    },
    {
        title: "NAME",
        key: "name",
    },
    {
        title: "EMAIL",
        key: "email",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, row.email),
    },
    {
        title: "DATE",
        key: "date",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, formatDate(row.created_at)),
    },
    {
        title: "STATUS",
        key: "status",
        render: (row) => {

            let type = "default";
            let label = "Unknown";

            if (row.is_active === 1 && row.is_verified === 0) {
                type = "info";
                label = "New Register";
            }
            else if (row.is_active === 1 && row.is_verified === 1) {
                type = "success";
                label = "Active";
            }
            else {
                type = "error";
                label = "Blocked";
            }

            return h(
                NTag,
                {
                    type,
                    round: true,
                },
                { default: () => label }
            );
        },
    },

];

const dataUserBlock = computed(() => {
    return [...(usersStore.users || [])]
        .filter(user => user.is_active === 0)
        .sort((a, b) => a.id - b.id);
});

const columnsUserBlock = [
    {
        title: "ID",
        key: "id",
    },
    {
        title: "NAME",
        key: "name",
    },
    {
        title: "EMAIL",
        key: "email",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, row.email),
    },
    {
        title: "DATE",
        key: "date",
        render: (row) =>
            h("span", { class: "fw-medium text-secondary" }, formatDate(row.created_at)),
    },
    {
        title: "STATUS",
        key: "status",
        render: (row) => {

            let type = "default";
            let label = "Unknown";

            if (row.is_active === 1 && row.is_verified === 0) {
                type = "info";
                label = "New Register";
            }
            else if (row.is_active === 1 && row.is_verified === 1) {
                type = "success";
                label = "Active";
            }
            else {
                type = "error";
                label = "Blocked";
            }

            return h(
                NTag,
                {
                    type,
                    round: true,
                },
                { default: () => label }
            );
        },
    },
    {
        title: "ACTION",
        key: "action",
        render(row) {
            return h(
                NDropdown,
                {
                    options: options(row),
                    trigger: "click",
                    onSelect: (key) => handleAction(key, row),
                },
                {
                    default: () =>
                        h(
                            EllipsisVertical,
                            {
                                size: 18,
                                style: {
                                    cursor: "pointer",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                },
                            },
                        ),
                }
            );
        },
    },
];

onMounted(async () => {
    await getAllUsers();
});
</script>

<style scoped>
:deep(.n-carousel-item) {
    width: auto !important;
}

:deep(.n-image) {
    width: 100% !important;
    display: block;
}

:deep(.n-image img) {
    width: 100% !important;
    height: 250px !important;
    object-fit: cover;
    border-radius: 8px;
}

:deep(.n-tabs-tab__label) {
    font-size: 15px;
    font-weight: 550;
    letter-spacing: 0.2px;
}

:deep(.task-table .n-data-table-wrapper) {
    overflow: hidden;
    background-color: #ffff;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
}

:deep(.n-data-table-th) {
    background-color: #ffff !important;
    color: #8e99a7 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    padding: 18px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.n-data-table-td) {
    padding: 15px !important;
    height: 60px !important;
}

:deep(.tb-h .n-data-table-td) {
    padding: 15px !important;
    height: 63px !important;
}

:deep(.n-data-table__pagination) {
    padding-top: 5px !important;
    padding-bottom: 0px !important;
}

:deep(.task-table .n-data-table-tbody tr:last-child td) {
    border-bottom: none !important;
}

:deep(.task-table .n-data-table-td) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
