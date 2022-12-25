/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "tiny-emitter/instance";
declare module "lodash/cloneDeep";
declare module "vue-virtual-scroll-list";
declare module "vue-clusterize";
