<template>
    <div v-if="auth.loading">
        <SkeletonSetting></SkeletonSetting>
    </div>
    <div v-else class="container-fluid px-4">
        <!-- HEADER SECTION -->
        <div class="d-flex align-items-center justify-content-between mb-4 px-2">
            <div class="d-flex align-items-center gap-2">
                <Settings class="text-prime" :size="30" />
                <BaseTitle title="Settings" class="mb-0" />
            </div>
            <div class="d-flex gap-2">
                <n-button secondary class="rounded-3" size="medium" @click="showPasswordModal = true">
                    <template #icon><n-icon>
                            <KeyRound />
                        </n-icon></template>
                    Change Password
                </n-button>
                <n-button color="#DC3545" class="rounded-3 px-3" size="medium" @click="showLogoutModal = true">
                    <template #icon><n-icon>
                            <LogOut />
                        </n-icon></template>
                    Log out
                </n-button>
            </div>
        </div>

        <!-- MAIN PROFILE CARD -->
        <n-card :bordered="false" class="profile-main-card rounded-4 overflow-hidden" content-style="padding: 0;">
            <div class="profile-header-bg"></div>

            <div class="px-5 pb-5 pt-0">
                <div class="row align-items-end">
                    <!-- AVATAR SECTION -->
                    <div class="col-lg-auto text-center text-lg-start">
                        <div class="avatar-container">
                            <!-- Avatar image -->
                            <n-avatar :src="auth.getMe?.avatar ||
                                'http://localhost:3000/uploads/avatars/default-avatar.png'
                                " :size="150" round object-fit="cover" />
                            <!-- Pencil trigger button with dropdown -->
                            <n-dropdown :options="avatarDropdownOptions" placement="bottom-start" trigger="click"
                                @select="handleAvatarDropdown">
                                <button class="avatar-edit-btn" type="button">
                                    <Pencil :size="16" />
                                </button>
                            </n-dropdown>

                            <input id="uploadImage" type="file" @change="handleFile" accept="image/*" class="d-none" />
                        </div>
                    </div>

                    <!-- NAME & INFO SECTION -->
                    <div class="col-lg mt-3">
                        <h2 class="fw-bold mb-3">
                            {{ MyProfileStore?.name || "Your Name" }}
                        </h2>
                        <div class="d-flex flex-wrap gap-3">
                            <n-tag :bordered="false" size="medium" class="info-tag px-3">
                                <template #icon><n-icon>
                                        <Mail />
                                    </n-icon></template>
                                {{ maskedEmail || "example@gmail.com" }}
                            </n-tag>
                            <n-tag :bordered="false" size="medium" class="info-tag px-3">
                                <template #icon><n-icon>
                                        <Calendar />
                                    </n-icon></template>
                                Joined {{ formatDate(MyProfileStore?.created_at) }}
                            </n-tag>
                        </div>
                    </div>
                </div>

                <!-- STATS ROW -->
                <n-divider class="my-4" />
                <div class="row g-4">
                    <div class="col-md-4">
                        <n-card :bordered="false" class="stat-card rounded-3" content-style="padding: 1.2rem 1.4rem;">
                            <p class="stat-label">Account Status</p>
                            <div class="d-flex align-items-center gap-2">
                                <div class="status-pulse"></div>
                                <span class="fw-bold fs-6">Active Account</span>
                            </div>
                        </n-card>
                    </div>
                    <div class="col-md-4">
                        <n-card :bordered="false" class="stat-card rounded-3" content-style="padding: 1.2rem 1.4rem;">
                            <p class="stat-label">Role</p>
                            <div class="d-flex align-items-center gap-2">
                                <n-icon color="#3b82f6">
                                    <ShieldCheck />
                                </n-icon>
                                <span class="fw-bold fs-6">Administrator</span>
                            </div>
                        </n-card>
                    </div>
                    <div class="col-md-4">
                        <n-card :bordered="false" class="stat-card stat-card-hover rounded-3"
                            content-style="padding: 1.2rem 1.4rem;" @click="showPasswordModal = true">
                            <p class="stat-label">Security</p>
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <n-icon color="#3b82f6">
                                        <KeyRound />
                                    </n-icon>
                                    <span class="fw-bold fs-6">Change Password</span>
                                </div>
                                <n-icon color="#aaa">
                                    <ChevronRight />
                                </n-icon>
                            </div>
                        </n-card>
                    </div>
                </div>
            </div>
        </n-card>

        <!-- CROP IMAGE MODAL -->
        <n-modal v-model:show="showCropper" :mask-closable="false" transform-origin="center">
            <n-card style="width: 520px" class="rounded-3 shadow-lg" :bordered="false" content-style="padding: 0;">
                <template #header>
                    <div class="d-flex align-items-center gap-2 py-1">
                        <n-icon color="#3b82f6" size="22">
                            <Crop />
                        </n-icon>
                        <div>
                            <div class="fw-bold fs-6 mb-0">Crop Profile Picture</div>
                            <div class="text-muted" style="font-size: 0.78rem">
                                Adjust your photo for a perfect fit
                            </div>
                        </div>
                    </div>
                </template>
                <div class="p-4">
                    <div class="cropper-container shadow-sm mb-3">
                        <Cropper ref="cropperRef" :src="imageSource" :stencil-props="{
                            aspectRatio: 1,
                            movable: true,
                            resizable: true,
                        }" :stencil-component="CircleStencil" image-restriction="stencil" class="cropper-instance" />
                    </div>
                    <n-space justify="center" size="large">
                        <n-tag size="small" :bordered="false" class="hint-tag">
                            <template #icon><n-icon>
                                    <MousePointer2 />
                                </n-icon></template>
                            Scroll to zoom
                        </n-tag>
                        <n-tag size="small" :bordered="false" class="hint-tag">
                            <template #icon><n-icon>
                                    <Move />
                                </n-icon></template>
                            Drag to move
                        </n-tag>
                    </n-space>
                </div>
                <template #footer>
                    <n-space justify="end" class="py-1">
                        <n-button class="rounded-3" secondary @click="showCropper = false">Cancel</n-button>
                        <n-button class="rounded-3" type="primary" color="#171717" :loading="Loading"
                            @click="cropImage">
                            <template #icon><n-icon>
                                    <Check />
                                </n-icon></template>
                            Confirm Crop
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>

        <!-- DELETE AVATAR MODAL -->
        <n-modal v-model:show="showDeleteAvatarModal" :mask-closable="true" transform-origin="center">
            <n-card style="width: 400px" class="rounded-3 shadow-lg" :bordered="false" content-style="padding: 0;">
                <template #header>
                    <div class="d-flex align-items-center gap-2 py-1">
                        <div class="danger-icon-box rounded-3">
                            <n-icon color="#ef4444" size="20">
                                <Trash2 />
                            </n-icon>
                        </div>
                        <div>
                            <div class="fw-bold fs-6 mb-0">Remove Profile Photo</div>
                            <div class="text-muted" style="font-size: 0.78rem">
                                This action cannot be undone
                            </div>
                        </div>
                    </div>
                </template>
                <div class="px-4 py-3">
                    <p class="text-secondary mb-0" style="font-size: 0.9rem; line-height: 1.6">
                        Are you sure you want to remove your profile photo? Your avatar will be reset
                        to the default image.
                    </p>
                </div>
                <template #footer>
                    <n-space justify="end" class="py-1">
                        <n-button class="rounded-3" secondary @click="showDeleteAvatarModal = false">Cancel</n-button>
                        <n-button class="rounded-3" type="error" @click="confirmDeleteAvatar">
                            <template #icon><n-icon>
                                    <Trash2 />
                                </n-icon></template>
                            Yes, Remove
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>

        <n-modal v-model:show="showLogoutModal" :mask-closable="true">
            <div class="bg-white rounded-card" style="width: 380px">
                <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
                    <span class="fw-medium fs-15">Log Out</span>
                    <n-button text size="small" @click="showLogoutModal = false"
                        class="hover-circle p-1 rounded-circle">
                        <X size="18" />
                    </n-button>
                </div>
                <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
                <div class="px-4 pt-3 pb-3">
                    <p class="fs-13 text-mute mb-4 text-center">
                        Are you sure you want to log out?
                    </p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50"
                            @click="showLogoutModal = false">
                            Cancel
                        </button>
                        <button class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50" :disabled="logoutLoading"
                            @click="confirmLogout">
                            <span v-if="logoutLoading" class="spinner-border spinner-border-sm me-2" />
                            {{ logoutLoading ? "Logging out..." : "Log out" }}
                        </button>
                    </div>
                </div>
            </div>
        </n-modal>

        <!-- Change Password Modal -->
        <n-modal v-model:show="showPasswordModal" :mask-closable="false" transform-origin="center">
            <n-card style="width: 450px" class="rounded-3 shadow-lg" :bordered="false" content-style="padding: 0;">
                <template #header>
                    <div class="d-flex align-items-center gap-3 py-1">
                        <div class="pw-icon-box rounded-3">
                            <n-icon color="#3b82f6" size="25">
                                <KeyRound />
                            </n-icon>
                        </div>
                        <div>
                            <div class="fw-bold fs-6 mb-0">Change Password</div>
                            <div class="text-muted" style="font-size: 0.78rem">
                                Keep your account safe with a strong password
                            </div>
                        </div>
                    </div>
                </template>
                <div class="px-4">
                    <n-form-item-row label="Current Password">
                        <n-input v-model:value="passwordForm.current" type="password" show-password-on="click"
                            placeholder="Enter current password" size="large" />
                    </n-form-item-row>
                    <n-form-item-row label="New Password">
                        <n-input v-model:value="passwordForm.new" type="password" show-password-on="click"
                            placeholder="Enter current password" size="large" />
                    </n-form-item-row>
                    <n-form-item-row label="Confirm New Password">
                        <n-input v-model:value="passwordForm.cf" type="password" show-password-on="click"
                            placeholder="Re-enter new password" size="large" />
                    </n-form-item-row>
                </div>
                <template #footer>
                    <n-space justify="end" class="py-1">
                        <n-button class="rounded-3" @click="closePasswordModal">Cancel</n-button>
                        <n-button class="rounded-3" type="primary" color="#171717" :loading="pwLoading"
                            :disabled="!passwordForm.current || !passwordForm.new || !passwordForm.cf"
                            @click="submitPassword">
                            <template #icon><n-icon>
                                    <Check />
                                </n-icon></template>
                            Update Password
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup>
import { ref, h, computed, onMounted } from "vue";
import BaseTitle from "@/components/BaseTitle.vue";
import {
    NButton,
    NCard,
    NModal,
    NAvatar,
    NTag,
    NIcon,
    NDivider,
    NSpace,
    NInput,
    NDropdown,
} from "naive-ui";
import {
    Mail,
    Calendar,
    LogOut,
    Camera,
    Pencil,
    ShieldCheck,
    ChevronRight,
    MousePointer2,
    Move,
    KeyRound,
    Check,
    Crop,
    Trash2,
} from "lucide-vue-next";
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { notify } from "@/utils/toast";
import { useGetProfile } from "@/stores/admin/profile";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import SkeletonSetting from "@/components/Skeleton/SkeletonSetting.vue";

