<template>
  <div class="container">
    <AppBar />
    <div class="main-content">
      <div class="header">
        <h4>Budgets</h4>
        <form-dialog :title="dialogtitle">
          <v-form @submit.prevent="submitForm">
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
            <time-frame-select
              :timeFrames="timeFrames"
              :value="selectedTimeFrame"
              @onChange="onTimeFrameChange"
            ></time-frame-select>
          </v-form>
        </form-dialog>
      </div>
      <div><budget-list></budget-list></div>
    </div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import CategoryService from "../services/CategoryService";
import CategorySelect from "./CategorySelect.vue";
import TimeFrameSelect from "./TimeFrameSelect.vue";
import BudgetList from "./BudgetList.vue"


export default {
  name: "BudgetDashboard",
  components: {
    AppBar,
    FormDialog,
    CategorySelect,
    TimeFrameSelect,
    BudgetList,
  },
  data() {
    return {
      dialogtitle: "Add Budget",
      formData: {
        category: "",
        amount: "",
        timeFrame: ""
      },
      categories: [],
      selectedCategory: null,
      timeFrames: ["Weekly", "Monthly", "Yearly"],
      selectedTimeFrame: null,
    }
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
      const mappedCategories = categories.filter(
        (category) => category.type === "expense"
      );
      // const mappedCategories = [
      //   { props: { header: "Income" } },
      //   ...incomeCategories,
      //   { props: { divider: true } },
      //   { props: { header: "Expense" } },
      //   ...expenseCategories,
      // ];

      return mappedCategories;
    },
    onTimeFrameChange(value) {
      console.log("time frame change:", value);
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
