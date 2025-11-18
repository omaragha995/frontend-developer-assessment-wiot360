<script setup></script>

<template>
  <v-app-bar density="comfortable" color="primary" dark>
    <v-app-bar-title>
      <router-link to="/" custom v-slot="{ navigate }">
        <button @click="navigate">Fleet Tracking Dashboard</button>
      </router-link>
    </v-app-bar-title>
    <v-spacer />
    <v-btn to="/" variant="text">Live Map</v-btn>
    <v-btn to="/vehicles" variant="text">Vehicle List</v-btn>
  </v-app-bar>
</template>
