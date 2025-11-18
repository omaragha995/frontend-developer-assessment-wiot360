<script setup>
import Navbar from "./components/navbar/Navbar.vue";
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
