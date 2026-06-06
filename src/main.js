import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

// npm install vue-toastification@next
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// npm install lucide-vue-next
import * as LucideIcons from "lucide-vue-next";

import "./assets/main.css";
import "./assets/theme.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import naive from "naive-ui";
import VCalendar from "v-calendar";
import "v-calendar/style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(naive);
app.use(VCalendar, {});

app.use(Toast, {
  position: "bottom-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: false,
  transition: "Vue-Toastification__bounce", // bottom → top slide
});

for (const [key, component] of Object.entries(LucideIcons)) {
  app.component(key, component);
}

app.mount("#app");
