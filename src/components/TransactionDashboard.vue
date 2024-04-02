<template>
  <div class="container">
    <AppBar />
    <div class="main-content">
      <div class="header">
        <h4>Transactions</h4>
        <v-btn size="small" color="#26CA99" @click="openDialog">Add</v-btn>
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
      <div>
        <transaction-list
          :transactions="transactions"
          :onEdit="onClickEdit"
          :onDelete="onClickDelete"
        ></transaction-list>
      </div>
    </div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import TransactionList from "../components/TransactionList.vue";
import CategoryService from "../services/CategoryService";
import TransactionService from "@/services/TransactionService";
import CategorySelect from "../components/CategorySelect.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import { format } from "date-fns";

export default {
  name: "TransactionDashboard",
  components: {
    AppBar,
    FormDialog,
    TransactionList,
    CategorySelect,
    ConfirmDialog,
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
        date: format(new Date(), "yyyy-MM-dd"),
      },
      categories: [],
      isEdit: false,
      selectedItem: null,
    };
  },
  async created() {
    this.fetchCategories();
    this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      // fetch transactions
      this.transactions = await TransactionService.get(1); // TODO: get userId
    },
    async fetchCategories() {
      // fetch categories
      const categoryData = await CategoryService.get(1);
      this.categories = this.mapCategories(categoryData);
      this.formData.category = this.categories[1];
    },
    async submitForm(event) {
      event.preventDefault();
      // console.log("Form submitted with data:", this.formData);
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
    },
    openDialog() {
      this.isOpenDialog = true;
    },
    onCategoryChange(value) {
      // console.log("category change:", value);
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
      this.formData.category = this.categories[1];
      this.formData.amount = "";
      this.formData.date = format(new Date(), "yyyy-MM-dd");
    },
    onClickDelete(selected) {
      this.isOpenConfirmDialog = true;
      this.selectedItem = selected;
    },
    async onDelete() {
      // console.log("ondelete", this.selectedItem);
      await TransactionService.delete(this.selectedItem.id);
      const newData = this.transactions.filter(
        (x) => x.id != this.selectedItem.id
      );
      this.transactions = newData;
      this.selectedItem = null;
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
  },
};
</script>

<style scoped>
.container {
  height: 100%;
}

.main-content {
  /* border: 1px solid green; */
  height: calc(100vh - 76px);
  padding: 20px;
}

.header {
  display: flex;
  /* border: 1px solid green; */
  justify-content: space-between;
}
</style>
