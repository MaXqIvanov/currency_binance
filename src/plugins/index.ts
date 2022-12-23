import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";

// Types
import type { App } from "vue";
import data_bus from "./data_bus";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(data_bus).use(vuetify).use(router);
}
