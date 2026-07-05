<template>

  <Header/>
  <main>
    <RouterView />
    <LandingPageView/>
  </main>
  <Footer/>

</template>

<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';
import LandingPageView from './LandingPageView.vue';
</script>

<style scoped>

</style>