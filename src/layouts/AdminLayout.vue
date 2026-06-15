<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="d-flex flex-column vh-100">
      <!-- NAVBAR -->
      <div class="navbar-wrapper bg-body">
        <div class="navbar-inner shadow-box">
          <div class="d-flex align-items-center gap-2">
            <!-- Hamburger: only on small screens -->
            <button class="hamburger-btn d-flex d-lg-none" @click="drawerActive = true" aria-label="Open menu">
              <Menu :size="18" />
            </button>
            <router-link to="/admin/dashboard">
              <img class="ls responsive-title" style="width: 140px;" src="../assets/image/logo.svg" alt="">
            </router-link>
          </div>

          <!-- Profile -->
          <n-dropdown trigger="click" :options="options" @select="handleProfileSelect" :theme-overrides="dropdownTheme"
            style="min-width: 150px; padding: 7px 4px">
            <div class="d-flex gap-2 align-items-center rounded-3 profile cursor-pointer">
              <img :src="profile.getMe?.avatar" alt="" class="img-fluid rounded-circle object-fit-cover"
                style="width: 35px; height: 35px" />
              <div class="d-none d-sm-flex flex-column">
                <p class="fs-7 fw-bold m-0 p-0">{{ profile.getMe?.name }}</p>
                <small class="fs-8 text-secondary">{{ profile.getMe?.role }}</small>
              </div>
            </div>
          </n-dropdown>

          <!-- LOGOUT MODAL -->
          <n-modal v-model:show="showLogoutModal" :mask-closable="true" transform-origin="center">
            <n-card style="width: 400px" class="rounded-3 shadow-lg" :bordered="false" content-style="padding: 0;">
              <template #header>
                <div class="d-flex align-items-center gap-2 py-1">
                  <div class="logout-icon-box rounded-3">
                    <n-icon color="#3b82f6" size="20">
                      <LogOut />
                    </n-icon>
                  </div>
                  <div>
                    <div class="fw-bold fs-6 mb-0">Sign Out</div>
                    <div class="text-muted" style="font-size: 0.78rem">
                      You'll need to sign in again to continue
                    </div>
                  </div>
                </div>
              </template>
              <div class="px-4 py-3">
                <p class="text-secondary mb-0" style="font-size: 0.9rem; line-height: 1.6">
                  Are you sure you want to sign out of your account?
                </p>
              </div>
              <template #footer>
                <n-space justify="end" class="py-1">
                  <n-button class="rounded-3" @click="showLogoutModal = false">Cancel</n-button>
                  <n-button class="rounded-3" type="primary" color="#3b82f6" :loading="logoutLoading"
                    @click="confirmLogout">
                    <template #icon><n-icon>
                        <LogOut />
                      </n-icon></template>
                    Yes, Sign Out
                  </n-button>
                </n-space>
              </template>
            </n-card>
          </n-modal>

        </div>
      </div>

      <!-- SIDEBAR + CONTENT (desktop) -->
      <div class="layout-wrapper bg-body">
        <n-layout has-sider class="layout-card shadow-box bg-body">
          <!-- SIDEBAR -->
          <n-layout-sider collapse-mode="width" :collapsed-width="70" :width="240" :collapsed="collapsed"
            @collapse="collapsed = true" @expand="collapsed = false"
            class="py-2 d-none d-lg-flex position-relative rounded-4">
            <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="18"
              :options="menuOptions" :expanded-keys="expandedKeys" @update:expanded-keys="onUpdateExpandedKeys"
              @update:value="handleMenuClick" />

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
            @update:expanded-keys="onUpdateExpandedKeys" @update:value="handleMenuClickMobile" style="padding: 8px 0" />
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
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  UsersRound,
  ChartPie,
  Layers,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { notify } from "@/utils/toast";

const auth = useAuthStore();
const toast = notify();
const drawerActive = ref(false);
const router = useRouter();
const route = useRoute();
const profile = useAuthStore();
const showLogoutModal = ref(false);
const logoutLoading = ref(false);

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

const options = computed(() => [
  { label: "Profile", key: "profile", icon: renderIcon(User) },
  { label: "Logout", key: "logout", icon: renderIcon(LogOut) },
]);

function handleProfileSelect(key) {
  if (key === "logout") showLogoutModal.value = true; 
  if (key === "profile") router.push("/admin/setting");
}

async function confirmLogout() {
  logoutLoading.value = true;
  try {
    await auth.logout();
    localStorage.removeItem("avatar");
    router.push("/login");
  } catch (error) {
    toast.error(error.message || "Failed");
  } finally {
    logoutLoading.value = false;
    showLogoutModal.value = false;
  }
}

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

onMounted(async () => {
  await profile.getMeStore(); 
});
</script>

<style scoped>
/* ─── Buttons ─── */
button.n-button.n-button--primary-type:not(.n-button--disabled):hover {
  --n-color-hover: #3b82f6 !important;
  --n-border-hover: 1px solid #3b82f6 !important;
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

/* ─── Pagination ─── */
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

.n-pagination .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active {
  background-color: #171717 !important;
  color: white !important;
  border-radius: 50% !important;
  padding: 0 !important;
  border: none !important;
}

.n-pagination .n-pagination-item:not(.n-pagination-item--disabled):not(.n-pagination-item--active):not(.n-pagination-item--button):hover {
  border-color: #171717 !important;
  color: #171717 !important;
}

.n-pagination .n-pagination-item--button:not(.n-pagination-item--disabled):hover {
  border-color: #171717 !important;
}

.n-pagination .n-pagination-item.n-pagination-item--button {
  box-sizing: border-box !important;
  width: 38px !important;
  height: 38px !important;
  min-width: 38px !important;
  border-radius: 50% !important;
}

.n-pagination .n-pagination-item.n-pagination-item--disabled {
  color: #ced4da !important;
  background-color: #fff !important;
  border-color: #f1f3f5 !important;
  pointer-events: none !important;
}

/* ─── Dropdown ─── */
.n-dropdown-menu {
  border-radius: 12px !important;
  padding: 6px !important;
}

.n-dropdown-option-body {
  border-radius: 8px !important;
}

/* ─── Select ─── */
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

/* ─── Layout ─── */
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

/* ─── Sidebar Trigger ─── */
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

/* ─── Sidebar Menu ─── */
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

/* Active left border */
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

/* Active parent border (injected dynamically) */
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

/* ─── Scrollbar ─── */
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

/* ─── Responsive ─── */
@media (max-width: 991.98px) {
  :deep(.n-layout-sider) {
    display: none !important;
  }

  .navbar-inner {
    padding: 8px 5px;
  }
}

.responsive-title {
  font-size: clamp(13px, 3vw, 20px);
}
</style>