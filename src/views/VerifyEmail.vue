<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center bg-body">
    <div class="text-center bg-white p-5 rounded-4" style="width: 460px">
      <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
        <n-avatar :src="Logo" :size="60" class="bg-white" />
        <h3 class="mb-0 fw-bold">Sahakka</h3>
      </div>

      <!-- Success -->
      <template v-if="status === 'success'">
        <h4
          class="fw-semibold mb-2 d-flex align-items-center justify-content-center gap-3"
        >
          <CircleCheckBig class="text-green" size="40" /> Email Verified!
        </h4>
        <p class="text-mute fs-14">Your email has been verified successfully.</p>
        <button class="btn bg-btn w-100 rounded-btn py-2" @click="router.push('/login')">
          Sign In Now
        </button>
      </template>

      <!-- Already Verified -->
      <template v-else-if="status === 'already_verified'">
        <h4
          class="fw-semibold mb-2 d-flex align-items-center justify-content-center gap-2"
        >
          <circle-alert class="text-blue" size="40" /> Already Verified
        </h4>
        <p class="text-mute fs-14">Your email is already verified. Just log in.</p>
        <button class="btn bg-btn w-100 rounded-btn py-2" @click="router.push('/login')">
          Sign In Now
        </button>
      </template>

      <!-- Expired -->
      <template v-else-if="status === 'expired'">
        <h4
          class="fw-semibold mb-2 d-flex align-items-center justify-content-center gap-2"
        >
          <clock4 class="text-danger" size="40" /> Link Expired
        </h4>
        <p class="text-mute fs-14">
          Your verification link has expired. Request a new one.
        </p>
        <button class="btn bg-btn w-100 rounded-btn py-2" @click="showModal = true">
          Resend Verification Email
        </button>
      </template>

      <!-- Resend -->
      <template v-else-if="status === 'resend'">
        <h4
          class="fw-semibold mb-2 d-flex align-items-center justify-content-center gap-2"
        >
          <refresh-cw class="text-purple" size="40" /> Resend Verification Link
        </h4>
        <p class="text-mute fs-14">Didn't receive the verification email?</p>
        <button class="btn bg-btn w-100 rounded-btn py-2" @click="showModal = true">
          Resend Verification Email
        </button>
      </template>
    </div>
    <!-- Resend Modal -->
    <n-modal v-model:show="showModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 450px; margin-top: 15px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Resend Verification Email</span>
          <n-button
            text
            size="small"
            @click="showModal = false"
            class="hover-circle p-1 rounded-circle"
          >
            <X :size="18" />
          </n-button>
        </div>

        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />

        <div class="px-4 pt-2 pb-3">
          <label class="mb-2 fs-13 fw-medium text-dark d-block">Email</label>
          <BaseInput
            v-model="email"
            input-placeholder="Enter your email"
            input-class="py-2 fs-13 rounded-btn-sm"
          />
          <p v-if="err.email" class="text-danger fs-13 mt-1">{{ err.email }}</p>

          <div class="mt-3">
            <BaseButton
              :btnName="isLoading ? 'Sending...' : 'Send Verification Email'"
              class="w-100 fs-13 rounded-btn py-2"
              :disabled="isLoading"
              @click="handleResend"
            />
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Logo from "@/assets/image/image.png";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { isEmail, require, validates } from "@/utils/validate";
import { notify } from "@/utils/toast";
import api from "@/api/https";

const router = useRouter();
const route = useRoute();
const toast = notify(router);

const status = computed(() => route.query.status || "error");

const showModal = ref(false);
const email = ref("");
const isLoading = ref(false);

const err = reactive({
  email: "",
});

watch(email, (val) => {
  err.email = validates(val, [
    (v) => require(v, "Email is required."),
    (v) => isEmail(v, "Wrong format email."),
  ]);
});

function validate() {
  err.email = validates(email.value, [
    (v) => require(v, "Email is required."),
    (v) => isEmail(v, "Wrong format email."),
  ]);
  return !err.email;
}

async function handleResend() {
  if (!validate()) return;
  isLoading.value = true;
  try {
    await api.put("/resend", { email: email.value });
    toast.success("Verification email sent successfully.");
    showModal.value = false;
    email.value = "";
  } catch (error) {
    const msg = error.response?.data?.message;
    if (msg === "Email already verify") {
      err.email = "This email is already verified.";
    } else {
      toast.success("Sent link successfully.");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