const profile = useGetProfile();
const auth = useAuthStore();

const router = useRouter();
const toast = notify();

const imageSource = ref(null);
const showCropper = ref(false);
const cropperRef = ref(null);
const Loading = ref(false);
const avatar = ref(localStorage.getItem("avatar"));

const showDeleteAvatarModal = ref(false);
const showLogoutModal = ref(false);
const logoutLoading = ref(false);

const showPasswordModal = ref(false);
const pwLoading = ref(false);
const passwordForm = ref({ current: "", new: "", cf: "" });

const MyProfileStore = computed(() => auth.getMe);
const maskedEmail = computed(() => {
    const email = MyProfileStore.value?.email;
    if (!email) return "";

    const [local, domain] = email.split("@");
    const masked = local[0] + "*".repeat(local.length - 1);
    const maskedDomain = domain[0] + "*".repeat(local.length - 1);

    return `${masked}@${maskedDomain}.com`;
});
onMounted(async () => {
    await auth.getMeStore();
});

// ---- Avatar dropdown ----
const avatarDropdownOptions = computed(() => [
    {
        label: "Change Photo",
        key: "change",
        icon: () => h(NIcon, null, { default: () => h(Camera) }),
    },
    {
        label: "Remove Photo",
        key: "remove",
        icon: () => h(NIcon, { color: "#ef4444" }, { default: () => h(Trash2) }),
        props: { style: "color: #ef4444;" },
    },
]);

