<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="d-flex flex-column vh-100">
            <!-- NAVBAR -->
            <div class="navbar-wrapper">
                <div class="navbar-inner shadow-box">
                    <div class="d-flex align-items-center gap-2">
                        <!-- Hamburger: only on small screens -->
                        <button class="hamburger-btn d-flex d-lg-none" @click="drawerActive = true"
                            aria-label="Open menu">
                            <Menu :size="18" />
                        </button>
                        <h5 class="fw-bold m-0 text-prime ls responsive-title">
                            Sahakka
                        </h5>
                    </div>

                </div>
            </div>

            <!-- SIDEBAR + CONTENT (desktop) -->
            <div class="layout-wrapper">
                <n-layout has-sider class="layout-card shadow-box">
                    <!-- SIDEBAR -->
                    <n-layout-sider bordered collapse-mode="width" :collapsed-width="70" :width="240"
                        :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false"
                        class="py-2 d-none d-lg-flex position-relative">
                        <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64"
                            :collapsed-icon-size="18" :options="menuOptions" :expanded-keys="expandedKeys"
                            @update:expanded-keys="onUpdateExpandedKeys" @update:value="handleMenuClick" />

                        <div class="custom-trigger" @click="collapsed = !collapsed">
                            <ChevronRight :size="16" :style="{
                                transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: 'transform 0.3s',
                            }" />
                        </div>
                    </n-layout-sider>

                    <n-layout>
                        <n-scrollbar>
                            <div class="content-area">
                                <div class="container-fluid p-3">
                                    <router-view />
                                </div>
                            </div>
                        </n-scrollbar>
                    </n-layout>
                </n-layout>
            </div>

            <!-- MOBILE DRAWER: visible only on < lg -->
            <n-drawer v-model:show="drawerActive" :width="260" placement="left" :trap-focus="false" class="d-lg-none">
                <n-drawer-content :native-scrollbar="false" :body-content-style="{ padding: 0 }">
                    <!-- Drawer Header -->
                    <template #header>
                        <div class="d-flex align-items-center justify-content-between w-100">
                            <h6 class="fw-bold m-0 text-prime">Admin</h6>
                            <button class="hamburger-btn" @click="drawerActive = false" aria-label="Close menu">
                                <X :size="18" />
                            </button>
                        </div>
                    </template>

                    <!-- Menu inside drawer -->
                    <n-menu v-model:value="activeKey" :options="menuOptions" :expanded-keys="expandedKeys"
                        @update:expanded-keys="onUpdateExpandedKeys" @update:value="handleMenuClickMobile"
                        style="padding: 8px 0" />
                </n-drawer-content>
            </n-drawer>
        </div>
    </n-config-provider>
</template>

