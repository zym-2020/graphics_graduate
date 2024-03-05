import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

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
    path: "/cesiumFlowInstance",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "CesiumFlowInstance",
        component: () => import("@/views/CesiumFlowInstance.vue"),
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
    path: "/olFlowInstance",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "OlFlowInstance",
        component: () => import("@/views/OpenLayersFlowInstance.vue"),
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
