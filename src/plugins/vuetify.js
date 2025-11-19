import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css"; // <-- make sure this is here

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      // use icon *names*, not @mdi/js paths
      prev: "mdi-chevron-left",
      next: "mdi-chevron-right",
    },
    sets: {
      mdi,
    },
  },
});

export default vuetify;
