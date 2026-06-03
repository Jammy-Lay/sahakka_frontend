<template>
  <div class="container mt-5">
    <section class="vh-100 d-flex align-items-center justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="card shadow-sm border-0">
              <div class="card-body p-5 position-relative">
                <h2 class="fw-bold mb-4 text-center">Login</h2>

                <form @submit.prevent="handleLogin">
                  <div class="mb-3">
                    <label for="emailInput" class="form-label"> Email address </label>
                    <input
                      v-model="email"
                      type="text"
                      class="form-control mb-2"
                      id="emailInput"
                      placeholder="name@example.com"
                      autocomplete="current-email"
                    />
                    <p v-if="err.email" class="text-danger">{{ err.email }}</p>
                  </div>

                  <div class="mb-3">
                    <label for="passwordInput" class="form-label"> Password </label>
                    <input
                      v-model="password"
                      type="password"
                      class="form-control mb-2"
                      id="passwordInput"
                      autocomplete="current-password"
                    />
                    <p v-if="err.password" class="text-danger">
                      {{ err.password }}
                    </p>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <a href="#" class="text-decoration-none small"> Forgot password? </a>
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
const router = useRouter();
const toast = notify(router);
const isLoading = ref(false);

const auth = useAuthStore();

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

    // restore last visited route
    const lastVisited = JSON.parse(localStorage.getItem("lastVisitedTeam")) ?? {};
    const entries = Object.entries(lastVisited);

    if (entries.length > 0) {
      // get the last entry
      const [workspace_id, team_id] = entries[entries.length - 1];
      router.push(`/workspace/${workspace_id}/team/${team_id}/tasks`);
    } else {
      router.push({ name: "tasks", params: { workspace_id: 1, team_id: 1 } }); // fallback
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
