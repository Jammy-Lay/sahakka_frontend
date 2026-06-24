<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center bg-body">
    <div class="text-center bg-white p-5 rounded-4" style="width: 460px">
      <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
        <img src="../assets/image/image.png" alt="" style="width: 60px; height: 60px" />
        <h3 class="fw-bold mb-0">Sahakka</h3>
      </div>

      <h4 class="fw-semibold">Your email not yet verify</h4>
      <p class="text-mute fs-14">
        We sent a verification link to your email address. Click the link to activate your
        account.
      </p>
      <button class="btn bg-btn rounded-btn py-2 w-100" @click="openMail">
        Check your inbox
      </button>
      <div class="d-flex mt-3 justify-content-center gap-2 fs-14">
        <p class="text-dark mb-0">Didn't receive it?</p>
        <router-link to="/verify-email?status=resend" class="text-decoration-none">Resend Link</router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
function openMail() {
  window.open("https://mail.google.com", "_blank");
}
</script>
