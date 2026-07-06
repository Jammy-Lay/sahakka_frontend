<template>
  <Header />
  <div style="height: 100px;"></div>
  <main class="container p-0 overflow-hidden">
    
    <section class="border-bottom">
      <router-link :to="{ name: 'home' }" class="btn back d-flex align-items-center rounded-0 w-fit">
        <ArrowLeft size="16" />
        <span>Back</span>
      </router-link>
    </section>
    
    <section>
      <div class="container-fluid">
        <div class="row g-5">
          <div class="col-lg-6 py-3">
            <h2 class="mt-4 fw-bold display-5 mb-3" :style="{ color: blue}">Building website that helps team work more
              easily.</h2>
            <p class="fs-5 mb-5 text-muted">Sahakka is a Web development company dedicated to creating reliable, scalable, and
              user-friendly digital solutions for businesses of every size.</p>
            <div class="bg-light p-3 rounded-4 mt-10 border border-2">
              <h4 class="fw-bold py-2 rounded-btn w-fit" :style="{color: blue}">
                Technology that we use to build our website
              </h4>
              <div class="d-flex align-items-end gap-5 flex-wrap mt-5 justify-content-between">
                <div v-for="t in tech"
                  class="d-flex flex-column justify-content-center align-items-center w-fit gap-3">
                  <img :src="t.src" :alt="t.name" width="80">
                  <span class="fw-bold">{{ t.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 py-5">
            <swiper effect="cards" :grabCursor="true" :modules="modules" class="mySwiper"
              :cardsEffect="{ slideShadows: false }" @swiper="">
              <swiper-slide v-for="(dt, index) in devTeams" :key="index">
                <DevTeamCard :name="dt.name" :role="dt.role" :image="dt.profile" :lists="dt.responsibility"
                  :linkSocail="dt.socails" />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </section>

    <section>
    </section>
    
  </main>

  <Footer />
</template>

<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { Swiper, SwiperSlide } from 'swiper/vue';
import DevTeamCard from './DevTeamCard.vue';
import dumb from '../assets/image/dev-team-img/dumb.jpg';
import satya from '../assets/image/dev-team-img/satya.jpg';
import sothatt from '../assets/image/dev-team-img/sothatt.jpg';
import vichhra from '../assets/image/dev-team-img/vichhra.jpg';
import jammy from '../assets/image/dev-team-img/jammy.jpg';
import gitHub from '../assets/image/dev-team-img/logo/github.png';
import faceBook from '../assets/image/dev-team-img/logo/facebook.png';
import image1 from '../assets/image/dev-team-img/sponsor/image1.png';
import image2 from '../assets/image/dev-team-img/sponsor/image2.png';
import image3 from '../assets/image/dev-team-img/sponsor/image3.png';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
// import required modules
import { EffectCards } from 'swiper/modules'; 

const modules = [EffectCards];

window.scrollTo({
  top: 0,
  behavior: 'instant'
});

const blue = '#008dfa';

const tech = [
  { name: "Figma", src: "https://blog.greggant.com/images/posts/2019-04-25-figma/Figma.png" },
  { name: "Vue 3 JS", src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/vue-js-icon.png" },
  { name: "NodeJS", src: "https://nodejs.org/static/logos/nodejsHex.svg" },
  { name: "MySQL", src: "https://pngimg.com/uploads/mysql/mysql_PNG23.png" },
];

const ROLE = {
  leader: 'Leader',
  member: 'Member'
}

const memberName = {
  hor: 'Hel Leanghor',
  jammy: 'Lay Jammy',
  satsya: 'Chum Satsya',
  vichhra: 'Khun Vichhra',
  sothatt: 'Chhum Sothatt'
}

const devTeams = [
  {
    profile: jammy, name: memberName.jammy, role: ROLE.leader,
    socails: [
      {
        logo: gitHub,
        socail: 'Jammyboyloy',
        link: 'https://github.com/Jammyboyloy'
      },
      {
        logo: faceBook,
        socail: 'Lay Jammy',
        link: 'https://www.facebook.com/share/191vT2VGSh/?mibextid=wwXIfr'
      }
    ],
    responsibility: ['Back End', 'Front-End', 'DataBase']
  },
  {
    profile: satya, name: memberName.satsya, role: ROLE.member,
    socails: [
      {
        logo: gitHub,
        socail: 'Sphinzy',
        link: 'https://github.com/Sphinzy'
      },
      {
        logo: faceBook,
        socail: 'Satsya',
        link: 'https://www.facebook.com/Sya.27.love'
      }
    ],
    responsibility: ['Back End', 'Front-End']
  },
  {
    profile: vichhra, name: memberName.vichhra, role: ROLE.member,
    socails: [
      {
        logo: gitHub,
        socail: 'vichhra11',
        link: 'https://github.com/vichhra11'
      },
      {
        logo: faceBook,
        socail: 'Vic RA Vze',
        link: 'https://www.facebook.com/share/1EjjinG1oU/'
      }
    ],
    responsibility: ['Front-End']
  },
  {
    profile: sothatt, name: memberName.sothatt, role: ROLE.member,
    socails: [
      {
        logo: gitHub,
        socail: 'sothatt',
        link: 'https://github.com/sothatt'
      },
      {
        logo: faceBook,
        socail: 'Chhum Sothatt',
        link: 'https://www.facebook.com/share/1MeutsUChC/?mibextid=wwXIfr'
      }
    ],
    responsibility: ['Front-End']
  },
  {
    profile: dumb, name: 'Hel Leanghor', role: 'member',
    socails: [
      {
        logo: gitHub,
        socail: 'borntobehor',
        link: 'https://github.com/borntobehor'
      },
      {
        logo: faceBook,
        socail: 'Leang Hor',
        link: 'https://web.facebook.com/leang.hor.250756'
      }
    ],
    responsibility: ['UI/UX (Figma)', 'Front-End']
  },
];

</script>

<style scoped>
.back {
  &:hover {
    background-color: #171717;
    color: var(--bs-white);
  }
}

.swiper {
  width: 400px;
  height: 600px;
  transform: translateX(5%);
  transition: all 300ms ease;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}
</style>
