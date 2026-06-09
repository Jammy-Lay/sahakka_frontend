<template>
  <header class="fixed-top z-9999">
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container-fluid d-flex justify-between">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <img height="50" src="../assets/image/logo.svg" alt="" srcset="">
        </router-link>

        <button ref="collapse" class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <Menu />
        </button>

        <div class="collapse navbar-collapse justify-content-end gap-2" id="navbarNav">
          <button class="btn rounded-btn px-4 py-2 d-flex align-items-center gap-2">
            <Mail size="16" />
            Contact us
          </button>
          <div class="d-flex gap-2">
            <router-link :to="{ name: 'register' }" class="btn rounded-btn btn-light border px-4 py-2">Sign
              up</router-link>
            <router-link :to="{ name: 'login' }" class="btn rounded-btn btn-primary px-4 py-2">Sign in</router-link>
          </div>
        </div>

      </div>
    </nav>
  </header>

  <main>
    <div style="height: 88px"></div>
    <section class="position-relative overflow-hidden">
      <img src="../assets/image/m.svg" class="position-absolute top-0 start-0 z-0" alt="" style="scale: 1.6 1;">
      <div class="container-fluid hero-section d-flex flex-column gap-4">
        <div class="w-fit bg-white rounded-pill d-flex align-items-center gap-2 px-3 py-1">
          <div class="bg-black rounded-circle" style="width: 8px; height: 8px;"></div>
          <p class="m-0">Now public in beta</p>
        </div>
        <div class="hero-title text-white position-relative" style="width: 745px">
          <h1>Create, assign, complete and</h1>
          <div class="decorate-hero-btn rounded-pill w-fit px-6 py-3 position-absolute start-100">
            <img class="position-absolute star star1" src="../assets/image/star.svg" alt="">
            <img class="position-absolute star star2" src="../assets/image/star.svg" alt="">
            <p class="display-5 m-0">Submit</p>
            <img class="position-absolute cursor" src="../assets/image/cursor.svg" alt="">
          </div>
        </div>
        <p class="text-white fs-4 z-1" style="width: 745px">Sahakka brings tasks into one calm workspace — so your team
          spends less time coordinating and more time building.</p>
        <router-link :to="{ name: 'login' }" class="get-started z-1 text-nowrap overflow-hidden">
          <span>Get started</span>
          <div class="icon-container">
            <ArrowRight class="icon-arrow" size="32" />
          </div>
        </router-link>
      </div>
    </section>
  
    <section class="product-section">
      <div class="container">
        <div class="row g-5">
          <div class="col-12 section-title">
            <h3 class="fs-2">Product</h3>
            <h2>One workspace, every view your team needs</h2>
          </div>
          <div class="col-12 position-relative">
            <video ref="playVdo" class="w-100 shadow-lg my-5" src="../assets/image/Sahakka.mp4" :autoplay="pause" muted loop>
              <source src="../assets/image/Sahakka.webm" type="video/webm" />
              <source src="../assets/image/Sahakka.mp4" type="video/mp4" />
            </video>
            <button @click="play" class="btn position-absolute play-vdo">
              <Pause v-if="pause"/>
              <Play v-else/>
            </button>
          </div>
          <div class="col-12">
            <p class="fs-4">Update everything by just click and select.</p>
          </div>
        </div>
      </div>
    </section>
  
    <section class="feature-section">
      <div class="container">
        <div class="row g-5">
          <div class="col-12 section-title">
            <h3 class="fs-2 position-relative feature-title w-fit">
              Feature
              <img class="star star1 position-absolute" src="../assets/image/star-black.svg" alt="">
              <img class="star star2 position-absolute" src="../assets/image/star-black.svg" alt="">
            </h3>
            <h2>Built for teams that move fast</h2>
          </div>
          <div class="col-12 feature-card-container">
            <div class="row g-4">
              <div class="col-12">
                <FeatureCard 
                  :icon="ShieldCheck"
                  color="#008bfc"
                  t1="Role-Base access"
                  t2="Control who sees what"
                  t3="Granular permissions per project, team, or individual. Keep sensitive work private without blocking collaboration."
                />
              </div>
              <div class="col-6">
                <FeatureCard 
                  :icon="ShieldCheck"
                  color="#3bc65e"
                  t1="Team analytics"
                  t2="See how your team works"
                  t3="Cycle time, throughput, and velocity in plain language. Spot bottlenecks before they become crises."
                />
              </div>
              <div class="col-6">
                <FeatureCard 
                  :icon="ShieldCheck"
                  color="#fe8d31"
                  t1="Timeline planning"
                  t2="Deadlines that stick"
                  t3="Visual timelines show who owns what and when it's due"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <section class="how-it-work-section">
      <div class="container">
        <div class="row">
          <div class="col-12 section-title">
            <h3 class="fs-2">How it works</h3>
            <h2>From chaos to clarity in four steps</h2>
          </div>
        </div>
        <div class="row overflow-x-scroll">
          <HowItWorkCard src="" color="#008bfc" t1="1. Create your workspace" t2="Set up in under a minute. Invite members, set roles, and start from a template or a blank slate."/>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  import FeatureCard from '@/components/FeatureCard.vue';
