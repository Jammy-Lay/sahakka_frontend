<template>
  <main class="main">
    <div class="container-fluid px-0">
      <div class="page-header">
        <h1 class="page-title">Sahhak Support</h1>
        <p class="page-sub text-mute">Get help, report issues</p>
      </div>

      <div class="mt-5">
        <div class="text-center mb-4">
          <h2 class="page-title">How can we help you?</h2>
          <p class="page-sub text-mute">Send your problem or issue and we'll fix it for you.</p>
        </div>
        <!-- <p>{{ message }}</p> -->

        <div class="support-form">
          <label class="required">Describe your issue</label>
          <textarea v-model="message" class="form-control support-textarea"
            placeholder="Describe your issue..."></textarea>

          <button
            class="btn bg-btn w-100 rounded-btn py-2 fs-15 mt-2 d-flex justify-content-center align-items-center gap-2"
            @click="sendReport" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" />
            <Send v-else size="16" />
            {{ isLoading ? "Sending..." : "Send report" }}
          </button>

          <p class="page-sub fs-14 text-center">
            We'll review your message and get back to you as soon as possible.
          </p>

          <div class="email-card">
            <div class="email-icon-wrap">
              <img src="https://images.icon-icons.com/2642/PNG/512/google_mail_gmail_logo_icon_159346.png"
                alt="Gmail logo" class="email-icon" />
            </div>
            <div>
              <p class="email-label">Email Support</p>
              <a href="mailto:sahakka.dev@gmail.com" class="email-link">
                sahakka.dev@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { Send, MailCheck, AlertTriangle } from "lucide-vue-next"
import { notify } from "@/utils/toast";
import { useRouter, useRoute } from "vue-router";
import { useProfileStore } from "@/stores/profile/profile"

const router = useRouter();
const toast = notify(router);
const isLoading = ref(false);


const message = ref("")
const showModal = ref(false)
const showErrorModal = ref(false)
const profileStore = useProfileStore();
const email = ref("");

onMounted(async () => {
  await profileStore.getProfile()
  email.value = profileStore.user.email
  // console.log(email.value);

})

async function sendReport() {
  if (!message.value.trim()) {
    showErrorModal.value = true
    return toast.error("Please enter a message before sending.");
  }

  isLoading.value = true;
  try {
    const res = await fetch('https://formspree.io/f/xykqpzke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: profileStore.user?.email ?? "",
        message: message.value
      })
    })

    // const data = await res.json()
    if (res.ok) {
      showModal.value = true
      message.value = ""
      toast.success("Mail sent! We'll get back to you within 24 hours.");
    } else {
      showErrorModal.value = true
      toast.error("Failed to send mail. Please try again.");
    }

  } catch (err) {
    // console.error('Network error:', err)
    showErrorModal.value = true
    toast.error(err);

  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.main {
  flex: 1;
  padding: 32px 28px;
  background: #f2f5f9;
  overflow-y: auto;
}

.page-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
  margin-bottom: 8px;
}

.page-title {
  font-size: 30px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.025em;
  color: #09090b;
}

.page-sub {
  font-size: 18px;
  font-weight: 400;
  color: #aab0c4;
  line-height: 28px;
  margin-top: 2px;
  margin-bottom: 4px;
}

.fs-14 {
  font-size: 14px !important;
}

.support-form {
  max-width: 660px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.support-textarea {
  height: 200px;
  resize: vertical;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 14px;
}

.support-textarea:focus {
  border-color: #ffffff;
  box-shadow: 0 0 0 1px rgba(24, 95, 165, 0.1);
  outline: none;
}

.email-card {
  background: white;
  border: 0.5px solid var(--color-border-tertiary, #e5e7eb);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 320px;
  margin: 4px auto 0;
}

.email-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: #fbeaf0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.email-label {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 500;
}

.email-link {
  font-size: 13px;
  color: #185fa5;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 360px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.modal-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #09090b;
  margin: 0;
}

.modal-sub {
  font-size: 14px;
  color: #aab0c4;
  margin: 0;
  line-height: 1.6;
}
</style>