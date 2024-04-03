<template>
  <div class="container">
    <AppBar />
    <div class="main-content">
      <h3>Overview</h3>
      <v-row>
        <v-col cols="12" sm="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>Total Balance</v-card-title>
            <v-card-text>{{ totalBalance }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>Total Income</v-card-title>
            <v-card-text>{{ totalIncome }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>Total Expenses</v-card-title>
            <v-card-text>{{ totalExpenses }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <br />
      <h3>Expenses by Category</h3>

      <v-row class="mt-5">
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="(amount, category) in expenseStats"
          :key="category"
        >
          <v-card class="mx-auto" outlined>
            <v-card-title>{{ category }}</v-card-title>
            <v-card-text>${{ amount.toFixed(2) }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- New section for Recent Transactions and Goals without cards -->
      <v-row class="dashboard-sections">
        <!-- Recent Transactions -->
        <v-col cols="12" md="6">
          <h3>Recent Transactions</h3>
          <TransactionList :transactions="limitedTransactions" />
        </v-col>

        <!-- Goals -->
        <v-col cols="12" md="6">
          <h3>Goals</h3>
          <GoalsList :goals="limitedGoals" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import TransactionService from "@/services/TransactionService";
import GoalsServices from "@/services/GoalsServices";
import TransactionList from "../components/TransactionList.vue"; // Update the path as necessary
import GoalsList from "../components/GoalsList.vue"; // Update the path as necessary

export default {
  name: "HomeDashboard",
  components: {
    AppBar,
    TransactionList,
    GoalsList,
  },
  data() {
    return {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      expenseStats: {},
      transactions: [],
      goals: [],
    };
  },
  computed: {
    limitedTransactions() {
      // Limit to 2-3 recent transactions
      return this.transactions.slice(0, 3);
    },
    limitedGoals() {
      // Limit to 2-3 goals
      return this.goals.slice(0, 3);
    },
  },
  async created() {
    await this.fetchData();
    await this.fetchTransactions();
    await this.fetchGoals();
  },
  methods: {
    async fetchData() {
      const userId = 1; // Replace this with the actual logic to retrieve the user's ID
      const transactions = await TransactionService.get(userId);

      this.totalIncome = transactions
        .filter((t) => t.category.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0);

      this.totalExpenses = transactions
        .filter((t) => t.category.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0);

      this.totalBalance = this.totalIncome - this.totalExpenses;

      this.calculateExpenseStatistics(transactions);
    },
    calculateExpenseStatistics(transactions) {
      const expenses = transactions.filter(
        (t) => t.category.type === "expense"
      );

      this.expenseStats = expenses.reduce((acc, curr) => {
        const categoryName = curr.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += curr.amount;
        return acc;
      }, {});
    },
    async fetchTransactions() {
      const userId = 1; // Replace with actual logic to retrieve user's ID
      this.transactions = await TransactionService.get(userId);
    },
    async fetchGoals() {
      const userId = 1; // Replace with actual logic to retrieve user's ID
      this.goals = await GoalsServices.get(userId);
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1; /* Allows the main content to expand and fill the available space */
  overflow-y: auto; /* Ensures that main content can scroll independently if needed */
  padding: 20px;
}

.dashboard-sections {
  margin-top: 20px;
}

.v-card {
  text-align: center;
}

.transaction-list {
  height: auto;
}
</style>
