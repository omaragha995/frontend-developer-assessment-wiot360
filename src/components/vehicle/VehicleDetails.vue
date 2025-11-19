<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useVehicleStore } from "../../stores/vehicles";

const store = useVehicleStore();
const router = useRouter();

const vehicle = computed(() => store.selectedVehicle);

const openHistory = () => {
  if (vehicle.value) {
    router.push({ name: "history", params: { id: vehicle.value.id } });
  }
};

const centerMap = () => {
  if (vehicle.value) {
    store.requestCenterOnVehicle(vehicle.value.id);
  }
};
</script>

<template>
  <div
    v-if="vehicle"
    style="width: 400px; max-width: 100%; border-left: 1px solid #e5e7eb"
  >
    <v-card flat>
      <v-card-title class="d-flex flex-column align-start">
        <span class="text-subtitle-1 font-weight-medium">{{
          vehicle.name
        }}</span>
        <span class="text-caption text-medium-emphasis"
          >Plate: {{ vehicle.plate }}</span
        >
      </v-card-title>

      <v-card-text>
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title>Type</v-list-item-title>
            <v-list-item-subtitle>{{ vehicle.type }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Status</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip
                :color="
                  vehicle.status === 'online'
                    ? 'success'
                    : vehicle.status === 'alert'
                    ? 'error'
                    : 'grey'
                "
                size="small"
                variant="flat"
              >
                {{ vehicle.status }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Speed</v-list-item-title>
            <v-list-item-subtitle
              >{{ vehicle.speed }} km/h</v-list-item-subtitle
            >
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Last updated</v-list-item-title>
            <v-list-item-subtitle>{{
              vehicle.lastUpdated
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Last address</v-list-item-title>
            <v-list-item-subtitle>{{
              vehicle.lastAddress
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn size="small" color="primary" @click="openHistory">
          View History
        </v-btn>
        <v-btn
          size="small"
          variant="outlined"
          color="primary"
          @click="centerMap"
        >
          Center Map
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
