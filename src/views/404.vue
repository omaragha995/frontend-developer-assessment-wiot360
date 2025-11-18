<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToMap = () => {
  router.push({ name: "live-map" });
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <v-container class="fill-height pa-0 not-found" fluid>
    <v-row class="ma-0 text-center" align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="py-10 px-6 px-sm-10 elevation-8 rounded-xl glass-card">
          <v-card-text>
            <v-icon size="80" class="mb-4"> mdi-emoticon-sad-outline </v-icon>

            <h1 class="text-h2 font-weight-bold mb-2">404</h1>

            <h2 class="text-h5 mb-4">Page not found</h2>

            <p class="text-body-1 mb-8">
              The page you’re looking for doesn’t exist, was moved, or the link
              is broken.
            </p>

            <div class="d-flex flex-column flex-sm-row justify-center ga-3">
              <v-btn color="primary" size="large" @click="goToMap">
                Go to Homepage
              </v-btn>

              <v-btn variant="outlined" size="large" @click="goBack">
                Go Back
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.not-found {
  background: radial-gradient(
    circle at top,
    #1e88e5 0,
    #0d47a1 40%,
    #000000 100%
  );
  color: white;
}

.glass-card {
  background: rgba(10, 25, 41, 0.9);
  backdrop-filter: blur(14px);
  color: white;
}
</style>
