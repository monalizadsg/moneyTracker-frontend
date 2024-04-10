import BudgetDashboard from "@/components/BudgetDashboard.vue";
import GoalDashboard from "@/components/GoalDashboard.vue";
import HomeDashboard from "@/components/HomeDashboard.vue";
import TransactionDashboard from "@/components/TransactionDashboard.vue";
import CategoryDashboard from "@/components/CategoryDashboard.vue";
import Register from "@/components/AccountRegister.vue";
import Login from "@/components/AccountLogin.vue";

import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: HomeDashboard,
    name: "Home",
    meta: { requiresAuth: true }, // Add meta field to indicate this route requires authentication
  },
  {
    path: "/transactions",
    component: TransactionDashboard,
    name: "Transaction",
    meta: { requiresAuth: true }, // Assuming these pages also require authentication
  },
  {
    path: "/budgets",
    component: BudgetDashboard,
    name: "Budget",
    meta: { requiresAuth: true }, // Assuming these pages also require authentication
  },
  {
    path: "/goals",
    component: GoalDashboard,
    name: "Goal",
    meta: { requiresAuth: true }, // Assuming these pages also require authentication
  },
  {
    path: "/register",
    component: Register,
    name: "Register",
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
  },
  {
    path: "/categories",
    component: CategoryDashboard,
    name: "Caetegory",
    meta: { requiresAuth: true }, // Assuming these pages also require authentication
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem("user"); // or however you're storing logged-in state

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
