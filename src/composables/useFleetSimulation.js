import { onMounted, onBeforeUnmount } from "vue";
import { useVehicleStore } from "../stores/vehicles";

import vehicleStatuses from "../enums/VehicleStatus";

export const useFleetSimulation = () => {
  const store = useVehicleStore();
  let timer = null;

  const randomDelta = () => {
    return (Math.random() - 0.5) * 0.05;
  };

  const tick = () => {
    const vehicles = store.vehicles;
    if (!vehicles.length) return;

    // 25% of vehicles.
    const countToUpdate = Math.round(vehicles.length * 0.25);
    const updates = [];

    // update location of 25% vehicles.
    for (let i = 0; i < countToUpdate; i++) {
      const v = vehicles[Math.floor(Math.random() * vehicles.length)];
      const newLat = v.location.lat + randomDelta();
      const newLng = v.location.lng + randomDelta();
      const now = new Date().toISOString();
      const statuses = [];

      for (let status in vehicleStatuses) {
        statuses.push(vehicleStatuses[status].key);
      }

      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const newSpeed = Math.round(Math.random() * 100);

      updates.push({
        id: v.id,
        location: { lat: newLat, lng: newLng },
        status: newStatus,
        speed: newSpeed,
        lastUpdated: now,
        historyPoint: { lat: newLat, lng: newLng, timestamp: now },
      });
    }

    store.applyUpdates(updates);
  };

  onMounted(() => {
    store.initFleet();
    timer = setInterval(tick, 3000);
  });

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });
};
