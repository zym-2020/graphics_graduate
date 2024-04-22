import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

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
    path: "/cesiumSymbolInstance",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "CesiumSymbolInstance",
        component: () => import("@/views/CesiumSymbolInstance.vue"),
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
  {
    path: "/olSymbolInstance",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "OlSymbolInstance",
        component: () => import("@/views/OpenLayersSymbolInstance.vue"),
        meta: {
          keepAlive: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
