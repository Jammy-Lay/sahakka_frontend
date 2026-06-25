<!-- src/views/NotFoundView.vue -->
<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center">
    <div class="text-center">
      <h1 class="fw-bold">404</h1>
      <p class="text-muted mb-4">Page not found.</p>
      <button @click="$router.back()" class="btn btn-outline-secondary">Go Home</button>
    
    </div>
  </div>
</template>
