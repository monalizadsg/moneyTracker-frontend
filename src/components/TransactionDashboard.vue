<template>
  <div class="container">
    <AppBar />
    <div class="main-content">
      <div class="header">
        <h4>Transactions</h4>
        <form-dialog :title="dialogTitle">
          <v-form @submit.prevent="submitForm">
            <v-text-field
              v-model="formData.description"
              label="Description"
              variant="outlined"
            ></v-text-field>
            <category-select
              :categories="categories"
              :value="selectedCategory"
              @onChange="onCategoryChange"
            ></category-select>
            <v-text-field
              v-model="formData.amount"
              label="Amount"
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="formData.date"
              label="Date"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </form-dialog>
      </div>
      <div><transaction-list></transaction-list></div>
    </div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import TransactionList from "../components/TransactionList.vue";
import CategoryService from "../services/CategoryService";
import CategorySelect from "../components/CategorySelect.vue";

export default {
  name: "TransactionDashboard",
  components: {
    AppBar,
    FormDialog,
    TransactionList,
    CategorySelect,
  },
  data() {
    return {
      dialogTitle: "Add Transaction",
      formData: {
        description: "",
        category: "",
        amount: "",
        date: "",
      },
      categories: [],
      selectedCategory: null,
    };
  },
  async created() {
    // fetch categories
    const categoryData = await CategoryService.get(1);
    this.categories = this.mapCategories(categoryData);
    this.selectedCategory = this.categories[1];
    console.log(this.categories);
  },
  methods: {
    submitForm() {
      console.log("Form submitted with data:", this.formData);
    },
    onCategoryChange(value) {
      console.log("category change:", value);
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
