<template>
  <div>
    <h4 class="pb-2">Saving History</h4>
    <div class="transaction-list pb-4 pr-2">
      <v-list v-if="goalTransactions" lines="one" class="list">
        <v-list-item
          v-for="(item, i) in goalTransactions"
          :key="i"
          class="list-item"
          padding="10px"
        >
          <v-card class="elevation-1 card" outlined>
            <template v-slot:prepend>
              <div class="left-col">
                <v-avatar size="35" color="#000000" rounded="50">
                  <v-icon
                    size="small"
                    icon="mdi-piggy-bank"
                    color="#fff"
                  ></v-icon>
                </v-avatar>
                <div class="left-col-item">
                  <div class="item-name">{{ item.description }}</div>
                  <div class="item-category">{{ item.category.name }}</div>
                </div>
              </div>
            </template>
            <template v-slot:append>
              <div class="text-right">
                <div class="amount">
                  {{ getTypeSign(item.category.type) }} ${{ item.amount }}
                </div>
                <div class="date">{{ item.date }}</div>
              </div>
            </template>
          </v-card>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import TransactionService from "@/services/TransactionService";
import { sortByDate, getSign } from "@/commons/utils";
import WalletService from "@/services/WalletService";

export default {
  name: "GoalTransactionList",
  components: {},
  data() {
    return {
      goalTransactions: [],
    };
  },
  async created() {
    this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      // get wallet id -> to filter transactions from main wallet
      const walletResult = await WalletService.get(1); // todo: update userid
      const wallet = walletResult.find((x) => x.type === "BASIC");
      //   console.log("wallet transactions", wallet.id);

      // get transactions of goal wallets only
      const result = await TransactionService.get(1); // TODO: get userId
      const filtered = result.filter((item) => item.walletId != wallet.id);
      //   console.log("filtered", filtered);
      this.goalTransactions = sortByDate(filtered); // sort transactions data by date
    },

    getTypeSign(type) {
      return getSign(type);
    },
  },
};
</script>

<style scoped>
.list {
  width: 100%;
}
.left-col .item-name {
  font-size: 1rem;
  font-weight: bold;
}

.amount {
  font-weight: bold;
}

.left-col .item-category,
.date {
  font-size: 0.875rem;
  opacity: 0.6;
}

.v-card-item {
  border: 1px solid red;
}
</style>
