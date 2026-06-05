<template>
    <main class="body-login">
        <div class="container-fluid p-0 h-100">
            <div class="row g-0 h-100">

                <div class="col-lg-6 d-none d-lg-block left-panel">
                </div>


                <div class="col-lg-6 col-md-12 right-panel d-flex align-items-center justify-content-center">
                    <div class="form-wrapper">
                        <!-- Compact Brand Logo Header -->
                        <div class="form-header d-flex align-items-center gap-2 mb-4">
                            <img src="../../assets/image/image.png" alt="Sahakka Logo" class="logo" />
                            <h2 class="brand-name m-0">Sahakka</h2>
                        </div>

                        <!-- Header Title Section -->
                        <div class="title-section mb-4">
                            <h3 class="form-title mb-1">Create an account</h3>
                            <p class="form-subtitle">Create your account and manage your task.</p>
                        </div>

                        <!-- Form Main -->
                        <form id="loginFormMain" @submit.prevent="handleRegister">
                            <!-- USERNAME -->
                            <div class="input-group-custom">
                                <label for="username">Username</label>
                                <input id="username" v-model="form.name" type="text" class="form-control"
                                    placeholder="Enter username">
                                <p v-if="err.name" class="text-danger mt-1 tiny-text">{{ err.name }}</p>
                            </div>

                            <!-- EMAIL -->
                            <div class="input-group-custom">
                                <label for="email">Email</label>
                                <input id="email" v-model="form.email" type="email" class="form-control"
                                    placeholder="Enter email">
                                <p v-if="err.email" class="text-danger mt-1 tiny-text">{{ err.email }}</p>
                            </div>

                            <!-- PASSWORD (No Confirm Password Field Below This) -->
                            <div class="input-group-custom">
                                <label for="password">Password</label>
                                <div class="password-wrapper">
                                    <input id="password" v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'" class="form-control"
                                        placeholder="Enter Password" />
                                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                                        @click="showPassword = !showPassword"></i>
                                </div>
                                <p v-if="err.password" class="text-danger mt-1 tiny-text">{{ err.password }}</p>
                            </div>

                            <!-- ACTION BUTTON -->
                            <button type="submit" class="btn btn-submit mt-4" :disabled="isLoading">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isLoading ? "Registering..." : "Create account" }}
                            </button>
                        </form>

                        <!-- LINK TO LOGIN -->
                        <div class="signup-prompt mt-4">
                            Already have an account?
                            <router-link to="/login">Sign in</router-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { require,isPassword, minlength, validates,validateUsername,isEmail} from "@/utils/validate";
import { notify } from "@/utils/toast";

const authStore = useAuthStore();
const router = useRouter();
const toast = notify(router);

const showPassword = ref(false);
const isLoading = ref(false);

const form = reactive({
    name: "",
    email: "",
    password: ""
});

const err = reactive({
    name: "",
    email: "",
    password: ""
});

function validate() {
    err.name = validates(form.name, [
        (v) => require(v, "Username is required."),
        (v) => minlength(v, 3, "Username must be at least 3 characters."),
        (v) => validateUsername(v, "Invalid username.")
    ]);
    err.email = validates(form.email, [
        (v) => require(v, "Email is required."),
        (v) => isEmail(v, "Please enter a valid email address.")
    ]);
    err.password = validates(form.password, [
        (v) => require(v, "Password is required."),
        (v) => isPassword(v, "Password must contain at least one uppercase letter, one lowercase letter, and one number."),
        (v) => minlength(v, 8, "Password must be at least 8 characters.")
    ]);

    return !err.name && !err.email && !err.password;
}

async function handleRegister() {
    if (!validate()) return;

    isLoading.value = true;

    try {
        await authStore.register(
            form.email,
            form.password,
            form.name
        );

        console.log("Registration successful");
        toast.success("Registration successful! Please log in.", "/login");
    } catch (error) {
        if (error.response?.data?.message === "Email already registered") {
            toast.error("Email already registered. Please use a different email.");
            return;
        }

        // console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
    } finally {
        isLoading.value = false;
    }
}
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