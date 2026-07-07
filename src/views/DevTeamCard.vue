<template>
  <div class="w-100 h-100 p-3 dev-card" :class="role.toLowerCase().includes('leader') ? 'leader' : 'member'">
    <div class="d-flex justify-content-between align-items-start pfp p-3 rounded-4">
      <div class="">
        <img :src="image" class="rounded-2" alt="">
        <h3 class="text-white fw-bold mt-3">{{ name }}</h3>
      </div>
      <span class="rounded-3 px-3 py-2 badge">{{ role }}</span>
    </div>
    <div class="mt-5 d-flex flex-column justify-content-between">
      <div>
        <h5 class="my-work fw-bold">What I work on in our website</h5>
        <ul class="fs-5 fw-normal">
          <li v-for="list in lists" :key="list" >{{ list }}</li>
        </ul>
      </div>

      <div class="mt-3">
        <a target="blank" class="btn btn-light border border-2 rounded rounded-3 px-2 w-fit fw-semibold d-flex align-items-center gap-2 mb-2" :href="l.link" v-for="(l, index) in linkSocail" :key="index">
          <img :src="l.logo" alt="" class="logo">
          <span>{{ l.socail }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: String,
  name: String,
  role: String,
  lists: Array,
  linkSocail: Array,
})

</script>

<style scoped>

.dev-card {
  --green: #3bc65e;
  --blue: #008bfc;
  --light: 25;
  --soft-green: hsl(from var(--green) h s calc(l + var(--light)));
  --soft-blue: hsl(from var(--blue) h s calc(l + var(--light)));
  border-radius: 24px;
  background-color: var(--bs-white);
  border: 2px solid;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  
  .badge {
    border: 2px solid;
    letter-spacing: 1.2px;
  }

  .logo {
    --size: 28px;
    width: var(--size);
    height: var(--size);
    object-fit: cover;
  }
}

.leader {
  border-color: var(--green);
  .my-work {
    color: var(--green);
  }
  .pfp {
    background-color: var(--green);
  }
  .badge {
    background-color: var(--blue);
    border-color: var(--soft-blue);
  }
}

.member {
  border-color: var(--blue);
  .my-work {
    color: var(--blue);
  }
  .pfp {
    background-color: var(--blue);
  }
  .badge {
    background-color: var(--green);
    border-color: var(--soft-green);
  }
}

.badge {
  text-transform: capitalize;
}

img {
  --size: 120px;
  width: var(--size);
  height: var(--size);
  object-fit: cover;
}

li::marker {
  font-size: 20px;
}
</style>