function handleAvatarDropdown(key) {
    if (key === "change") {
        document.getElementById("uploadImage").click();
    } else if (key === "remove") {
        showDeleteAvatarModal.value = true;
    }
}

// ---- File / Crop ----
const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (imageSource.value) URL.revokeObjectURL(imageSource.value);
    imageSource.value = URL.createObjectURL(file);
    showCropper.value = true;
    event.target.value = "";
};

const cropImage = async () => {
    const { canvas } = cropperRef.value.getResult();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
        if (!blob) return;
        Loading.value = true;
        try {
            const formData = new FormData();
            formData.append("avatar", blob, "avatar.png");

            // changeProfile
            await profile.changeProfile(formData);

            // new avatar
            await auth.getMeStore();

            // Update localStorage from store data
            const newAvatar = profile.profile?.avatar || profile.profile?.avatar_url || null;
            avatar.value = newAvatar;
            if (newAvatar) {
                localStorage.setItem("avatar", newAvatar);
            }

            toast.success("Avatar updated!");
            showCropper.value = false;
        } catch (error) {
            toast.error(error.message || "Failed to update avatar");
        } finally {
            Loading.value = false;
        }
    }, "image/png");
};

// ---- Delete avatar ----
async function confirmDeleteAvatar() {
    try {
        //resetAvatar()
        await profile.resetAvatar();

        avatar.value = null;
        localStorage.removeItem("avatar");

        await auth.getMeStore();

        toast.success("Avatar removed!");
        showDeleteAvatarModal.value = false;
    } catch (error) {
        toast.error(error.message || "Failed to remove avatar");
    }
}

