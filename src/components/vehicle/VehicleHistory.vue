<script setup>
import { defineProps } from "vue";

defineProps(["vehicle", "metrics"]);

const formatDuration = (hours) => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `${m} min`;
  return `${h} h ${m} min`;
};
</script>

<template>
  <v-container fluid v-if="vehicle">
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
  </v-container>
</template>
