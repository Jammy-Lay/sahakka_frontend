<template>
  <div class="skeleton-container">
    <!-- Header Section -->
    <!-- <header class="skeleton-header">
      <div class="header-left">
        <div class="skeleton-text title pulse"></div>
        <div class="skeleton-text subtitle pulse"></div>
      </div>
      <div class="header-right">
        <div class="skeleton-input pulse"></div>
        <div class="skeleton-button pulse"></div>
      </div>
    </header> -->

    <!-- Cards Grid -->
    <main class="skeleton-grid">
      <div v-for="n in 12" :key="n" class="skeleton-card bg-white p-3 rounded-4">
        <!-- Thumbnail/Media Placeholder -->
        <div class="card-media pulse rounded-3"></div>

        <!-- Document Title Placeholder -->
        <div class="skeleton-text card-title pulse"></div>

        <!-- Footer Info Placeholder -->
        <div class="card-footer">
          <div class="avatar pulse"></div>
          <div class="skeleton-text meta-text pulse"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// No JavaScript logic needed for a pure structural layout placeholder
</script>

<style scoped>
/* Container Layout */
.skeleton-container {
  font-family: sans-serif;
  min-height: 100vh;
}

/* Header Styling */
.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* Grid Layout */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

/* Card Components */
.skeleton-card {
  display: flex;
  flex-direction: column;
}

.card-media {
  width: 100%;
  height: 140px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.more-options {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  margin-left: auto;
}

/* Base Skeleton Text Sizes */
.skeleton-text {
  background-color: #e2e2e2;
  border-radius: 4px;
}

.title {
  width: 120px;
  height: 24px;
}

.subtitle {
  width: 80px;
  height: 14px;
}

.skeleton-input {
  width: 200px;
  height: 36px;
  border-radius: 12px;
}

.skeleton-button {
  width: 130px;
  height: 36px;
  border-radius: 12px;
}

.card-title {
  width: 60%;
  height: 18px;
}

.meta-text {
  width: 100px;
  height: 12px;
}

/* Shimmer Animation Effect */
.pulse {
  background: linear-gradient(90deg, #f0f0f0 25%, #e2e2e2 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
