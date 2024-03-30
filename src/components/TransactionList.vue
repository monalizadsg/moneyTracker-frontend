<template>
  <div>
    <v-list v-if="transactions" lines="one" class="list">
      <v-list-item
        v-for="(item, i) in transactions"
        :key="i"
        class="list-item"
        padding="10px"
      >
        <v-card class="elevation-1 card" outlined>
          <template v-slot:prepend>
            <div class="left-col">
              <v-avatar v-if="item.category.type === 'income'" color="#26ca99">
                <v-icon icon="mdi-alpha-i-circle-outline"></v-icon>
              </v-avatar>
              <v-avatar v-else color="#f4766d">
                <v-icon icon="mdi-alpha-e-circle-outline"></v-icon>
              </v-avatar>
              <div class="left-col-item">
                <div class="item-name">{{ item.description }}</div>
                <div class="item-category">{{ item.category.name }}</div>
              </div>
            </div>
          </template>
          <template v-slot:append>
            <div class="right-col">
              <div class="right-col-item">
                <div
                  :class="
                    item.category.type === 'income' ? 'income' : 'expense'
                  "
                >
                  {{ getSign(item.category.type) }} ${{ item.amount }}
                </div>
                <div class="date">{{ item.date }}</div>
              </div>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-pencil"
                variant="text"
                size="small"
              ></v-btn>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-delete"
                variant="text"
                size="small"
              ></v-btn>
            </div>
          </template>
        </v-card>
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
.list {
  padding: 20px 5px;
}
.list-item {
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  border-radius: 6px;
}

.left-col {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}
.left-col .item-category {
  font-size: 0.875rem;
  opacity: 0.6;
}

.right-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-col-item {
  text-align: right;
  margin-right: 10px;
}

.income {
  color: #26ca99;
  font-weight: 800;
}

.expense {
  color: #f4766d;
  font-weight: 800;
}

.date {
  font-size: 0.875rem;
  opacity: 0.6;
}
</style>
