<template>
  <div class="min-vh-100 overflow-hidden">
    <div class="row g-0">
      <div class="col-lg-6">
        <img
          src="../../assets/image/style 2.jpg"
          alt=""
          class="object-fit-cover w-100 vh-100 d-none d-lg-block"
        />
      </div>
      <div class="col-lg-6">
        <div class="d-flex justify-content-center align-items-center min-vh-100 p-5">
          <div style="width: 468px">
            <div class="d-flex align-items-center gap-2 mb-4">
              <n-avatar :src="Logo" :size="60" class="bg-white" />
              <h3 class="mb-0 fw-bold">Sahakka</h3>
            </div>

            <h3 class="fw-semibold" style="margin-bottom: 12px;">Forgot your password?</h3>
            <h6 class="text-mute mb-6">We'll send a reset link to your email.</h6>

            <form @submit.prevent="forgotPassword">
              <label class="mb-2 text-dark required">Email</label>
              <BaseInput
                input-style="padding: 12px 0"
                input-class="ps-3 rounded-btn text-dark fs-15"
                input-placeholder="Enter email"
                v-model="email"
              />
              <p v-if="err.email" class="text-danger mt-1 fs-14">{{ err.email }}</p>

              <div :class="err.email ? 'mt-3' : 'mt-4'">
                <button
                  type="submit"
                  class="btn bg-btn w-100 rounded-btn py-2"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
                  {{ isLoading ? "Sending..." : "Send reset link" }}
                </button>
              </div>
            </form>

            <div class="d-flex mt-4 justify-content-center gap-2">
              <p class="text-dark mb-0">Remember your password?</p>
              <router-link to="/login" class="text-decoration-none">Sign in</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { require, isEmail, validates } from "@/utils/validate";
import { notify } from "@/utils/toast";
import BaseInput from "@/components/BaseInput.vue";
import Logo from "@/assets/image/image.png";

const authStore = useAuthStore();
const router = useRouter();
const toast = notify(router);

const email = ref("");
const isLoading = ref(false);

const err = reactive({
  email: "",
});

watch(
  () => email.value,
  (val) => {
    err.email = validates(val, [
      (v) => require(v, "Email is required."),
      (v) => isEmail(v, "Please enter a valid email address."),
    ]);
  }
);

function validate() {
  err.email = validates(email.value, [
    (v) => require(v, "Email is required."),
    (v) => isEmail(v, "Please enter a valid email address."),
  ]);
  return !err.email;
}

async function forgotPassword() {
  if (!validate()) return;
  isLoading.value = true;
  try {
    await authStore.forgotPassword(email.value);
    sessionStorage.setItem("allowOtp", "true");
    toast.success("Reset link sent successfully", "/otp");
  } catch (error) {
    toast.success(error.message || "Something went wrong");
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
