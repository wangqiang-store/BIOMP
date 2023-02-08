import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/view/layout/index.vue";
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: () => import("@/view/login/index.vue"),
  },
  {
    path: "/",
    component: Layout,
    redirect: "/main",
    children: [
      {
        path: "/main",
        component: () => import("@/view/main/index.vue"),
      },
      {
        path: "/baseInfo",
        component: () => import("@/view/baseInfo/index.vue"),
      },
      {
        path: "/baseEdit",
        component: () => import("@/view/baseInfo/baseEdit.vue"),
      },
      // 入驻创业实体管理
      {
        path: "/company",
        redirect: "/company",
        children: [
          {
            path: "",
            component: () => import("@/view/company/index.vue"),
          },
          {
            path: "create",
            component: () => import("@/view/company/create.vue"),
          },
          {
            path: "edit",
            component: () => import("@/view/company/edit.vue"),
          },
          {
            path: "details",
            component: () => import("@/view/company/details.vue"),
          },
        ],
      },
      // 活动沙龙
      {
        path: "/activity",
        redirect: "/activity",
        children: [
          {
            path: "",
            component: () => import("@/view/activity/activityCenter.vue"),
          },
          {
            path: "my",
            component: () => import("@/view/activity/myActivity.vue"),
          },
          {
            path: "create",
            component: () => import("@/view/activity/activityCreate.vue"),
          },
          {
            path: "edit",
            component: () => import("@/view/activity/activityEdit.vue"),
          },
          {
            path: "detail",
            component: () => import("@/view/activity/activityDetail.vue"),
          },
        ],
      },
      // 专家库
      {
        path: "/expert",
        redirect: "/expert",
        children: [
          {
            path: "",
            component: () => import("@/view/expert/index.vue"),
          },
          {
            path: "details",
            component: () => import("@/view/expert/details.vue"),
          },
        ],
      },
      // 通知
      {
        path: "/notify",
        redirect: "/notify/msg",
        component: () => import("@/view/notify/index.vue"),
        children: [
          {
            path: "msg",
            component: () => import("@/view/notify/msg.vue"),
          },
          {
            path: "pending",
            component: () => import("@/view/notify/pending.vue"),
          },
          {
            path: "details",
            name: "notifyDetails",
            component: () => import("@/view/notify/details.vue"),
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
