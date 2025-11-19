<script setup>
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useVehicleStore } from "../../stores/vehicles";

const route = useRoute();
const router = useRouter();

const store = useVehicleStore();

watch(
  () => route.query,
  (val) => {
    if (!val.vehicleId) {
      store.setSelectedVehicle(null);
      store.clearCenterRequest();
    }
  }
);
</script>

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
