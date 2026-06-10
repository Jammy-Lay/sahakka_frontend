<template>
  <header class="fixed-top z-9999">
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container-fluid d-flex justify-between align-items-center h-100">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <img height="50" src="../assets/image/logo-nospace.svg" alt="" srcset="">
        </router-link>

        <button ref="collapse" class="navbar-toggler border-dark border-2 shadow-none rounded-4 px-4 py-2" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <Menu />
        </button>

        <div class="collapse navbar-collapse justify-content-end gap-5 gap-lg-2" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link :to="{ name: 'login' }"
                class="nav-link rounded-btn py-3 text-black d-flex align-items-center gap-2">
                <Mail size="16" />
                Contact us
              </router-link>
            </li>
          </ul>
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
    <div style="height: 8vh"></div>
    <section class="position-relative overflow-hidden hero-section">
      <img src="../assets/image/m.svg" class="position-absolute m-path top-0 start-0 z-0" alt="" style="scale: 1.6 1;">
      <div class="container-fluid h-100">
        <div class="row h-100 align-items-center">
          <div class="col-6 z-2">
            <div class="d-flex flex-column gap-4 justify-content-center">
              <div class="w-fit bg-white rounded-pill d-flex align-items-center gap-2 px-3 py-2">
                <div class="bg-black rounded-circle" style="width: 8px; height: 8px;"></div>
                <p class="m-0 fw-semibold text-nowrap">Now public in beta</p>
              </div>
              <div class="hero-title text-white position-relative w-100">
                <h1>Create, assign, complete and</h1>
                <div class="decorate-hero-btn rounded-pill w-fit px-6 py-3 position-absolute">
                  <img class="position-absolute star star1" src="../assets/image/star.svg" alt="">
                  <img class="position-absolute star star2" src="../assets/image/star.svg" alt="">
                  <p class="display-5 m-0">Submit</p>
                  <img class="position-absolute cursor" src="../assets/image/cursor.svg" alt="">
                </div>
              </div>
              <p class="text-white fs-4 z-1">Sahakka brings tasks into one calm workspace — so your
                team
                spends less time coordinating and more time building.</p>
              <router-link :to="{ name: 'login' }" class="get-started z-1 text-nowrap overflow-hidden">
                <span>Get started</span>
                <div class="icon-container">
                  <ArrowRight class="icon-arrow" size="32" />
                </div>
              </router-link>
            </div>
          </div>
          <div class="col-6 z-1 h-100">
            <div class="position-relative h-100">
              <img src="../assets/image/workspace.png" alt="" class="w-100 workspace-img position-absolute">
              <img src="../assets/image/task-card.png" alt="" class="w-75 task-card-img position-absolute">
            </div>
          </div>
        </div>
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
            <video ref="playVdo" class="w-100 shadow-lg my-5" src="../assets/image/Sahakka.mp4" :autoplay="pause" muted
              loop>
              <source src="../assets/image/Sahakka.webm" type="video/webm" />
              <source src="../assets/image/Sahakka.mp4" type="video/mp4" />
            </video>
            <button @click="play" class="btn position-absolute play-vdo">
              <Pause v-if="pause" />
              <Play v-else />
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
                <FeatureCard :icon="ShieldCheck" color="#008bfc" t1="Role-Base access" t2="Control who sees what"
                  t3="Granular permissions per project, team, or individual. Keep sensitive work private without blocking collaboration." />
              </div>
              <div class="col-12 col-md-6">
                <FeatureCard :icon="ShieldCheck" color="#3bc65e" t1="Team analytics" t2="See how your team works"
                  t3="Cycle time, throughput, and velocity in plain language. Spot bottlenecks before they become crises." />
              </div>
              <div class="col-12 col-md-6">
                <FeatureCard :icon="ShieldCheck" color="#fe8d31" t1="Timeline planning" t2="Deadlines that stick"
                  t3="Visual timelines show who owns what and when it's due" />
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
      </div>
      <div class="container-fluid overflow-x-auto py-5 how-it-work-container">
        <div class="row">
          <div class="col-12">
            <div class="row flex-nowrap gap-4">
              <div class="block p-0"></div>
                <HowItWorkCard 
                  v-for="(content, index) in cardContent"
                  :key="index" 
                  :img="content.src"
                  :color="content.color" 
                  :t1="content.t1" 
                  :t2="content.t2"
                />
              <div class="block"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container mt-5">
        <div class="d-flex align-items-center gap-2 text-bg-dark w-fit px-3 py-2 rounded-pill">
          <h4 class="m-0">Scroll to right</h4>
          <ArrowRight size="24"/>
        </div>
      </div>
    </section>

    <section class="get-started-section bg-black">
      <div class="container">
        <div class="bg-white p-7 d-flex flex-column gap-4" style="border-radius: 3.5rem">
          <div>
            <h2>Get started</h2>
            <h2 class="display-3">Your team's best work starts here</h2>
          </div>
          <p class="fs-4">No credit card required · Free forever for small teams</p>
          <router-link :to="{ name: 'login' }" class="get-started get-started-2 z-1 text-nowrap overflow-hidden">
            <span>Get started</span>
            <div class="icon-container">
              <ArrowRight class="icon-arrow" size="32" />
            </div>
          </router-link>
        </div>
      </div>
    </section>

  </main>

  <footer class="pb-1">
    <div class="container">
      <div class="logo"><img src="../assets/image/logo-nospace.svg" height="70" alt=""></div>
      <div style="height: 60px"></div>
      <div class="row">
        <div class="col-4">
          <h3 class="fw-bold mb-3">Company</h3>
          <ul class="navbar-nav">
            <li>
              <router-link :to="{ name: 'home' }" class="nav-link fw-medium">About us</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="row mt-5 g-3">
        <div class="col-md-6">
          <h6 class="fw-bold text-muted">&copy;&nbsp;{{ new Date().getFullYear() }}  Sahakka, Inc. All rights reserved.</h6>
        </div>
        <div class="col-md-6">
          <h6 class="fw-bold text-muted text-lg-end">Made with care for teams who ship.</h6>
        </div>
      </div>
      <div class="mt-10">
        <img class="w-100" src="../assets/image/shakka-name.svg" alt="">
      </div>
    </div>
  </footer>
  
