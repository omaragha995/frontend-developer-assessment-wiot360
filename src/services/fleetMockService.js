import vehicleStatuses from "../enums/VehicleStatus";

const STATUSES = [];
const TYPES = ["Truck", "Van", "Car"];

for (let status in vehicleStatuses) {
  STATUSES.push(vehicleStatuses[status].key);
}

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// generate random vehicles.
export const generateFleet = (count = 150) => {
  const vehicles = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const id = `v-${String(i).padStart(3, "0")}`;
    const randomLat = randomInRange(24, 26);
    const randomLng = randomInRange(46, 50);
    // const randomLat = randomInRange(22.93, 26.05);
    // const randomLng = randomInRange(51.55, 56.38);

    const history = [];
    for (let h = 10; h >= 0; h--) {
      const timestamp = new Date(now.getTime() - h * 5 * 60 * 1000);
      history.push({
        lat: randomLat + randomInRange(-0.2, 0.2),
        lng: randomLng + randomInRange(-0.2, 0.2),
        timestamp: timestamp.toISOString(),
      });
    }

    const last = history[history.length - 1];

    vehicles.push({
      id,
      name: `Vehicle ${i}`,
      plate: `ABC-${100 + i}`,
      type: TYPES[i % TYPES.length],
      status: STATUSES[i % STATUSES.length],
      speed: Math.round(randomInRange(0, 100)),
      location: { lat: last.lat, lng: last.lng },
      lastUpdated: last.timestamp,
      lastAddress: `Mocked address ${i}`,
      history,
    });
  }

  return vehicles;
};
