<template>
  <header class="fixed-top z-9999">
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container-fluid d-flex justify-between align-items-center h-100">
        <a href="#" class="navbar-brand">
          <img height="50" src="../assets/image/logo-nospace.svg" alt="" srcset="">
        </a>

        <button ref="collapse" class="navbar-toggler border-dark border-2 shadow-none rounded-4 px-4 py-2" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <Menu />
        </button>

        <div class="collapse navbar-collapse justify-content-end gap-5 gap-lg-2" id="navbarNav">
          <div class="d-flex gap-2">
            <router-link :to="{ name: 'register' }" class="btn rounded-btn btn-light border px-4 py-2">Sign
              up</router-link>
            <router-link :to="{ name: 'login' }" class="btn rounded-btn btn-primary px-4 py-2">Sign in</router-link>
          </div>
        </div>

      </div>
    </nav>
  </header>
  <div style="height: 8vh"></div>
</template>

<script setup>
</script>

<style scoped>

.btn-light {
  --bs-btn-hover-bg: #e6e6e6;
}

.btn-primary {
  --primary: #171717;
  --action: hsl(from var(--primary) h s calc(l + 10));
  --disable: hsl(from var(--primary) h calc(s + 5) calc(l - 20));
  --bs-btn-bg: var(--primary);
  --bs-btn-border-color: var(--primary);
  --bs-btn-color: #fff;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: var(--action);
  --bs-btn-hover-border-color: var(--primary);
  --bs-btn-focus-shadow-rgb: 49, 132, 253;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: var(--action);
  --bs-btn-active-border-color: var(--action);
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #fff;
  --bs-btn-disabled-bg: var(--disable);
  --bs-btn-disabled-border-color: var(--disable);
}

nav {
  padding: 14px 3.125rem;
}

@media screen and (max-width: 768px) {
  nav {
    padding: 14px 0;
  }
}
</style>