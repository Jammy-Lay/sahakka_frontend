<template>
  <div class="container mt-5">
    <section class="vh-100 d-flex align-items-center justify-content-center">
      <!-- <div v-if="auth.loading" class="loading-only">
        <div class="loader"></div>
        <h5 class="mt-5">Loading...</h5>
      </div> -->
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="card shadow-sm border-0">
              <div class="card-body p-5 position-relative">
                <h2 class="fw-bold mb-4 text-center">Login</h2>

                <form @submit.prevent="handleLogin">
                  <div class="mb-3">
                    <label for="emailInput" class="form-label">
                      Email address
                    </label>
                    <input
                      v-model="email"
                      type="text"
                      class="form-control mb-2"
                      id="emailInput"
                      placeholder="name@example.com"
                    />
                    <p v-if="err.email" class="text-danger">{{ err.email }}</p>
                  </div>

                  <div class="mb-3">
                    <label for="passwordInput" class="form-label">
                      Password
                    </label>
                    <input
                      v-model="password"
                      type="password"
                      class="form-control mb-2"
                      id="passwordInput"
                    />
                    <p v-if="err.password" class="text-danger">
                      {{ err.password }}
                    </p>
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label class="form-check-label" for="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="#" class="text-decoration-none small">
                      Forgot password?
                    </a>
                  </div>

                  <div class="d-grid">
                    <button
                      :disabled="isLoading"
                      type="submit"
                      class="btn btn-primary btn-lg"
                    >
                      <span
                        v-if="isLoading"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <span>{{ isLoading ? "Signing In..." : "Sign In" }}</span>
                    </button>
                  </div>

                  <p class="text-center mt-4 mb-0">
                    Don't have an account?
                    <router-link to="/register" class="text-decoration-none"
                      >Sign Up</router-link
                    >
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { isEmail, require, validates } from "@/utils/validate";
import { notify } from "@/utils/toast";

// import { useToast } from "vue-toastification";
// let toast = useToast();

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();
const toast = notify(router);
const isLoading = ref(false);

// toast.error("Something went wrong!");

const err = reactive({
  email: "",
  password: "",
});

function validate() {
  // err.email = require(email.value, "Email is require");
  err.email = validates(email.value, [
    (v) => require(v, "Email is require"),
    (v) => isEmail(v, "Wrong Format Email"),
  ]);

  err.password = require(password.value, "Password is require");

  return !err.email && !err.password;
}

async function handleLogin() {
  if (!validate()) return;
  isLoading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push({ name: "home" });
  } catch (error) {
    // backend error message example
    // console.log(error);
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.loading-only {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  position: relative;
  width: 2.5em;
  height: 2.5em;
  transform: rotate(165deg);
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0.5em;
  height: 0.5em;
  border-radius: 0.25em;
  transform: translate(-50%, -50%);
}

.loader:before {
  animation: before8 2s infinite;
}

.loader:after {
  animation: after6 2s infinite;
}

@keyframes before8 {
  0% {
    width: 0.5em;
    box-shadow:
      1em -0.5em rgba(225, 20, 98, 0.75),
      -1em 0.5em rgba(111, 202, 220, 0.75);
  }

  35% {
    width: 2.5em;
    box-shadow:
      0 -0.5em rgba(225, 20, 98, 0.75),
      0 0.5em rgba(111, 202, 220, 0.75);
  }

  70% {
    width: 0.5em;
    box-shadow:
      -1em -0.5em rgba(225, 20, 98, 0.75),
      1em 0.5em rgba(111, 202, 220, 0.75);
  }

  100% {
    box-shadow:
      1em -0.5em rgba(225, 20, 98, 0.75),
      -1em 0.5em rgba(111, 202, 220, 0.75);
  }
}

@keyframes after6 {
  0% {
    height: 0.5em;
    box-shadow:
      0.5em 1em rgba(61, 184, 143, 0.75),
      -0.5em -1em rgba(233, 169, 32, 0.75);
  }

  35% {
    height: 2.5em;
    box-shadow:
      0.5em 0 rgba(61, 184, 143, 0.75),
      -0.5em 0 rgba(233, 169, 32, 0.75);
  }

  70% {
    height: 0.5em;
    box-shadow:
      0.5em -1em rgba(61, 184, 143, 0.75),
      -0.5em 1em rgba(233, 169, 32, 0.75);
  }

  100% {
    box-shadow:
      0.5em 1em rgba(61, 184, 143, 0.75),
      -0.5em -1em rgba(233, 169, 32, 0.75);
  }
}

.loader {
  position: absolute;
  top: calc(50% - 1.25em);
  left: calc(50% - 1.25em);
}
</style>
