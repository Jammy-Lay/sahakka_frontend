<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="d-flex flex-column vh-100">
            <!-- NAVBAR -->
            <div class="navbar-wrapper bg-body">
                <div class="navbar-inner shadow-box">
                    <div class="d-flex align-items-center gap-2">
                        <!-- Hamburger: only on small screens -->
                        <button class="hamburger-btn d-flex d-lg-none" @click="drawerActive = true"
                            aria-label="Open menu">
                            <Menu :size="18" />
                        </button>
                        <router-link to="/admin/dashboard">
                            <img class="ls responsive-title" style="width: 140px;" src="../assets/image/logo.svg"
                                alt="">
                        </router-link>
                    </div>

                </div>
            </div>

            <!-- SIDEBAR + CONTENT (desktop) -->
            <div class="layout-wrapper bg-body">
                <n-layout has-sider class="layout-card shadow-box bg-body">
                    <!-- SIDEBAR -->
                    <n-layout-sider bordered collapse-mode="width" :collapsed-width="70" :width="240"
                        :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false"
                        class="py-2 d-none d-lg-flex position-relative rounded-top-4">
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

                    <n-layout class="bg-body">
                        <n-scrollbar>
                            <div class="content-area bg-body">
                                <div class="container-fluid px-3">
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

<style scoped>
body > .n-image-preview-container .n-image-preview-toolbar {
  padding: 30px !important;
  padding-left: 18px !important;
  gap: 20px !important;
  display: flex !important;
  align-items: center !important;
  border-radius: 100px !important;
  cursor: pointer;
}

body > .n-image-preview-container .n-image-preview-toolbar .n-base-icon {
  font-size: 30px !important;
}

.n-select-menu .n-base-select-option .n-base-select-option__check {
  margin-right: 16px !important;
}

.n-date-panel
  .n-date-panel-month-calendar
  .n-date-panel-month-calendar__picker-col
  .n-date-panel-month-calendar__padding {
  height: calc(var(--n-scroll-item-height) * 0.15);
}

button.n-button.n-button--primary-type:not(.n-button--disabled):hover {
  --n-color-hover: #ea6607 !important;
  --n-border-hover: 1px solid #ea6607 !important;
  --n-text-color-hover: #ffffff !important;
}

button.n-button.n-button--default-type:not(.n-button--disabled):hover {
  --n-color-hover: #000000 !important;
  --n-border-hover: 1px solid #000000 !important;
  --n-text-color-hover: #ffffff !important;
  background-color: #000000 !important;
}

button.n-button.n-button--default-type:hover .n-button__border {
  border: 1px solid #000000 !important;
}

button.n-button.n-button--default-type:hover .n-button__content {
  color: #ffffff !important;
}

/* 1. Force the container to respect the gap */
.n-pagination {
  display: flex !important;
  gap: 8px !important;
}

.n-pagination .n-pagination-item {
  color: #555 !important;
  background-color: #fff !important;
  border: 1px solid #e9ecef !important;
  transition: all 0.2s ease !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  box-sizing: border-box !important;
  width: 38px !important;
  height: 38px !important;
  min-width: 38px !important;
  border-radius: 50% !important;
  margin: 0 !important;
}

/* 3. Active state - Fixed sizing */
.n-pagination
  .n-pagination-item:not(
    .n-pagination-item--disabled
  ).n-pagination-item--active {
  background-color: #171717 !important;
  color: white !important;
  border-radius: 50% !important;
  padding: 0 !important;
  border: none !important;
}

/* 4. Hover states */
.n-pagination
  .n-pagination-item:not(.n-pagination-item--disabled):not(
    .n-pagination-item--active
  ):not(.n-pagination-item--button):hover {
  border-color: #171717 !important;
  color: #171717 !important;
}

.n-pagination
  .n-pagination-item--button:not(.n-pagination-item--disabled):hover {
  border-color: #171717 !important;
}

/* 5. Prev/Next Buttons layout */
.n-pagination .n-pagination-item.n-pagination-item--button {
  box-sizing: border-box !important;
  width: 38px !important;
  height: 38px !important;
  min-width: 38px !important;
  border-radius: 50% !important;
}

/* 6. Disabled state */
.n-pagination .n-pagination-item.n-pagination-item--disabled {
  color: #ced4da !important;
  background-color: #fff !important;
  border-color: #f1f3f5 !important;
  pointer-events: none !important;
}

.upload-trigger-box {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 10px;
  transition: border-color 0.3s;
}

