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

            <h3 class="fw-semibold" style="margin-bottom: 12px">Create New Password</h3>
            <h6 class="text-muted mb-6">Set a new password for your account.</h6>

            <form @submit.prevent="handleNewPassword">
              <label class="mb-2 text-dark">New Password</label>
              <div class="position-relative">
                <BaseInput
                  :input-type="showNewPassword ? 'text' : 'password'"
                  input-style="padding: 12px 0"
                  input-class="ps-3 pe-5 rounded-btn text-dark fs-15"
                  input-placeholder="Enter new password"
                  v-model="form.new_password"
                />
                <span
                  class="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                  @click="showNewPassword = !showNewPassword"
                >
                  <Eye v-if="!showNewPassword" :size="18" color="#aaa" />
                  <EyeOff v-else :size="18" color="#aaa" />
                </span>
              </div>
              <p v-if="err.new_password" class="text-danger mt-1 fs-14">
                {{ err.new_password }}
              </p>

              <div :class="err.new_password ? 'mt-3' : 'my-4'">
                <label class="mb-2 text-dark">Confirm Password</label>
                <div class="position-relative">
                  <BaseInput
                    :input-type="showConfirmPassword ? 'text' : 'password'"
                    input-style="padding: 12px 0"
                    input-class="ps-3 pe-5 rounded-btn text-dark fs-15"
                    input-placeholder="Enter confirm password"
                    v-model="form.confirm_password"
                  />
                  <span
                    class="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <Eye v-if="!showConfirmPassword" :size="18" color="#aaa" />
                    <EyeOff v-else :size="18" color="#aaa" />
                  </span>
                </div>
                <p v-if="err.confirm_password" class="text-danger mt-1 fs-14">
                  {{ err.confirm_password }}
                </p>
              </div>

              <button
                type="submit"
                class="btn bg-btn w-100 rounded-btn py-2"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
                {{ isLoading ? "Resetting..." : "Confirm Change" }}
              </button>
            </form>
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
import { require, isPassword, minlength, validates, isMatch } from "@/utils/validate";
import { notify } from "@/utils/toast";
import BaseInput from "@/components/BaseInput.vue";
import Logo from "@/assets/image/image.png";

const auth = useAuthStore();
const router = useRouter();
const toast = notify(router);

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
let forgotEmail = ref(sessionStorage.getItem("forgot_email"));

const form = reactive({
  new_password: "",
  confirm_password: "",
});

const err = reactive({
  new_password: "",
  confirm_password: "",
});

watch(
  () => form.new_password,
  (val) => {
    err.new_password = validates(val, [
      (v) => require(v, "New password is required."),
      (v) =>
        isPassword(v, "Password must contain uppercase, number and special character."),
      (v) => minlength(v, 8, "Password must be at least 8 characters."),
    ]);
  }
);

watch(
  () => form.confirm_password,
  (val) => {
    err.confirm_password = validates(val, [
      (v) => require(v, "Confirm password is required."),
      (v) =>
        isPassword(v, "Password must contain uppercase, number and special character."),
      (v) => minlength(v, 8, "Password must be at least 8 characters."),
      (v) => isMatch(v, form.new_password, "Passwords do not match."),
    ]);
  }
);

function validate() {
  err.new_password = validates(form.new_password, [
    (v) => require(v, "New password is required."),
    (v) =>
      isPassword(v, "Password must contain uppercase, number and special character."),
    (v) => minlength(v, 8, "Password must be at least 8 characters."),
  ]);
  err.confirm_password = validates(form.confirm_password, [
    (v) => require(v, "Confirm password is required."),
    (v) =>
      isPassword(v, "Password must contain uppercase, number and special character."),
    (v) => minlength(v, 8, "Password must be at least 8 characters."),
    (v) => isMatch(v, form.new_password, "Passwords do not match."),
  ]);
  return !err.new_password && !err.confirm_password;
}

async function handleNewPassword() {
  if (!validate()) return;

  isLoading.value = true;
  try {
    await auth.resetPassword(forgotEmail.value, form.new_password, form.confirm_password);
    toast.success("Password changed successfully", "/login");
    sessionStorage.removeItem("forgot_email");
    form.new_password = "";
    form.confirm_password = "";
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
