import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";

// Types
import type { App } from "vue";
import data_bus from "./data_bus";
import sdk_binance from "./sdk_binance";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(data_bus).use(sdk_binance).use(vuetify).use(router);
}
