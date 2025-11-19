<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useVehicleStore } from "../stores/vehicles";
import vehicleStatus from "../enums/VehicleStatus";

import { capitalizeString } from "../helpers/helpers";

const router = useRouter();
const store = useVehicleStore();
store.initFleet();

const { filteredVehicles } = storeToRefs(store);

const page = ref(1);

const statusOptions = computed(() => [
  { title: "All", value: "all" },
  {
    title: capitalizeString(vehicleStatus.ONLINE.key),
    value: vehicleStatus.ONLINE.key,
  },
  {
    title: capitalizeString(vehicleStatus.OFFLINE.key),
    value: vehicleStatus.OFFLINE.key,
  },
  {
    title: capitalizeString(vehicleStatus.ALERT.key),
    value: vehicleStatus.ALERT.key,
  },
]);

const onRowClick = (vehicle) => {
  store.setSelectedVehicle(vehicle.id);
  router.push({ name: "live-map", query: { vehicleId: vehicle.id } });
  store.requestCenterOnVehicle(vehicle.id);
};

const onHeaderClick = (field) => {
  const newDir =
    store.sortBy === field && store.sortDir === "asc" ? "desc" : "asc";
  store.setSort(field, newDir);
};

const sortIcon = (field) => {
  if (store.sortBy !== field) return "mdi-swap-vertical";
  return store.sortDir === "asc" ? "mdi-arrow-up" : "mdi-arrow-down";
};

watch(page, (val) => {
  store.setPage(val);
});
</script>

<template>
  <v-container fluid class="full-height-container">
    <v-row class="h-100" style="overflow: hidden">
      <v-col cols="12" class="h-100">
        <v-card
          class="h-100"
          style="display: flex; flex-direction: column; overflow: hidden"
        >
          <v-card-title>
            <div class="d-flex flex-column">
              <span class="text-subtitle-1 font-weight-medium">Vehicles</span>
              <span class="text-caption text-medium-emphasis">
                Search, filter and sort the fleet
              </span>
            </div>
          </v-card-title>

          <v-card-text style="overflow: hidden">
            <v-row class="mb-2" dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="store.searchTerm"
                  label="Search by name or plate"
                  density="compact"
                  clearable
                  prepend-inner-icon="mdi-magnify"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="store.statusFilter"
                  :items="statusOptions"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  density="compact"
                />
              </v-col>
            </v-row>

            <v-table fixed-header class="h-100" style="overflow: auto">
              <thead>
                <tr>
                  <th @click="onHeaderClick('name')" class="cursor-pointer">
                    <div class="d-flex align-center">
                      <span class="me-1">Name</span>
                      <v-icon :icon="sortIcon('name')" size="small" />
                    </div>
                  </th>
                  <th @click="onHeaderClick('plate')" class="cursor-pointer">
                    <div class="d-flex align-center">
                      <span class="me-1">Plate</span>
                      <v-icon :icon="sortIcon('plate')" size="small" />
                    </div>
                  </th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last known address</th>
                  <th
                    @click="onHeaderClick('lastUpdated')"
                    class="cursor-pointer"
                  >
                    <div class="d-flex align-center">
                      <span class="me-1">Last updated</span>
                      <v-icon :icon="sortIcon('lastUpdated')" size="small" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="v in filteredVehicles"
                  :key="v.id"
                  @click="onRowClick(v)"
                  style="cursor: pointer"
                >
                  <td>{{ v.name }}</td>
                  <td>{{ v.plate }}</td>
                  <td>{{ v.type }}</td>
                  <td>
                    <v-chip
                      size="small"
                      :color="
                        v.status === vehicleStatus.ONLINE.key
                          ? 'success'
                          : v.status === vehicleStatus.ALERT.key
                          ? 'error'
                          : 'grey'
                      "
                      variant="flat"
                    >
                      {{ v.status }}
                    </v-chip>
                  </td>
                  <td>{{ v.lastAddress }}</td>
                  <td>{{ v.lastUpdated }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>

          <v-card-actions class="justify-center mt-3">
            <v-pagination
              v-model="page"
              :length="Math.ceil(store.vehiclesLength / 50)"
              rounded="circle"
              variant="outlined"
              prev-icon="mdi-chevron-left"
              next-icon="mdi-chevron-right"
              :total-visible="Math.ceil(store.vehiclesLength / 50)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.full-height-container {
  height: calc(100vh - 64px);
  overflow: hidden;
}
.h-100 {
  height: 100%;
}
</style>
