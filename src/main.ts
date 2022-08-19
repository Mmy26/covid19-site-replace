import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router/router";
import VuePapaParse from "vue-papa-parse";

createApp(App).use(VuePapaParse);
createApp(App).use(router).mount("#app");
