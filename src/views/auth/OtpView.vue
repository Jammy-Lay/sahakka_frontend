<template>
    <main class="body-login">
        <div class="container-fluid p-0 h-100">
            <div class="row g-0 h-100">

                <div class="col-lg-6 d-none d-lg-block left-panel">
                    <img src="../../assets/image/style 1.png" alt="Dashboard Preview" class="panel-image-asset" />
                    
                    <!-- <div class="left-brand-header d-flex align-items-center gap-3">
                        <img src="../../assets/image/image.png" alt="Sahakka Logo" class="left-logo" />
                        <h2 class="left-brand-name m-0">Sahakka</h2>
                    </div> -->
                </div>

                <div class="col-lg-6 col-md-12 right-panel d-flex align-items-center justify-content-center">
                    <div class="form-wrapper">
                        <div class="form-header d-flex align-items-center gap-2 mb-4">
                            <img src="../../assets/image/image.png" alt="Sahakka Logo" class="logo" />
                            <h2 class="brand-name m-0">Sahakka</h2>
                        </div>

                        <div class="title-section mb-4">
                            <h3 class="form-title mb-1">OTP reset password</h3>
                            <p class="form-subtitle">We send you OTP via your gmail.</p>
                        </div>

                        <form id="loginFormMain" @submit.prevent="handleOtp">
                            
                            <div class="input-group-custom">
                                <label for="email">Email</label>
                                <input 
                                    id="email" 
                                    v-model="email" 
                                    type="email" 
                                    class="form-control"
                                    placeholder="Enter email"
                                    required
                                >
                            </div>

                            <div class="input-group-custom mt-3">
                                <label>OTP</label>
                                <div class="otp-container d-flex justify-content-between gap-2">
                                    <input 
                                        v-for="(digit, index) in 6" 
                                        :key="index"
                                        :id="'otp-' + index"
                                        v-model="otpDigits[index]"
                                        type="text" 
                                        maxlength="1" 
                                        class="form-control otp-input-box" 
                                        placeholder="1"
                                        @input="handleOtpInput($event, index)"
                                        @keydown.delete="handleOtpBackspace($event, index)"
                                    />
                                </div>
                            </div>

                            <div class="timer-section d-flex align-items-center justify-content-center gap-2 mt-4 mb-2">
                                <span class="timer-text">Resend code in {{ formatTime() }}s</span>
                                <button 
                                    type="button" 
                                    class="btn-resend" 
                                    :disabled="countdown > 0" 
                                    @click="handleResendCode"
                                >
                                    Resend
                                </button>
                            </div>

                            <button type="submit" class="btn btn-submit mt-3" :disabled="isLoading">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isLoading ? "Verifying..." : "Reset passowrd" }}
                            </button>
                        </form>

                        <div class="signup-prompt mt-4">
                            Remember your password?
                            <router-link to="/login">Go back to sign in</router-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const auth = useAuthStore();
const router = useRouter();

const email = ref(auth.ForgotEmail || "");
const isLoading = ref(false);
const countdown = ref(50); 
let timerInterval = null;



const otpDigits = reactive(["", "", "", "", "", ""]);


function handleOtpInput(event, index) {
    const val = event.target.value;
    otpDigits[index] = val.slice(-1); 

    if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
    }
}

function handleOtpBackspace(event, index) {
    if (!otpDigits[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
            prevInput.focus();
            otpDigits[index - 1] = "";
        }
    }
}

function formatTime() {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function handleResendCode() {
    countdown.value = 50;
    startTimer();
}

const handleOtp = async () => {
    
    const finalOtpValue = otpDigits.join("");
    

    
    isLoading.value = true;
    try {
        
        await auth.otp(email.value, finalOtpValue);
        console.log("otp success");
        router.push("/newpassword");
    } catch (error) {
        alert(error.message || "Verification failed");
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    startTimer();
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
*{
    box-sizing: border-box;
    margin: 0%;
    padding: 0;
}
.body-login {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
.h-100 {
    height: 100% !important;
}
.left-panel {
    width: 50%;
    /* position: relative; */
    height: 100%;
    /* width: fit-content; */
    background-image: url("../../assets/image/style\ 1.png");
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat:no-repeat;
    object-fit:cover;
    height: 100%;
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
.right-panel {

    background: #ffffff;
    /* padding: 3rem; */
    height: 100%;
    margin: 0 auto;
}

.form-wrapper {
    width: 100%;
    max-width: 375px;
}

.logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.brand-name {
    font-size: 1.3rem;
    font-weight: 500;
    color: #000000;
    letter-spacing: -0.02em;
}

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

.input-group-custom .form-control::placeholder {
    color: #c7c7cc;
}

.input-group-custom .form-control:focus {
    border-color: #111111;
    box-shadow: none;
    outline: none;
}
.password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.password-wrapper .form-control {
    padding-right: 2.5rem;
}

.password-wrapper i {
    position: absolute;
    right: 1rem;
    cursor: pointer;
    color: #aeaeae;
    font-size: 1.1rem;
}
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

.signup-prompt {
    text-align: center;
    font-size: 0.9rem;
    color: #111111;
}

.signup-prompt a {
    color: #007aff;
    font-weight: 400;
    text-decoration: none;
}

.signup-prompt a:hover {
    text-decoration: underline;
}

.tiny-text {
    font-size: 0.75rem;
}

@media (max-width: 991.98px) {
    .body-login {
        overflow-y: auto;
    }

    .right-panel {
        padding: 3rem 1.5rem;
    }
}
</style>