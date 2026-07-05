import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Sahakka — Team Collaboration Made Simple" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { title: "About | Sahakka" },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue"),
      meta: { title: "Sign Up | Sahakka" },
    },
    {
      path: "/otp",
      name: "otp",
      component: () => import("../views/auth/OtpView.vue"),
      meta: { title: "OTP Verification | Sahakka" },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../views/auth/ForgotPassView.vue"),
      meta: { title: "Forgot Password | Sahakka" },
    },
    {
      path: "/new-password",
      name: "new-password",
      component: () => import("../views/auth/newPassword.vue"),
      meta: { title: "Reset Password | Sahakka" },
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
          meta: { title: "Tasks | Sahakka" },
        },
        {
          path: ":workspace_id/team/:team_id/submissions",
          name: "submissions",
          component: () => import("../views/user/SubmissionView.vue"),
          meta: { title: "Submissions | Sahakka" },
        },
        {
          path: ":workspace_id/team/:team_id/issues",
          name: "issues",
          component: () => import("../views/user/IssueView.vue"),
          meta: { title: "Issues | Sahakka" },
        },
        {
          path: ":workspace_id/team/:team_id/documents",
          name: "documents",
          component: () => import("../views/user/DocumentView.vue"),
          meta: { title: "Documents | Sahakka" },
        },
        {
          path: ":workspace_id/team/:team_id/documents/:document_id/editor",
          name: "editor",
          component: () => import("../views/user/DocumentEditorView.vue"),
          meta: { title: "Editor | Sahakka" },
        },
        {
          path: ":workspace_id/team/:team_id/activity",
          name: "activity",
          component: () => import("../views/user/ActivityView.vue"),
          meta: { title: "Activity | Sahakka" },
        },
        {
          path: ":workspace_id/team/:team_id/viewMember",
          name: "viewMember",
          component: () => import("../views/user/ViewMember.vue"),
          meta: { title: "Team Members | Sahakka" },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
      meta: { title: "Login | Sahakka" },
    },
    {
      path: "/verify-email",
      name: "verify-email",
      component: () => import("@/views/VerifyEmail.vue"),
      meta: { title: "Verify Email | Sahakka" },
    },
    {
      path: "/invite",
      name: "invite",
      component: () => import("../views/InviteView.vue"),
      meta: { title: "Invitation | Sahakka" },
    },
    {
      path: "/not-verify",
      name: "not-verify",
      component: () => import("../views/NotVerifyEmailView.vue"),
      meta: { title: "Email Not Verified | Sahakka" },
    },
    {
      path: "/no-workspace",
      name: "no-workspace",
      component: () => import("../views/NoWorkspaceView.vue"),
      meta: { title: "No Workspace | Sahakka" },
    },
    {
      path: "/settings",
      component: () => import("../layouts/ProfileLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/settings/profile",
        },
        {
          path: "profile",
          component: () => import("../views/profile/profileView.vue"),
          meta: { title: "Profile Settings | Sahakka" },
        },
        {
          path: "password",
          component: () => import("../views/profile/ChangePassword.vue"),
          meta: { title: "Change Password | Sahakka" },
        },
        {
          path: "support",
          component: () => import("../views/profile/support.vue"),
          meta: { title: "Support | Sahakka" },
        },
      ],
    },
    {
      path: "/admin/",
      component: () => import("../layouts/AdminLayout.vue"),
      children: [
        {
          path: "dashboard",
          component: () => import("../views/admin/DashboardView.vue"),
          meta: { title: "Dashboard | Sahakka" },
        },
        {
          path: "users",
          component: () => import("../views/admin/UsersView.vue"),
          meta: { title: "Users | Sahakka" },
        },
        {
          path: "workspaces",
          component: () => import("../views/admin/WorkspacesView.vue"),
          meta: { title: "Workspaces | Sahakka" },
        },
        {
          path: "/admin/workspaces/:id",
          name: "workspace-detail",
          component: () => import("../views/admin/WorkspaceDetail.vue"),
          meta: { title: "Workspace Detail | Sahakka" },
        },
        {
          path: "teams",
          component: () => import("../views/admin/TeamsView.vue"),
          meta: { title: "Teams | Sahakka" },
        },
        {
          path: "/admin/workspace/:workspace_id/teams/:id",
          component: () => import("../views/admin/TeamDetail.vue"),
          meta: { title: "Team Detail | Sahakka" },
        },
        {
          path: "activities-team",
          component: () => import("../views/admin/ActivitiesTeamView.vue"),
          meta: { title: "Team Activities | Sahakka" },
        },
        {
          path: "tasks",
          component: () => import("../views/admin/TaskView.vue"),
          meta: { title: "Tasks | Sahakka" },
        },
        {
          path: "setting",
          component: () => import("../views/admin/SettingView.vue"),
          meta: { title: "Admin Settings | Sahakka" },
        },
      ],
    },
    {
      path: "/loading",
      name: "loading",
      component: () => import("../components/layouts/Loading.vue"),
      meta: { title: "Loading | Sahakka" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: { title: "404 Not Found | Sahakka" },
    },
  ],
});

// Dynamic title handler
router.afterEach((to) => {
  document.title = to.meta.title || "Sahakka — Team Collaboration Made Simple";
});

export default router;