</template>

<script setup>
  import FeatureCard from '@/components/FeatureCard.vue';
  import HowItWorkCard from '@/components/HowItWorkCard.vue';
  import { ArrowRight, Mail, Menu, Pause, Play, ShieldCheck, X } from 'lucide-vue-next';
  import { ref } from 'vue';

  let playVdo = ref(null);
  let pause = ref(true);

  function imageUrl(name) {
    return new URL('../assets/image/how-it-work/' + name + '.png', import.meta.url).href
  }

  const cardContent = [
    {
      t1: '1. Create your workspace',
      t2: 'Set up in under a minute. Invite members, set roles, and start from a template or a blank slate.',
      color: '#008bfc',
      src: imageUrl('create-workspace')
    },
    {
      t1: '2. Add tasks and deadline',
      t2: 'Break down goals into tasks, assign owners, and set due dates. Drag onto the timeline to build a visual roadmap.',
      color: '#fe8d31',
      src: imageUrl('create-task')
    },
    {
      t1: '3. Collaborate in context',
      t2: 'Comment, attach files, and link related tasks directly in-line — no more chasing updates with that messy messages.',
      color: '#3bc65e',
      src: imageUrl('detail')
    },
    {
      t1: '4. Submit and review',
      t2: 'Track progress with live dashboards, review, and carry learnings into the next cycle.',
      color: '#5d5af2',
      src: imageUrl('task-tracking')
    }
  ];

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

  .hero-section {
    height: 92vh;
    background: #171717;
    padding: 110px 50px;
  }

  .hero-title h1 {
    /* font-size: 6.25rem; */
    font-size: 5rem;
  }

  .decorate-hero-btn {
    --gradient-start: #008efd;
    --gradient-end: #fff;
    --gradient-direction: 45deg;
    border: 4px solid transparent;
    background:
      linear-gradient(#171717, #171717) padding-box,
      linear-gradient(var(--gradient-direction), var(--gradient-start), var(--gradient-end)) border-box;

    right: 5%;
    bottom: 10px;

    p {
      background-image:
        linear-gradient(var(--gradient-direction), var(--gradient-start),
          color-mix(in hsl, var(--gradient-start) 80%, var(--gradient-end) 100%));
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }

  .cursor {
    top: 100px;
    left: 100%;
    animation-name: cursor-moving;
    animation-duration: 500ms;
    animation-timing-function: ease-in;
    animation-iteration-count: 1;
  }

  @keyframes cursor-moving {

    /* scale-in */
    0% {
      scale: 0;
    }

    10% {
      scale: 1;
    }

    100% {}
  }

  .star {
    filter: drop-shadow(0 0 10px #b7deff);
  }

  .star1 {
    top: -65px;
    left: 85%;
    scale: .7;
  }

  .star2 {
    top: -100px;
    left: 100%;
    scale: .5;
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
    padding: 20px;
    gap: 20px;
    border-radius: 999px;

    border: 4px solid transparent;
    background:
      linear-gradient(#171717, #171717) padding-box,
      linear-gradient(var(--gradient-direction), var(--gradient-start), var(--gradient-end)) border-box;
    bottom: 10px;

    &,
    span {
      transition: all 450ms linear(0, 0.528 7%, 0.921 14.4%, 1.07 18.3%, 1.19 22.4%, 1.28 26.7%, 1.34 31.2%, 1.366 34.5%, 1.378 38%, 1.377 41.7%, 1.363 45.6%, 1.308 53.3%, 1.13 71.3%, 1.059 80.1%, 1.013 89.7%, 1);
      /* transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1); */
    }

    span {
      /* width: fit-content; */
      font-size: 1.5rem;
      margin-left: 10px;
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

  .get-started-2 {
    background:
      linear-gradient(#171717, #171717) padding-box,
      linear-gradient(var(--gradient-direction), var(--gradient-start), color-mix(in hsl, var(--gradient-start) 50%, var(--gradient-end) 60%)) border-box;
  }

  .workspace-img {
    top: 5%;
    /* left: 20%; */
    /* transform: translateY(50%); */
    scale: 0.97;
  }

  .task-card-img {
    scale: .7;
    bottom: 0%;
    transform: translateY(25%) translateX(-40%);
    filter: drop-shadow(0 4px 10px hsl(from var(--bs-black) h s l / 0.35));
  }

  .product-section,
  .feature-section,
  .how-it-work-section,
  .get-started-section,
  footer {
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

  
  .how-it-work-section {
    background-color: #f2f5f9;
  }
  
  .how-it-work-container::-webkit-scrollbar {
    height: 15px;
  }

  .how-it-work-container::-webkit-scrollbar-track-piece {
    margin-inline: 310px;
  }

  @media screen and (max-width: 768px) {
    .how-it-work-container::-webkit-scrollbar-track-piece {
      margin-inline: 20px;
    }
  }

  .how-it-work-container::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.3);
    border-radius: 999px;
  }

  .how-it-work-container::-webkit-scrollbar-thumb:hover {
    visibility: visible;
    background-color: gray;
  }

  .block {
    width: 15vw;
  }

  @media screen and (max-width: 1900px) {
    .block {
      width: 10vw;
    }
  }

  @media screen and (max-width: 720px) {
    .play-vdo {
      scale: .7;
      bottom: 40px;
      left: 30px;
    }
    .block {
      width: 0vw;
    }
  }


</style>