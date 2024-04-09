<template>
  <div>
    <h3 class="pb-2">Save money to Goals</h3>
    <v-btn
      class="rounded-pill"
      size="small"
      color="#26CA99"
      @click="openTransferDialog"
    >
      <template v-slot:prepend>
        <v-icon color="black" icon="mdi-arrow-top-right"></v-icon>
      </template>
      Transfer Money</v-btn
    >
  </div>
  <form-dialog
    :title="title"
    v-model="isOpenDialog"
    @update:isOpenDialog="isOpenDialog = $event"
    :onSubmit="submitForm"
    :resetForm="resetForm"
    :isTransfer="isTransfer"
  >
    <v-form>
      <v-text-field
        v-model="transferData.amount"
        label="Amount"
        variant="outlined"
      ></v-text-field>
      <category-select
        :categories="categories"
        :value="transferData.category"
        disabled
      ></category-select>
      <v-text-field
        type="date"
        v-model="transferData.date"
        label="Date"
        variant="outlined"
      ></v-text-field>
      <v-select
        v-model="transferData.goal"
        :items="goalWallets"
        variant="outlined"
        item-title="name"
        item-value="walletId"
        label="Goal Wallet"
        placeholder="Select Goal Wallet"
        return-object
        @update:modelValue="handleChangeWallet"
      >
      </v-select>
    </v-form>
  </form-dialog>
</template>

<script>
import FormDialog from "./FormDialog.vue";
import CategoryService from "@/services/CategoryService";
import TransactionService from "@/services/TransactionService";
import CategorySelect from "../components/CategorySelect.vue";
import WalletService from "../services/WalletService";
import { formatDate, getUserId } from "@/commons/utils";
import GoalsServices from "@/services/GoalsServices";
export default {
  name: "TransferMoney",
  components: {
    FormDialog,
    CategorySelect,
  },
  props: {
    onAddTransferData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      title: "Transfer Money to Goals",
      isOpenDialog: false,
      isTransfer: true,
      transferData: {
        amount: "",
        category: {},
        date: formatDate(new Date()),
        goal: null,
      },
      goalWallets: null,
      categories: [],
      expTransferCategory: null,
      basicWalletId: null,
      userId: null,
    };
  },
  async created() {
    this.userId = getUserId();
    this.getBasicWalletId();
    this.fetchGoals();
    this.fetchCategory();
  },
  methods: {
    async fetchGoals() {
      const userId = this.userId;
      const result = await GoalsServices.get(userId);
      const mappedGoalWallets = result.map((x) => ({
        id: x.id,
        name: x.name,
        walletId: x.walletId,
      }));
      this.goalWallets = mappedGoalWallets;
      this.transferData.goal = mappedGoalWallets[0];
    },

    async fetchCategory() {
      const userId = this.userId;
      // get income transfer category
      const incTransferCategory = await CategoryService.getByName(
        "Incoming Transfer",
        userId
      );
      this.categories.push(incTransferCategory);
      this.transferData.category = incTransferCategory; // set as default category

      // get expense transfer category
      this.expTransferCategory = await CategoryService.getByName(
        "Outgoing Transfer",
        userId
      );
    },

    async getBasicWalletId() {
      const result = await WalletService.get(this.userId);
      const wallet = result.find((x) => x.type === "BASIC");

      this.basicWalletId = wallet.id;
    },

    openTransferDialog() {
      this.isOpenDialog = true;
    },

    async submitForm(event) {
      event.preventDefault();
      const { amount, category, date, goal } = this.transferData;
      // console.log(amount, category, date, goal);

      this.isOpenDialog = !this.isOpenDialog;
      const userId = this.userId;

      // incoming transfer data to goals
      const incTransferData = {
        description: goal.name,
        categoryId: category.id,
        amount: Number(amount),
        date: date,
        userId,
        walletId: goal.walletId,
      };

      // create transaction for incoming transfer to goal
      const incTransferResult = await TransactionService.create(
        incTransferData
      );
      console.log("result", incTransferResult);

      // outgoing transfer data from transactions
      const expTransferData = {
        description: goal.name,
        categoryId: this.expTransferCategory.id,
        amount: Number(amount),
        date: date,
        userId,
        walletId: this.basicWalletId,
      };

      // create transaction for outgoing transfer from transactions
      const expTransferResult = await TransactionService.create(
        expTransferData
      );

      this.handleOnTransferSuccess(expTransferResult);
      this.resetForm();
    },
    handleChangeWallet(value) {
      this.transferData.goal = value;
    },
    handleOnTransferSuccess(value) {
      this.onAddTransferData(value);
    },
    resetForm() {
      this.transferData.amount = "";
      this.transferData.date = formatDate(new Date());
    },
  },
};
</script>

<style scoped></style>
