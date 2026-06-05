<template>
    <main class="body-login">
        <div class="container-fluid p-0 h-100">
            <div class="row g-0 h-100">

                <!-- LEFT -->
                <div class="col-lg-6 d-none d-lg-block left-panel">
                    <img src="../../assets/image/style 1.png" class="panel-image-asset" />
                </div>

                <!-- RIGHT -->
                <div class="col-lg-6 col-md-12 right-panel d-flex align-items-center justify-content-center">
                    <div class="form-wrapper">

                        <div class="form-header d-flex align-items-center gap-2 mb-4">
                            <img src="../../assets/image/image.png" class="logo" />
                            <h2 class="brand-name m-0">Sahakka</h2>
                        </div>

                        <div class="title-section mb-4">
                            <h3 class="form-title mb-1">OTP reset password</h3>
                            <p class="form-subtitle">We sent OTP to your email</p>
                        </div>

                        <form @submit.prevent="handleOtp">

                            <!-- OTP -->
                            <div class="input-group-custom mt-3">
                                <n-input-otp v-model:value="value" :length="6" class="custom-otp" />
                            </div>

                            <!-- TIMER -->
                            <div class="timer-section d-flex justify-content-center mt-4">
                                <span class="timer-text">
                                    Resend code in {{ formatTime() }}
                                </span>
                            </div>

                            <!-- SUBMIT -->
                            <button class="btn btn-submit mt-3" :disabled="isLoading">
                                {{ isLoading ? "Verifying..." : "Reset password" }}
                            </button>

                            <div class="signup-prompt mt-4">
                                Remember your password?
                                <router-link to="/login">Go back to sign in</router-link>
                            </div>



                        </form>

                    </div>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { notify } from "@/utils/toast"

const auth = useAuthStore()
const router = useRouter()
const toast = notify(router)
const isLoading = ref(false)

const email = auth.ForgotEmail
// console.log(email);


// OTP value from Naive UI
const value = ref([])



const OTP_TIME = 50
const countdown = ref(0)
let timer = null

// Format time

function formatTime() {
    const m = Math.floor(countdown.value / 60)
    const s = countdown.value % 60
    return `${m}:${s < 10 ? '0' : ''}${s}s`
}


// Start persistent timer

function startTimer() {
    clearInterval(timer)

    let expiry = localStorage.getItem('otp_expiry')

    if (!expiry) {
        expiry = Date.now() + OTP_TIME * 1000
        localStorage.setItem('otp_expiry', expiry)
    }

    timer = setInterval(() => {
        const remaining = Math.max(
            0,
            Math.floor((Number(expiry) - Date.now()) / 1000)
        )

        countdown.value = remaining

        if (remaining <= 0) {
            clearInterval(timer)
            localStorage.removeItem('otp_expiry')
        }
    }, 1000)
}


// Submit OTP
const handleOtp = async () => {
    const otp = value.value.join('')

    if (otp.length !== 6) {
        toast.error('Enter full 6-digit OTP')
        return
    }
    try {
        isLoading.value = true
        await auth.otp(email, otp)
        localStorage.removeItem('otp_expiry')
        router.push('/newpassword')
    } catch (err) {
        toast.error(err?.message || 'Verification failed')
    } finally {
        isLoading.value = false
    }
}


