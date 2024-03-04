import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/mapboxSymbol",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "MapboxSymbol",
        component: () => import("@/views/MapboxSymbol.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/mapboxFlow",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "MapboxFlow",
        component: () => import("@/views/MapboxFlow.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/mapboxSymbolInstance",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "MapboxSymbolInstance",
        component: () => import("@/views/MapboxSymbolInstance.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/mapboxFlowInstance",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "MapboxFlowInstance",
        component: () => import("@/views/MapboxFlowInstance.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/cesiumSymbol",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "CesiumSymbol",
        component: () => import("@/views/CesiumSymbol.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/cesiumSymbolPrimitive",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "CesiumSymbolPrimitive",
        component: () => import("@/views/CesiumSymbolPrimitive.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/cesiumFlow",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "CesiumFlow",
        component: () => import("@/views/CesiumFlow.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/olSymbol",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "OlSymbol",
        component: () => import("@/views/OpenLayersSymbol.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/olFlow",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "OlFlow",
        component: () => import("@/views/OpenlayersFlow.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
