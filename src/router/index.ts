// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "OrderBook",
        component: () =>
          import(/* webpackChunkName: "OrderBook" */ "@/views/OrderBook.vue"),
      },
      {
        path: "/trading_pairs",
        name: "TradingPairs",
        component: () =>
          import(
            /* webpackChunkName: "TradingPairs" */ "@/views/TradingPairs.vue"
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