import HowItWorkCard from '@/components/HowItWorkCard.vue';
  import { ArrowRight, Mail, Menu, Pause, Play, ShieldCheck, X } from 'lucide-vue-next';
  import { ref } from 'vue';

  let playVdo = ref(null);
  let pause = ref(true);

  function play() {
    pause.value = !pause.value;
    if (pause.value) {
      playVdo.value.play();
    } else {
      playVdo.value.pause();
    }
  }

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

  .decorate-hero-btn {
    --gradient-start: #008efd;
    --gradient-end: #fff;
    --gradient-direction: 45deg;
    border: 4px solid transparent;
    background:
      linear-gradient(#171717, #171717) padding-box,
      linear-gradient(var(--gradient-direction), var(--gradient-start), var(--gradient-end)) border-box;
    bottom: 10px;

    p {
      background-image:
        linear-gradient(var(--gradient-direction), var(--gradient-start), color-mix(in hsl, var(--gradient-start) 80%, var(--gradient-end) 100%));
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }


  .hero-section {
    height: 100vh;
    background: #171717;
    padding: 110px 50px
  }

  .hero-title h1 {
    font-size: 6.25rem;
  }

  .cursor {
    top: 50px;
    right: -20px
  }

  .star {
    filter: drop-shadow(0 0 10px #b7deff);
  }

  .star1 {
    top: -80px;
    left: 90%;
  }

  .star2 {
    top: -120px;
    left: 110%;
    scale: .6;
  }

  .get-started {
    --gradient-start: #008efd;
    --gradient-end: #fff;
    --gradient-direction: 45deg;
    interpolate-size: allow-keywords;
    width: 200px;
    /* max-width: 150px; */
    color: var(--bs-white);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px;
    gap: 20px;
    border-radius: 999px;
    transition: width 0.2s ease-in-out;

    border: 4px solid transparent;
    background:
      linear-gradient(#171717, #171717) padding-box,
      linear-gradient(var(--gradient-direction), var(--gradient-start), var(--gradient-end)) border-box;
    bottom: 10px;

    span {
      /* width: fit-content; */
      font-size: 1.5rem;
      margin-left: 10px;
      transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .icon-container {
      background-color: var(--bs-white);
      color: var(--bs-black);
      border-radius: 999px;
      padding: 8px;
      margin-left: 50px;
      transition: all 0.4s ease;
    }

    &:hover {
      width: 270px;
      /* width: fit-content; */

      .icon-container {
        margin-left: 0px;
        margin-right: 400px;
      }

      span {
        margin-left: 20px;
        margin-right: 0px;
      }
    }

  }

  .product-section, .feature-section, .how-it-work-section {
    padding-block: 110px;
  }

  .product-section {
    background-color: var(--bs-white);
    opacity: 1;
    background-image: radial-gradient(hsl(from var(--bs-gray) h s l / 0.2) 3px, var(--bs-white) 3px);
    background-size: 50px 50px;
  }

  video {
    aspect-ratio: 16 / 9;
    border-radius: clamp(0px, 100vw, 10px);
  }
  
  .section-title {
    h2 {
      font-size: clamp(1.5rem, 4rem, 10rem);
    }
  }

  .feature-section {
    background: var(--bs-white);
    background: linear-gradient(180deg, rgb(0, 145, 255, .5) 0%, #fff 100%);
  }

  .feature-title {
    img {
      filter: drop-shadow(0 0 0 #0000);
    }
    .star1 {
      top: -20px;
      left: 100%;
    }

    .star2 {
      top: -40px;
      left: 120%;
    }
  }

  .play-vdo {
    --size: 50px;
    width: var(--size);
    height: var(--size);
    bottom: 60px;
    left: 50px;
    color: black;
    background-color: white;
    border-radius: 50%;
  }

  @media screen and (max-width: 720px) {
    .play-vdo {
      scale: .7;
      bottom: 40px;
      left: 30px;
    }
  } 


</style>