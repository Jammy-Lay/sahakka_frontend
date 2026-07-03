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
        <div class="d-flex justify-content-center align-items-center min-vh-100">
          <div style="width: 400px">
            <div class="d-flex align-items-center gap-2 mb-4">
              <n-avatar :src="Logo" :size="60" class="bg-white" />
              <h3 class="mb-0 fw-bold">Sahakka</h3>
            </div>

            <h3 class="fw-semibold" style="margin-bottom: 12px">OTP Verification</h3>
            <h6 class="text-muted mb-6">We send you OTP via your gmail.</h6>

            <form @submit.prevent="handleOtp">
              <n-input-otp v-model:value="value" :length="6" class="custom-otp" />

              <div
                class="d-flex justify-content-center align-items-center gap-2 my-3 text-dark"
                style="min-height: 30px"
              >
                <span v-if="countdown > 0" class="fs-14">
                  Resend code in {{ formatTime() }}
                </span>

                <div v-else class="d-flex gap-2 align-items-center">
                  <span class="text-dark fs-13">Didn't get code?</span>
                  <button
                    type="button"
                    class="btn btn-outline rounded-btn-sm px-2 py-1 fs-13 text-dark"
                    @click="resend"
                  >
                    <span
                      v-if="isResend"
                      class="spinner-border spinner-border-sm me-2"
                    />
                    {{ isResend ? "Sending..." : "Resent" }}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                class="btn bg-btn w-100 rounded-btn py-2"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
                {{ isLoading ? "Verifying..." : "Verify Code" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { notify } from "@/utils/toast";
import Logo from "@/assets/image/image.png";

const auth = useAuthStore();
const router = useRouter();
const toast = notify(router);

const isLoading = ref(false);
const isResend = ref(false);
const value = ref([]);
let forgotEmail = ref(sessionStorage.getItem("forgot_email"));

const OTP_TIME = 59;
const countdown = ref(0);
let timer = null;

function formatTime() {
  const m = Math.floor(countdown.value / 60);
  const s = countdown.value % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}s`;
}

function startTimer(reset = false) {
  clearInterval(timer);

  let expiry;
  if (reset) {
    expiry = Date.now() + OTP_TIME * 1000;
    localStorage.setItem("otp_expiry", expiry);
  } else {
    expiry = localStorage.getItem("otp_expiry");
    if (!expiry) {
      expiry = Date.now() + OTP_TIME * 1000;
      localStorage.setItem("otp_expiry", expiry);
    }
  }

  countdown.value = Math.max(0, Math.floor((Number(expiry) - Date.now()) / 1000));

  timer = setInterval(() => {
    const remaining = Math.max(0, Math.floor((Number(expiry) - Date.now()) / 1000));
    countdown.value = remaining;
    if (remaining <= 0) {
      clearInterval(timer);
      localStorage.removeItem("otp_expiry");
    }
  }, 1000);
}

async function resend() {
  try {
    isResend.value = true;
    await auth.resentOtp(forgotEmail.value);
    startTimer(true);
    value.value = [];
  } catch (err) {
    toast.error(err?.message || "Failed to resend OTP");
  } finally {
    isResend.value = false;
  }
}

async function handleOtp() {
  const otp = value.value.join("");
  if (otp.length !== 6) {
    toast.error("Please enter 6-digit code.");
    return;
  }

  try {
    isLoading.value = true;
    await auth.verifyOtp(forgotEmail.value, otp);
    localStorage.removeItem("otp_expiry");
    toast.success("Verify Successfully", "/new-password");
  } catch (err) {
    toast.error(err.message);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => startTimer());
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
:deep(.custom-otp .n-input__border),
:deep(.custom-otp .n-input__state-border) {
  border: 1.5px solid #e4e4e7 !important;
  box-shadow: none !important;
}

:deep(.custom-otp .n-input) {
  width: 60px !important;
  height: 65px !important;
  border-radius: 12px !important;
}

:deep(.custom-otp input) {
  text-align: center !important;
  font-size: 26px !important;
  font-weight: 500 !important;
  height: 100% !important;
  line-height: 70px !important;
  caret-color: #171717 !important;
}

.btn-outline:hover {
  background-color: white !important;
  color: #171717 !important;
  border: 1px solid grey !important;
}
</style>
