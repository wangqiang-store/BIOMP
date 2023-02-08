import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/view/Layout/index.vue";
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/login/index.vue"),
  },
  {
    path: "/",
    component: Layout,
    redirect: "/main",
    children: [
      {
        path: "main",
        name: "main",
        component: () => import("@/view/main/index.vue"),
      },
      {
        path: "operations",
        name: "operations",
        redirect: "/operations/hatch",
        component: () => import("@/view/operations/index.vue"),
        children: [
          {
            path: "hatch",
            name: "hatch",
            component: () => import("@/view/operations/hatch/index.vue"),
          },
          {
            path: "company",
            name: "company",
            component: () => import("@/view/operations/company/index.vue"),
          },
          {
            path: "hatch/details",
            name: "hatchDetails",
            component: () => import("@/view/operations/hatch/details.vue"),
          },
          {
            path: "hatch/create",
            name: "hatchCreate",
            component: () => import("@/view/operations/hatch/create.vue"),
          },
          {
            path: "hatch/edit",
            name: "hatchEdit",
            component: () => import("@/view/operations/hatch/edit.vue"),
          },
          {
            path: "company/details",
            name: "companyDetails",
            component: () => import("@/view/operations/company/details.vue"),
          },
          {
            path: "company/create",
            name: "companyCreate",
            component: () => import("@/view/operations/company/create.vue"),
          },
          {
            path: "company/edit",
            name: "companyEdit",
            component: () => import("@/view/operations/company/edit.vue"),
          },
          {
            path: "notify",
            name: "notify",
            component: () => import("@/view/operations/notify/index.vue"),
          },
          {
            path: "notify/details",
            name: "notifyDetails",
            component: () => import("@/view/operations/notify/details.vue"),
          },
        ],
      },
      {
        path: "database",
        name: "database",
        redirect: "/database/main",
        component: () => import("@/view/database/index.vue"),
        children: [
          {
            path: "main",
            name: "databaseMain",
            component: () => import("@/view/database/main.vue"),
          },
          {
            path: "create",
            name: "databaseCreate",
            component: () => import("@/view/database/create.vue"),
          },
          {
            path: "edit",
            name: "databaseEdit",
            component: () => import("@/view/database/edit.vue"),
          },
          {
            path: "details",
            name: "databaseDetails",
            component: () => import("@/view/database/details.vue"),
          },
        ],
      },
      {
        path: "activity",
        name: "activity",
        redirect: "/activity/core",
        component: () => import("@/view/activity/index.vue"),
        children: [
          {
            path: "mine",
            name: "activityMine",
            component: () => import("@/view/activity/mine/index.vue"),
          },
          {
            path: "core",
            name: "activityCore",
            component: () => import("@/view/activity/core/index.vue"),
          },
          {
            path: "publish",
            name: "activityPublish",
            component: () => import("@/view/activity/mine/publish.vue"),
          },
          {
            path: "edit",
            name: "activityEdit",
            component: () => import("@/view/activity/mine/edit.vue"),
          },
          {
            path: "details",
            name: "activityDetails",
            component: () => import("@/view/activity/details.vue"),
          },
        ],
      },
      {
        path: "statistics",
        name: "statistics",
        component: () => import("@/view/statistics/index.vue"),
      },
      {
        path: "config",
        name: "config",
        redirect: "/config/user/base",
        component: () => import("@/view/config/index.vue"),
        children: [
          {
            path: "user/base",
            name: "userBase",
            component: () => import("@/view/config/base/index.vue"),
          },
          {
            path: "log",
            name: "log",
            component: () => import("@/view/config/log/index.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
