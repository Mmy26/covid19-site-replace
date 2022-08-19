import Vue from "vue";
import * as VueRouter from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import Top from "../components/Top.vue";
import Test from "../components/Test.vue";
import FileInput from "../components/FileInput.vue";

const routes = [
  {
    path: "/",
    component: Top, // HelloWorldコンポーネントルーティング
  },
  {
    path: "/test",
    component: Test, // HelloWorldコンポーネントルーティング
  },
  {
    path: "/fileInput",
    component: FileInput, // HelloWorldコンポーネントルーティング
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
