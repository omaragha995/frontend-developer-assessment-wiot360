import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// import leaflet styles.
import "leaflet/dist/leaflet.css";

// init & import vuetify styles & icons.
import vuetify from "./plugins/vuetify";

// import global styles.
import "./style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