.upload-trigger-box:hover {
  border-color: #171717;
  color: #171717;
}

.preview-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-box:hover .overlay {
  opacity: 1;
}

.icon-group {
  display: flex;
  gap: 5px;
}

.action-icon {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;

  transition: all 0.3s ease;
}

.action-icon:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.n-button .n-button__border,
.n-button .n-button__state-border {
  box-shadow: none !important;
}

.n-button:focus::before, 
.n-button:active::before {
  box-shadow: none !important;
  border: none !important;
}

.n-base-wave {
  display: none !important;
}


.n-dropdown-menu {
  border-radius: 12px !important;
  padding: 6px !important;
}

.n-dropdown-option-body {
  border-radius: 8px !important;
}

.n-menu .n-popover .n-menu-item-content--selected,
.n-menu-item-content--selected {
  background-color: #F3F4F6 !important;
  border-radius: 8px !important;
}

.n-popover.n-menu-tooltip {
  border-radius: 8px !important;
}

.n-menu-tooltip .n-menu-item-content {
  border-radius: 8px !important;
}

.navbar-wrapper {
  padding: 12px 12px 0 12px;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.navbar-inner {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-info {
  gap: 15px;
}

.layout-wrapper {
  flex: 1;
  padding: 8px 12px;
  background-color: #f3f4f6;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.layout-card {
  flex: 1;
  border-radius: 16px !important;
  overflow: hidden !important;
  min-height: 0;
}

.content-area {
  padding: 15px;
}

/* Hamburger button */
.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f1f1f;
  transition: background 0.2s;
}
.hamburger-btn:hover {
  background-color: #f3f4f6;
}

/* Drawer profile section */
.drawer-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 4px;
}

.bell-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.bell-wrapper:hover {
  background-color: #f3f4f6;
}

.custom-trigger {
  position: absolute;
  right: -13px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: background 0.2s;
}

.bell-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #171717;
  color: white;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background-color: #e5e7eb;
}

.profile {
  padding: 3px 15px;
}

.profile:hover {
  background-color: #f3f4f6;
}

.n-layout-sider {
  overflow: visible !important;
}

.n-menu-item-content {
  border-left: none !important;
  border-radius: 10px !important;
  margin: 2px 8px !important;
  padding-left: 12px !important;
  position: relative !important;
}

.n-menu-item-content::before {
  border-radius: 10px !important;
  left: 0 !important;
  right: 0 !important;
}

.n-menu-item-content__icon {
  width: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 10px !important;
  flex-shrink: 0 !important;
}

.n-menu-item--indent {
  width: 0 !important;
}

.n-submenu-children .n-menu-item-content {
  padding-left: 40px !important;
  margin-left: 8px !important;
  margin-right: 8px !important;
}

.n-menu-item-content--selected::after,
.n-menu--collapsed .n-menu-item-content--child-active-closed::after {
  content: "" !important;
  position: absolute !important;
  left: 8px !important;
  top: 8px !important;
  bottom: 8px !important;
  width: 3px !important;
  background-color: #171717 !important;
  border-radius: 99px !important;
}

.n-submenu-children .n-menu-item-content--selected::after {
  content: "" !important;
  position: absolute !important;
  left: 35px !important;
  top: 8px !important;
  bottom: 8px !important;
  width: 4px !important;
  background-color: #171717 !important;
  border-radius: 99px !important;
}

.n-scrollbar-rail.n-scrollbar-rail--vertical {
  top: 77px !important;
  bottom: 30px !important;
  right: 4px !important;
}

.n-scrollbar-rail.n-scrollbar-rail--vertical .n-scrollbar-thumb {
  border-radius: 99px !important;
  background-color: rgba(0, 0, 0, 0.15) !important;
  width: 6px !important;
}

/* Hide desktop sider on mobile at layout level */
@media (max-width: 991.98px) {
  :deep(.n-layout-sider) {
    display: none !important;
  }
  .navbar-inner {
    padding: 8px 5px;
  }
  .nav-info {
    gap: 0px;
  }
  .profile {
    padding-right: 5px;
  }
}

.responsive-title {
  font-size: clamp(13px, 3vw, 20px);
}

.n-base-select-menu .n-base-select-option {
  padding: 8px 20px !important;
  border-radius: 10px;
}

.n-base-select-option__check {
  padding-right: 25px !important;
}

.n-base-select-menu {
  padding: 6px 0 !important;
  border-radius: 15px;
}

</style>