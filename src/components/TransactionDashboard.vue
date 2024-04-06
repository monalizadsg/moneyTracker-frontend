<template>
  <div class="container">
    <AppBar />
    <div class="main-content d-flex">
      <div class="td-left-col d-flex flex-column">
        <div class="header d-flex pb-2">
          <h3>Transactions</h3>
          <div class="header-right-col d-flex">
            <filter-button :onClickMenu="onHandleFilter"></filter-button>
            <v-btn size="small" color="#26CA99" @click="openDialog">Add</v-btn>
          </div>
        </div>
        <div>
          <transaction-list
            :transactions="transactions"
            :onEdit="onClickEdit"
            :onDelete="onClickDelete"
          ></transaction-list>
        </div>
      </div>
      <div class="td-right-col px-4 py-4">
        <transfer-money
          :onAddTransferData="onHandleAddTransferData"
        ></transfer-money>
      </div>
    </div>
    <form-dialog
      :title="dialogTitle"
      v-model="isOpenDialog"
      @update:isOpenDialog="isOpenDialog = $event"
      :onSubmit="submitForm"
      :resetForm="resetForm"
      :isEdit="isEdit"
    >
      <v-form>
        <v-text-field
          v-model="formData.description"
          label="Description"
          variant="outlined"
        ></v-text-field>
        <category-select
          :categories="categories"
          :value="formData.category"
          @onChange="onCategoryChange"
        ></category-select>
        <v-text-field
          v-model="formData.amount"
          label="Amount"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          type="date"
          v-model="formData.date"
          label="Date"
          variant="outlined"
        ></v-text-field>
      </v-form>
    </form-dialog>
    <confirm-dialog
      title="Transaction"
      v-model="isOpenConfirmDialog"
      @update:isOpenConfirmDialog="isOpenConfirmDialog = $event"
      :onDelete="onDelete"
    >
    </confirm-dialog>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import TransactionList from "../components/TransactionList.vue";
import CategoryService from "../services/CategoryService";
import TransactionService from "@/services/TransactionService";
import WalletService from "@/services/WalletService";
import CategorySelect from "../components/CategorySelect.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import FilterButton from "../components/FilterButton.vue";
import TransferMoney from "../components/TransferMoney.vue";
import { formatDate, getDateRange, sortByDate } from "../commons/utils.js";
import { getErrorMessage } from "../commons/utils.js";

export default {
  name: "TransactionDashboard",
  components: {
    AppBar,
    FormDialog,
    TransactionList,
    CategorySelect,
    ConfirmDialog,
    FilterButton,
    TransferMoney,
  },
  data() {
    return {
      transactions: [],
      dialogTitle: "Add Transaction",
      isOpenDialog: false,
      isOpenConfirmDialog: false,
      formData: {
        description: "",
        category: null,
        amount: "",
        date: formatDate(new Date()),
      },
      categories: [],
      isEdit: false,
      selectedItem: null,
      isDisabled: false,
    };
  },
  async created() {
    this.fetchCategories();
    this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      // get wallet id -> to filter transactions from main wallet
      const walletResult = await WalletService.get(1); // todo: update userid
      const wallet = walletResult.find((x) => x.type === "BASIC");

      // get all transactions
      const transactionResult = await TransactionService.get(1); // TODO: get userId
      const filtered = transactionResult.filter(
        (item) => item.walletId == wallet.id
      ); // get transactions of the main wallet only
      // console.log("filtered", filtered);
      // console.log("walletid", this.basicWalletId);
      this.transactions = sortByDate(filtered); // sort transactions data by date
    },
    async fetchCategories() {
      const categoryData = await CategoryService.get(1);
      this.categories = this.mapCategories(categoryData);
      this.formData.category = this.categories[1];
    },
    async submitForm(event) {
      event.preventDefault();
      this.isOpenDialog = !this.isOpenDialog;
      const userId = 1; // TODO: get userId
      let newData = {
        description: this.formData.description,
        categoryId: this.formData.category.id,
        amount: Number(this.formData.amount),
        date: this.formData.date,
        userId,
        walletId: 1,
      };

      try {
        let upsertPromise = null;
        if (this.selectedItem?.id) {
          upsertPromise = await TransactionService.update(
            newData,
            this.selectedItem.id
          );
          const resData = this.formatResponseData(upsertPromise);
          const index = this.transactions.findIndex(
            (x) => x.id === upsertPromise.id
          );
          this.transactions[index] = resData;
          this.isEdit = false;
        } else {
          upsertPromise = await TransactionService.create(newData);
          const resData = this.formatResponseData(upsertPromise);
          this.transactions.push(resData);
        }

        this.resetForm();
        this.selectedItem = null;
        sortByDate(this.transactions); //  sort transactions data by date
      } catch (error) {
        console.error("Error: ", error.response ? error.response.data : error);
        alert("Error : " + getErrorMessage(error));
      }
    },
    openDialog() {
      this.isOpenDialog = true;
    },
    onCategoryChange(value) {
      this.formData.category = value;
    },
    mapCategories(categories) {
      const incomeCategories = categories.filter(
        (category) => category.type === "income"
      );
      const expenseCategories = categories.filter(
        (category) => category.type === "expense"
      );
      const mappedCategories = [
        { props: { header: "Income" } },
        ...incomeCategories,
        { props: { divider: true } },
        { props: { header: "Expense" } },
        ...expenseCategories,
      ];

      return mappedCategories;
    },
    onClickEdit(selected) {
      this.isOpenDialog = true;
      this.loadDataForEditing(selected);
      this.isEdit = true;
      this.selectedItem = selected;
    },
    loadDataForEditing(selected) {
      this.formData.description = selected.description;
      this.formData.category = selected.category;
      this.formData.amount = selected.amount;
      this.formData.date = selected.date;
    },
    resetForm() {
      this.formData.description = "";
      this.formData.category = this.categories[0];
      this.formData.amount = "";
      this.formData.date = formatDate(new Date());
    },
    onClickDelete(selected) {
      this.isOpenConfirmDialog = true;
      this.selectedItem = selected;
    },
    async onDelete() {
      await TransactionService.delete(this.selectedItem.id);
      this.transactions = this.transactions.filter(
        (x) => x.id != this.selectedItem.id
      );
      this.isOpenConfirmDialog = false;
    },
    formatResponseData(data) {
      const resData = {
        id: data.id,
        description: data.description,
        category: this.categories.find((x) => x.id === data.categoryId),
        amount: data.amount,
        date: data.date,
      };
      return resData;
    },
    async onHandleFilter(timeFrame) {
      const { startDate, endDate } = getDateRange(timeFrame);
      const userId = 1; // TODO: get userId
      this.transactions = await TransactionService.filterByDate(
        userId,
        formatDate(startDate),
        formatDate(endDate)
      );
    },
    async onHandleAddTransferData(transferData) {
      // console.log("transferData", transferData);
      this.transactions.unshift(this.formatResponseData(transferData));
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
}

.main-content {
  /* border: 1px solid green; */
  height: calc(100vh - 90px);
}

.td-left-col {
  width: 70%;
  padding: 20px;
  border-right: 2px solid rgb(226, 226, 226);
}

.header {
  justify-content: space-between;
  align-items: center;
}

.header-right-col {
  gap: 10px;
}
</style>
