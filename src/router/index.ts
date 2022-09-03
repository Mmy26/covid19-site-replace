import Vue from "vue";
import * as VueRouter from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import Top from "../components/Top.vue";
import PreDataPage from "../components/PreDataPage.vue";

const routes = [
  {
    path: "/",
    component: Top, // HelloWorldコンポーネントルーティング
  },
  {
    path: "/:id",
    component: PreDataPage, // HelloWorldコンポーネントルーティング
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
