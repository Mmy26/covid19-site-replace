<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import StoreProvider from "./StoreProvider.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <StoreProvider>
    <Header />
    <RouterView />
    <Footer />
  </StoreProvider>
</template>

<style></style>
