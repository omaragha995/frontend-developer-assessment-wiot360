<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import leaflet from "leaflet";
import { useVehicleStore } from "../stores/vehicles";

import VehicleHistory from "../components/vehicle/VehicleHistory.vue";

const route = useRoute();
const router = useRouter();
const store = useVehicleStore();
store.initFleet();

const map = ref(null);
const polyline = ref(null);
const startMarker = ref(null);
const endMarker = ref(null);

const vehicle = computed(() =>
  store.vehicles.find((v) => v.id === route.params.id)
);

const metrics = computed(() => {
  if (!vehicle.value || !vehicle.value.history.length) return null;
  const points = vehicle.value.history;
  const start = new Date(points[0].timestamp);
  const end = new Date(points[points.length - 1].timestamp);
  const durationMs = end - start;
  const durationHours = durationMs / (1000 * 60 * 60);

  let distanceKm = 0;
  for (let i = 1; i < points.length; i++) {
    distanceKm += haversine(
      points[i - 1].lat,
      points[i - 1].lng,
      points[i].lat,
      points[i].lng
    );
  }

  const avgSpeed = durationHours > 0 ? distanceKm / durationHours : 0;

  return {
    durationHours,
    distanceKm,
    avgSpeed,
  };
});

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const initMap = () => {
  if (!vehicle.value || map.value) return;
  const first = vehicle.value.history[0];
  map.value = leaflet
    .map("history-map-inner")
    .setView([first.lat, first.lng], 11);
  leaflet
    .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    })
    .addTo(map.value);
  drawRoute();
};

const drawRoute = () => {
  if (!map.value || !vehicle.value || !vehicle.value.history.length) return;
  const latlngs = vehicle.value.history.map((p) => [p.lat, p.lng]);

  if (polyline.value) {
    polyline.value.setLatLngs(latlngs);
  } else {
    polyline.value = leaflet.polyline(latlngs, { weight: 4 }).addTo(map.value);
  }

  const start = latlngs[0];
  const end = latlngs[latlngs.length - 1];

  if (startMarker.value) {
    startMarker.value.setLatLng(start);
  } else {
    startMarker.value = leaflet
      .marker(start)
      .addTo(map.value)
      .bindTooltip("Start");
  }

  if (endMarker.value) {
    endMarker.value.setLatLng(end);
  } else {
    endMarker.value = leaflet.marker(end).addTo(map.value).bindTooltip("End");
  }

  const bounds = leaflet.latLngBounds(latlngs);
  map.value.fitBounds(bounds, { padding: [40, 40] });
};

onMounted(() => {
  if (!vehicle.value) {
    router.replace({ name: "vehicles" });
    return;
  }
  setTimeout(initMap, 0);
});

watch(vehicle, (val) => {
  if (val && map.value) {
    drawRoute();
  }
});
</script>

<template>
  <VehicleHistory :vehicle="vehicle" :metrics="metrics" />
  <!-- <v-container fluid v-if="vehicle">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Route history - {{ vehicle.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Plate: {{ vehicle.plate }} · Type: {{ vehicle.type }}
              </div>
            </div>
            <div
              v-if="metrics"
              class="d-flex flex-wrap ga-4 text-caption text-medium-emphasis"
            >
              <div class="me-6">
                <div class="text-uppercase">Duration</div>
                <div class="text-body-2 text-high-emphasis">
                  {{ formatDuration(metrics.durationHours) }}
                </div>
              </div>
              <div class="me-6">
                <div class="text-uppercase">Distance</div>
                <div class="text-body-2 text-high-emphasis">
                  {{ metrics.distanceKm.toFixed(1) }} km
                </div>
              </div>
              <div>
                <div class="text-uppercase">Avg speed</div>
                <div class="text-body-2 text-high-emphasis">
                  {{ metrics.avgSpeed.toFixed(1) }} km/h
                </div>
              </div>
            </div>
          </v-card-title>

          <v-card-text>
            <div id="history-map-inner" class="history-map-inner" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-alert
      type="warning"
      title="Vehicle not found"
      text="Returning to vehicle list..."
    />
  </v-container> -->
</template>
