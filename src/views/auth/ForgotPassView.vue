<template>
  <main class="body-login">
    <div class="container-fluid p-0 h-100">
      <div class="row g-0 h-100">

        <div class="col-lg-6 d-none d-lg-block left-panel">
         
        </div>

        <div class="col-lg-6 col-md-12 right-panel d-flex align-items-center justify-content-center">
          <div class="form-wrapper">
            <div class="form-header d-flex align-items-center gap-2 mb-4">
              <img src="../../assets/image/image.png" alt="Sahakka Logo" class="logo" />
              <h2 class="brand-name m-0">Sahakka</h2>
            </div>

            <div class="title-section mb-4">
              <h3 class="form-title mb-1">Forgot your password?</h3>
              <p class="form-subtitle">We'll send you a reset password via your gmail.</p>
            </div>

            <form id="forgotFormMain" @submit.prevent="forgotPassword">

              <div class="input-group-custom mb-4">
                <label for="email">Email</label>
                <input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  class="form-control" 
                  placeholder="Enter email"
                  required
                >
                <p v-if="err.email" class="text-danger mt-1 tiny-text">{{ err.email }}</p>
              </div>

              <button type="submit" class="btn btn-submit" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? "Sending code…" : "Send code to email" }}
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
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { notify } from "@/utils/toast";
import { require, isEmail, validates } from "@/utils/validate";

const auth = useAuthStore();
const router = useRouter();
const toast = notify(router);

const email = ref("");
const isLoading = ref(false);
const err = reactive({
  email: ""
});

const validate = () => {
  err.email = validates(email.value, [
    (v) => require(v, "Email is required"),
    (v) => isEmail(v, "Wrong email format"),
  ]);
  return !err.email;
};

const forgotPassword = async () => {
  if (!validate()) {
    return;
  }
  
  isLoading.value = true;
  try {
    await auth.forgotPassword(email.value);
    toast.success("Reset password link sent successfully", "/otp");
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  } finally {
    isLoading.value = false;
  }
};
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