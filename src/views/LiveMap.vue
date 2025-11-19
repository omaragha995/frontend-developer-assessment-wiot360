<script setup>
import VehicleMap from "../components/map/VehicleMap.vue";
import { useFleetSimulation } from "../composables/useFleetSimulation";

import VehicleDetails from "../components/vehicle/VehicleDetails.vue";

useFleetSimulation();
</script>

<template>
  <div class="live-map-layout">
    <div style="flex: 3">
      <VehicleMap />
    </div>
    <VehicleDetails />
  </div>
</template>
