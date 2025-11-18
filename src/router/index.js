import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "live-map",
    component: () => import("../views/LiveMap.vue"),
  },
  {
    path: "/vehicles",
    name: "vehicles",
    component: () => import("../views/VehicleList.vue"),
  },
  {
    path: "/vehicles/:id/history",
    name: "history",
    component: () => import("../views/VehicleRouteHistory.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
