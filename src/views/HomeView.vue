<script setup>
import BaseCard from "@/components/BaseCard.vue";
import CardSkeleton from "@/components/CardSkeleton.vue";
import { ref } from "vue";
const products = ref([
  {
    name: "T-shirt",
    category: "New 1",
  },
  {
    name: "T-shirt",
    category: "New 2",
  },
]);
</script>

<template>
  <div>
    <div class="container pb-5">
      <div class="row g-4">
        <div class="col-md-4 col-lg-3" v-for="n in 2" :key="'skeleton-' + n">
          <CardSkeleton />
        </div>
        <div class="col-md-4 col-lg-3" v-for="product in products" :key="product.category">
          <BaseCard :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>
