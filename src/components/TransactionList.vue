<template>
  <div>
    <v-list v-if="transactions" lines="one">
      <v-list-item
        v-for="(item, i) in transactions"
        :key="i"
        :title="item.description"
        :subtitle="item.category.name"
      >
        <template v-slot:append>
          <div class="right-item">
            <div
              :class="item.category.type === 'income' ? 'income' : 'expense'"
            >
              {{ getSign(item.category.type) }} ${{ item.amount }}
            </div>
            <div class="date">{{ item.date }}</div>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import TransactionService from "../services/TransactionService";
export default {
  name: "TransactionList",
  data() {
    return {
      transactions: [],
    };
  },
  async created() {
    // fetch transactions
    this.transactions = await TransactionService.get(1);
    console.log(this.transactions);
  },
  methods: {
    getSign(type) {
      return type === "income" ? "+" : "-";
    },
  },
};
</script>

<style scoped>
.right-item {
  text-align: right;
}

.income {
  color: green;
}
.expense {
  color: red;
}

.date {
  font-size: 0.875rem;
  opacity: 0.6;
}
</style>
