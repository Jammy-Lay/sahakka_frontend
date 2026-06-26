<template>
  <div class="min-vh-100 overflow-hidden">
    <div class="row g-0">
      <div class="col-lg-6">
        <img
          src="../../assets/image/style 1.png"
          alt=""
          class="object-fit-cover w-100 vh-100 d-none d-lg-block"
        />
      </div>
      <div class="col-lg-6">
        <div class="d-flex justify-content-center align-items-center min-vh-100 px-5">
          <div style="width: 468px">
            <div class="d-flex align-items-center gap-2 mb-4">
              <n-avatar :src="Logo" :size="60" class="bg-white" />
              <h3 class="mb-0 fw-bold">Sahakka</h3>
            </div>

            <h3 class="fw-semibold" style="margin-bottom: 12px;">Create an account</h3>
            <h6 class="text-mute mb-6">Create your account and manage your task.</h6>

            <form @submit.prevent="handleRegister">
              <label class="mb-2 text-dark">Username</label>
              <BaseInput
                input-style="padding: 12px 0"
                input-class="ps-3 rounded-btn text-dark fs-15"
                input-placeholder="Enter username"
                v-model="form.name"
              />
              <p v-if="err.name" class="text-danger mt-1 fs-14">{{ err.name }}</p>

              <div :class="err.name ? 'mt-3' : 'mt-4'">
                <label class="mb-2 text-dark">Email</label>
                <BaseInput
                  input-style="padding: 12px 0"
                  input-class="ps-3 rounded-btn text-dark fs-15"
                  input-placeholder="Enter email"
                  v-model="form.email"
                />
                <p v-if="err.email" class="text-danger mt-1 fs-14">{{ err.email }}</p>
              </div>

              <div :class="err.email ? 'mt-3 mb-4' : 'my-4'">
                <label class="mb-2 text-dark">Password</label>
                <div class="position-relative">
                  <BaseInput
                    :input-type="showPassword ? 'text' : 'password'"
                    input-style="padding: 12px 0"
                    input-class="ps-3 pe-5 rounded-btn text-dark fs-15"
                    input-placeholder="Enter password"
                    v-model="form.password"
                  />
                  <span
                    class="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="!showPassword" :size="18" color="#aaa" />
                    <EyeOff v-else :size="18" color="#aaa" />
                  </span>
                </div>
                <p v-if="err.password" class="text-danger mt-1 mb-4 fs-14">
                  {{ err.password }}
                </p>
              </div>

              <button
                type="submit"
                class="btn bg-btn w-100 rounded-btn py-2"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
                {{ isLoading ? "Creating..." : "Create account" }}
              </button>
            </form>

            <div class="d-flex mt-4 justify-content-center gap-2">
              <p class="text-dark mb-0">Already have an account?</p>
              <router-link to="/login" class="text-decoration-none">Sign in</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Verify Email Modal -->
  <n-modal v-model:show="showModal" :mask-closable="true">
    <n-card style="width: 420px; border-radius: 16px" :bordered="false">
      <div class="text-center py-2">
        <div class="mb-3">
          <MailCheck :size="52" color="#18181b" />
        </div>
        <h5 class="fw-semibold mb-2">Check your email</h5>
        <p class="text-muted fs-14 mb-1">We sent a verification link to</p>
        <p class="fw-semibold mb-3">{{ registeredEmail }}</p>
        <p class="text-muted fs-14 mb-4">Please verify your email before logging in.</p>
        <button class="btn bg-btn w-100 rounded-btn py-2" @click="openMail">
          Open Mail
        </button>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  require,
  isPassword,
  minlength,
  validates,
  validateUsername,
  isEmail,
} from "@/utils/validate";
import { notify } from "@/utils/toast";
import BaseInput from "@/components/BaseInput.vue";
import Logo from "@/assets/image/image.png";
import { Eye, EyeOff, MailCheck } from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();
const toast = notify(router);

const showPassword = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const registeredEmail = ref("");

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const err = reactive({
  name: "",
  email: "",
  password: "",
});

watch(
  () => form.name,
  (val) => {
    err.name = validates(val, [
      (v) => require(v, "Username is required."),
      (v) => minlength(v, 3, "Username must be at least 3 characters."),
      (v) => validateUsername(v, "Invalid username."),
    ]);
  }
);

watch(
  () => form.email,
  (val) => {
    err.email = validates(val, [
      (v) => require(v, "Email is require"),
      (v) => isEmail(v, "Please enter a valid email address."),
    ]);
  }
);

watch(
  () => form.password,
  (val) => {
    err.password = validates(val, [
      (v) => require(v, "Password is required."),
      (v) =>
        isPassword(v, "Password must contain uppercase, number and special character."),
      (v) => minlength(v, 8, "Password must be at least 8 characters."),
    ]);
  }
);

function validate() {
  err.name = validates(form.name, [
    (v) => require(v, "Username is required."),
    (v) => minlength(v, 3, "Username must be at least 3 characters."),
    (v) => validateUsername(v, "Invalid username."),
  ]);
  err.email = validates(form.email, [
    (v) => require(v, "Email is required."),
    (v) => isEmail(v, "Please enter a valid email address."),
  ]);
  err.password = validates(form.password, [
    (v) => require(v, "Password is required."),
    (v) =>
      isPassword(v, "Password must contain uppercase, number and special character."),
    (v) => minlength(v, 8, "Password must be at least 8 characters."),
  ]);

  return !err.name && !err.email && !err.password;
}

async function handleRegister() {
  if (!validate()) return;
  isLoading.value = true;
  try {
    await authStore.register(form.email, form.password, form.name);
    registeredEmail.value = form.email;
    showModal.value = true;
  } catch (error) {
    toast.error(error.message || "Registration failed");
  } finally {
    isLoading.value = false;
  }
}

function openMail() {
  window.open("https://mail.google.com", "_blank");
}
</script>

<style scoped></style>