// ---- Logout ----
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

// ---- Password ----
function closePasswordModal() {
    showPasswordModal.value = false;
    passwordForm.value = { current: "", new: "", cf: "" };
}

async function submitPassword() {
    if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.cf) {
        toast.error("Please fill all fields");
        return;
    }

    if (passwordForm.value.new !== passwordForm.value.cf) {
        toast.error("New passwords do not match");
        return;
    }

    pwLoading.value = true;
    try {
        await auth.changePassword({
            currentPassword: passwordForm.value.current,
            newPassword: passwordForm.value.new,
            confirmPassword: passwordForm.value.cf,
        });
        toast.success("Password changed successfully!");
        closePasswordModal();
    } catch (error) {
        toast.error(error.message || "Failed to change password");
    } finally {
        pwLoading.value = false;
    }
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}
</script>

<style scoped>
.profile-main-card {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05) !important;
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

.main-profile-avatar {
    width: 150px !important;
    height: 150px !important;
    border-radius: 50% !important;
    display: block;
    border: 5px solid white !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Pencil edit button — sits bottom-right of avatar */
.avatar-edit-btn {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    transition: background 0.18s ease, transform 0.15s ease;
    z-index: 3;
}

.info-tag {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    font-size: 0.82rem !important;
    color: #475569 !important;
}

.stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
}

.stat-card {
    background: #f3f4f6 !important;
    box-shadow: none !important;
    border: 1px solid #f1f5f9 !important;
    transition: all 0.25s ease;
}

.stat-card-hover {
    cursor: pointer;
}

.stat-card-hover:hover {
    background: #fff7ed !important;
    border-color: #3b82f6 !important;
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.1) !important;
}

.status-pulse {
    width: 10px;
    height: 10px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }

    70% {
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
}

.cropper-container {
    height: 340px;
    background: #f1f5f9;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.cropper-instance {
    height: 100%;
    width: 100%;
}

.pw-n-input :deep(.n-input__border),
.pw-n-input :deep(.n-input__state-border) {
    border-radius: 6px !important;
}

.pw-n-input :deep(.n-input-wrapper) {
    border-radius: 6px !important;
}

.pw-n-input :deep(.n-input__eye) {
    color: #94a3b8;
}

.pw-n-input :deep(.n-input__eye:hover) {
    color: #3b82f6;
}
</style>
