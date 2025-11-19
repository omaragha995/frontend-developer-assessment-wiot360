<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import leaflet from "leaflet";
import { useRoute, useRouter } from "vuetify/lib/composables/router.mjs";

import { useVehicleStore } from "../../stores/vehicles";
import vehicleStatus from "../../enums/VehicleStatus";

const router = useRouter();
const route = useRoute();

const map = ref(null);
const markers = new Map();
const store = useVehicleStore();

const getColorByStatus = (status) => {
  for (let st in vehicleStatus) {
    if (vehicleStatus[st].key === status) return vehicleStatus[st].color;
  }
  return "red";
};

const createMarkerIcon = (color) => {
  return leaflet.divIcon({
    className: "vehicle-marker",
    html: `<div class="marker-dot marker-dot--${color}"></div>`,
    iconSize: [12, 12],
  });
};

const syncMarkers = (vehicles) => {
  if (!map.value) return;
  const seenIds = new Set();

  vehicles.forEach((v) => {
    seenIds.add(v.id);
    let marker = markers.get(v.id);
    const color = getColorByStatus(v.status);

    // if marker does not initialize.
    if (!marker) {
      marker = leaflet
        .marker([v.location.lat, v.location.lng], {
          icon: createMarkerIcon(color),
        })
        .addTo(map.value)
        .bindTooltip(`${v.name} (${v.plate})`);

      marker.on("click", () => {
        store.setSelectedVehicle(v.id);
        router.replace({ name: "live-map", query: { vehicleId: v.id } });
      });

      markers.set(v.id, marker);
    } else {
      marker.setLatLng([v.location.lat, v.location.lng]);
      marker.setIcon(createMarkerIcon(color));
    }
  });

  markers.forEach((marker, id) => {
    if (!seenIds.has(id)) {
      marker.remove();
      markers.delete(id);
    }
  });
};

watch(
  () => store.vehicles,
  (vehicles) => {
    syncMarkers(vehicles);
  },
  { deep: true }
);

watch(
  () => store.centerOnVehicleId,
  (val) => {
    if (!val || !map.value) return;
    const v = store.vehicles.find((v) => v.id === val);
    if (v) {
      map.value.panTo([v.location.lat, v.location.lng]);
      map.value.setZoom(11);
    }
    store.clearCenterRequest();
  }
);

onMounted(() => {
  map.value = leaflet
    .map("vehicle-map", {
      zoomControl: true,
    })
    .setView([25, 48], 6);
  // .setView([23.4241, 53.8478], 6);

  leaflet
    .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    })
    .addTo(map.value);

  syncMarkers(store.vehicles);

  // if selected vehicle.
  if (route.value.query.vehicleId) {
    store.setSelectedVehicle(route.value.query.vehicleId);
  }
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
  }
  markers.clear();
});
</script>

<template>
  <div id="vehicle-map" class="vehicle-map"></div>
</template>
