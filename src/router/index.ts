import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/mapboxSymbol",
    name: "MapboxSymbol",
    component: () => import("@/views/MapboxSymbol.vue"),
  },
  {
    path: "/mapboxFlow",
    name: "MapboxFlow",
    component: () => import("@/views/MapboxFlow.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
