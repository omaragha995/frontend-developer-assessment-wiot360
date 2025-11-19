<script setup>
import VehicleMap from "../components/map/VehicleMap.vue";
import { useFleetSimulation } from "../composables/useFleetSimulation";

useFleetSimulation();
</script>

<template>
  <div class="live-map-layout">
    <div style="flex: 3">
      <VehicleMap />
    </div>
  </div>
</template>
