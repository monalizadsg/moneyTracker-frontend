import BudgetDashboard from "@/components/BudgetDashboard.vue";
import GoalDashboard from "@/components/GoalDashboard.vue";
import HomeDashboard from "@/components/HomeDashboard.vue";
import TransactionDashboard from "@/components/TransactionDashboard.vue";
import CategoryDashboard from "@/components/CategoryDashboard.vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: HomeDashboard,
    name: "Home",
  },
  {
    path: "/transactions",
    component: TransactionDashboard,
    name: "Transaction",
  },
  {
    path: "/budgets",
    component: BudgetDashboard,
    name: "Budget",
  },
  {
    path: "/goals",
    component: GoalDashboard,
    name: "Goal",
  },
  {
    path: "/categories",
    component: CategoryDashboard,
    name: "Caetegory"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