<script setup>
import { ref, watch, computed, nextTick, h, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import {
    Book,
    User,
    Wine,
    LayoutDashboard,
    Settings,
    Folder,
    FileText,
    Check,
    LogOut,
    Pencil,
    Bell,
    BellRing,
    BellOff,
    Earth,
    ChevronDown,
    Menu,
    X,
    ChevronRight,
    UsersRound,
    NotebookPen,
    ChartPie,
    Layers,
} from "lucide-vue-next";

const drawerActive = ref(false);
const router = useRouter();
const route = useRoute();


function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = computed(() => [
    {
        label: "Dashboard",
        key: "/admin/dashboard",
        icon: renderIcon(LayoutDashboard),
    },
    {
        label: "Users",
        key: "/admin/users",
        icon: renderIcon(User)
    },
    {
        label: "Workspaces",
        key: "/admin/workspaces",
        icon: renderIcon(Layers),
    },
    {
        label: "Teams",
        key: "teams",
        icon: renderIcon(UsersRound),
        children: [
            {
                label: "Teams",
                key: "/admin/teams" || "workspace/:workspace_id/teams/:team_id",
                icon: renderIcon(UsersRound),
            },
            {
                label: "Activites Team",
                key: "/admin/activities-team",
                icon: renderIcon(NotebookPen),
            },
            {
                label: "Tasks",
                key: "/admin/tasks",
                icon: renderIcon(ChartPie),
            },
        ],
    },
    { label: "Settings", key: "/admin/setting", icon: renderIcon(Settings) },
]);

const activeKey = ref(route.path);
const collapsed = ref(false);
const expandedKeys = ref([]);

function handleMenuClick(key) {
    if (key.startsWith("/")) router.push(key);
}

function handleMenuClickMobile(key) {
    if (key.startsWith("/")) {
        router.push(key);
        drawerActive.value = false;
    }
}

watch(
    () => route.path,
    (newPath) => {
        activeKey.value = newPath;
    }
);

function onUpdateExpandedKeys(keys) {
    expandedKeys.value = keys;
}

const activeParentKey = computed(() => {
    for (const option of menuOptions.value) {
        if (option.children) {
            const found = option.children.find((c) => c.key === activeKey.value);
            if (found) return option.key;
        }
    }
    return null;
});

const showParentBorder = computed(() => {
    if (!activeParentKey.value) return false;
    if (collapsed.value) return true;
    return !expandedKeys.value.includes(activeParentKey.value);
});

function updateActiveBorderStyle() {
    let styleEl = document.getElementById("active-parent-border-style");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "active-parent-border-style";
        document.head.appendChild(styleEl);
    }
    if (activeParentKey.value && showParentBorder.value) {
        styleEl.innerHTML = `
      .n-menu-item-content--child-active::after,
      .n-menu-item-content--child-active-closed::after {
        content: "";
        position: absolute;
        left: 8px;
        top: 8px;
        bottom: 8px;
        width: 3px;
        background-color: #171717;
        border-radius: 99px;
      }
      .n-menu-item-content--child-active,
      .n-menu-item-content--child-active-closed,
      .n-menu-item--child-active > .n-menu-item-content,
      .n-menu-item--child-active-closed > .n-menu-item-content {
        background-color: #F3F4F6 !important;
      }
      .n-menu-item-content--child-active .n-menu-item-content-header,
      .n-menu-item-content--child-active .n-icon,
      .n-menu-item-content--child-active-closed .n-menu-item-content-header,
      .n-menu-item-content--child-active-closed .n-icon {
        color: #171717 !important;
      }
    `;
    } else {
        styleEl.innerHTML = "";
    }
}

const dropdownTheme = {
    common: { borderRadius: "8px" },
};

watch(
    [activeKey, expandedKeys, collapsed],
    async () => {
        await nextTick();
        updateActiveBorderStyle();
    },
    { immediate: true }
);

const themeOverrides = {
    common: {
        primaryColor: "#171717",
        primaryColorHover: "#1A1A2E",
        primaryColorPressed: "#c2410c",
        primaryColorSuppl: "#F3F4F6",
        bodyColor: "#ffff",
        baseColor: "#ffffff",
        cardColor: "#ffffff",
        textColorBase: "#1f1f1f",
        textColor1: "#2c2c2c",
        textColor2: "#555555",
        textColor3: "#888888",
        borderColor: "#e5e5e5",
        dividerColor: "#e5e5e5",
    },
    Layout: { siderColor: "#ffff" },
    Menu: {
        itemColorHover: "#F3F4F6",
        itemTextColorHover: "#1A1A2E",
        itemColorActive: "#F3F4F6",
        itemTextColorActive: "#171717",
        itemColorActiveHover: "#F3F4F6",
        itemTextColorActiveHover: "#171717",
        itemColorActiveCollapsed: "#F3F4F6",
        itemTextColorChildActive: "#1A1A2E",
        itemTextColorChildActiveHover: "#1A1A2E",
        itemColorChildActiveHover: "#F3F4F6",
        itemIconColorChildActive: "#1A1A2E",
        itemIconColorChildActiveHover: "#1A1A2E",
        arrowColorChildActive: "#1A1A2E",
        arrowColorChildActiveHover: "#1A1A2E",
    },
    Input: {
        heightMedium: "40px",
        border: "1px solid #e5e5e5",
        borderHover: "1px solid #171717",
        borderFocus: "1px solid #171717",
        boxShadowFocus: "1px solid #171717",
    },
    Select: {
        borderFocus: "1px solid #171717",
        peers: {
            InternalSelection: {
                borderHover: "1px solid #171717",
                borderFocus: "1px solid #171717",
                boxShadowFocus: "0 0 0 0",
            },
        },
    },
};
</script>
