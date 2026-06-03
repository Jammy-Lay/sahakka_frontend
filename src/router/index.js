import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/workspace",
      name: "workspace",
      component: () => import("../layouts/MainLayout.vue"),
      children: [
        {
          path: ":workspace_id/team/:team_id/tasks",
          name: "tasks",
          component: () => import("../views/user/TaskView.vue"),
        },
        {
          path: ":workspace_id/team/:team_id/issues",
          name: "issues",
          component: () => import("../views/user/IssueView.vue"),
        },
        {
          path: ":workspace_id/team/:team_id/documents",
          name: "documents",
          component: () => import("../views/user/DocumentView.vue"),
        },
        {
          path: ":workspace_id/team/:team_id/activity",
          name: "activity",
          component: () => import("../views/user/ActivityView.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
