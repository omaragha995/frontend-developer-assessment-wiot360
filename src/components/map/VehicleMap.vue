<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import leaflet from "leaflet";
import { useRoute, useRouter } from "vue-router";
import { useVehicleStore } from "../../stores/vehicles";
import vehicleStatus from "../../enums/VehicleStatus";

const router = useRouter();
const route = useRoute();

const map = ref(null);
const isMapReady = ref(false); // 👈 new
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
  if (!map.value || !isMapReady.value) return;

  const seenIds = new Set();

  vehicles.forEach((v) => {
    if (!v.location) return;

    seenIds.add(v.id);
    let marker = markers.get(v.id);
    const color = getColorByStatus(v.status);

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

const centerMapOnVehicle = (id) => {
  if (!id || !map.value || !isMapReady.value) return;

  const v = store.vehicles.find((v) => v.id === id);
  if (!v || !v.location) return;

  map.value.setView([v.location.lat, v.location.lng], 11);
};

watch(
  () => route.query,
  (val) => {
    if (!val.vehicleId) {
      store.setSelectedVehicle(null);
      store.clearCenterRequest();
      map.value.setView([25, 48], 6);
    }
  }
);

// when vehicle updated sync with makers.
watch(
  () => store.vehicles,
  (vehicles) => {
    syncMarkers(vehicles);
  },
  { deep: true }
);

// when center map vehicle changed.
watch(
  () => store.centerOnVehicleId,
  (val) => {
    centerMapOnVehicle(val);
    if (val) {
      store.clearCenterRequest();
    }
  }
);

onMounted(() => {
  map.value = leaflet
    .map("vehicle-map", {
      zoomControl: true,
    })
    .setView([25, 48], 6);

  leaflet
    .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    })
    .addTo(map.value);

  isMapReady.value = true; // 👈 mark ready

  // initial markers
  syncMarkers(store.vehicles);

  // initial center if some page already set it before navigation
  if (store.centerOnVehicleId) {
    centerMapOnVehicle(store.centerOnVehicleId);
    store.clearCenterRequest();
  }

  // if selected via query param
  if (route.query.vehicleId) {
    store.setSelectedVehicle(route.query.vehicleId);
  }
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
  markers.clear();
  isMapReady.value = false;
  store.setSelectedVehicle(null);
});
</script>

<template>
  <div id="vehicle-map" class="vehicle-map"></div>
</template>
