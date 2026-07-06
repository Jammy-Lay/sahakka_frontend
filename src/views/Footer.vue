<template>
  <footer class="pb-1">
    <div class="container">
      <!-- <div class="logo"><img src="../assets/image/logo-nospace.svg" height="70" alt=""></div> -->
      <div style="height: 60px"></div>
      <div class="row">
        <div class="col-4">
          <h3 class="fw-bold mb-3">Company</h3>
          <ul class="navbar-nav">
            <li>
              <router-link :to="{ name: 'about' }" class="nav-link fw-medium w-fit">About us</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-10 pt-10">
        <img class="w-100" src="../assets/image/shakka-name.svg" alt="">
      </div>
      <div class="row mt-2 g-3">
        <div class="col-md-6">
          <h6 class="fw-bold text-muted">&copy;&nbsp;{{ new Date().getFullYear() }}  Sahakka, Inc. All rights reserved.</h6>
        </div>
        <div class="col-md-6">
          <h6 class="fw-bold text-muted text-lg-end">Made with care for teams who ship.</h6>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
footer {
  padding-block: 110px;
}

footer ul li a {
  transition: all 300ms ease;

  /*border-radius: 16px;*/
  &:hover {
    padding-inline: 20px;
    background-color: #171717;
    color: var(--bs-white)
  }
}

</style>