onMounted(() => startTimer())

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* OTP BOX SIZE */
:deep(.custom-otp .n-input) {
    width: 64px !important;
    height: 64px !important;
    border-radius: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* THE REAL INPUT INSIDE */
:deep(.custom-otp input) {
    height: 100% !important;
    text-align: center !important;
    font-size: 26px !important;
    font-weight: 600 !important;
    line-height: 64px !important;
    /* THIS FIXES VERTICAL CENTER */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* fallback Naive UI internal class (important) */
:deep(.custom-otp .n-input__input-el) {
    text-align: center !important;
}

/* TIMER */
.timer-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1c1c1e;
}

/* BUTTON */
.btn-submit {
    width: 100%;
    padding: 12px;
    background: #141416;
    color: #fff;
    border-radius: 8px;
    border: none;
}

/* BASE VIEWPORT SETUP */
.body-login {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.h-100 {
    height: 100% !important;
}

/* LEFT PANEL ADAPTIVE SCALING CONSTRAINTS */
.left-panel {
    position: relative;
    width: 50%;
    height: 100%;
    overflow: hidden;
    background-color: #e6f0fa;
}

.panel-image-asset {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 18% center;
    /* Locks mockup graphic focus dynamically across sizes */
}

.left-brand-header {
    position: absolute;
    top: 45px;
    left: 45px;
    z-index: 10;
}

.left-logo {
    width: 44px;
    height: 44px;
    object-fit: contain;
}

.left-brand-name {
    font-size: 1.85rem;
    font-weight: 500;
    color: #111111;
    letter-spacing: -0.03em;
}

/* RIGHT SIDE FORM PANEL */
.right-panel {
    background: #ffffff;
    height: 100%;
    margin: 0 auto;
}

.form-wrapper {
    width: 100%;
    max-width: 375px;
}

.logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.brand-name {
    font-size: 1.5rem;
    font-weight: 500;
    color: #000000;
    letter-spacing: -0.02em;
}

/* TYPOGRAPHY */
.form-title {
    font-size: 1.65rem;
    font-weight: 500;
    color: #111111;
    letter-spacing: -0.02em;
}

.form-subtitle {
    color: #71717a;
    font-size: 0.95rem;
    font-weight: 400;
}

/* INPUT COMPONENT BLOCKS */
.input-group-custom {
    margin-bottom: 1.15rem;
}

.input-group-custom label {
    font-size: 0.9rem;
    font-weight: 400;
    color: #1c1c1e;
    margin-bottom: 0.5rem;
    display: block;
}

.input-group-custom .form-control {
    border-radius: 8px;
    border: 1px solid #d1d1d6;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    color: #111111;
    background-color: #ffffff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-group-custom .form-control:focus {
    border-color: #111111;
    box-shadow: none;
    outline: none;
}

/* INDIVIDUAL SEPARATED OTP BOX STYLES */
.otp-input-box {
    width: 48px;
    height: 48px;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 500;
    border-radius: 10px !important;
    border: 1px solid #d1d1d6 !important;
    background-color: #f2f2f7 !important;
    padding: 0 !important;
    color: #111111;
}

.otp-input-box::placeholder {
    color: #111111;
    opacity: 0.3;
}

.otp-input-box:focus {
    border-color: #111111 !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
}

/* TIMER & RESEND SUBELEMENTS */
.timer-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1c1c1e;
}

.btn-resend {
    background: #f2f2f7;
    border: 1px solid #e5e5ea;
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #1c1c1e;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.btn-resend:hover:not(:disabled) {
    background-color: #e5e5ea;
}

.btn-resend:disabled {
    cursor: default;
    opacity: 0.6;
}

/* SUBMIT BUTTON ACCENT */
.btn-submit {
    background-color: #141416;
    color: #ffffff;
    border: none;
    padding: 0.75rem;
    font-weight: 400;
    border-radius: 8px;
    width: 100%;
    font-size: 0.95rem;
    transition: background-color 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
    background-color: #232326;
}

/* PROMPTS */
.signup-prompt {
    text-align: center;
    font-size: 0.9rem;
    color: #111111;
}

.signup-prompt a {
    color: #007aff;
    font-weight: 400;
    text-decoration: none;
    margin-left: 0.25rem;
}

.signup-prompt a:hover {
    text-decoration: underline;
}

/* MOBILE VIEW RESPONSIVENESS OVERRIDES */
@media (max-width: 991.98px) {
    .body-login {
        overflow-y: auto;
    }

    .right-panel {
        padding: 3rem 1.5rem;
    }
}
</style>