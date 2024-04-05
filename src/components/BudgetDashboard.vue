<template>
  <div class="container">
    <AppBar />
    <div class="main-content">
      <div class="header">
        <h4>Budgets</h4>
        <div class="header-right-col">
          <v-btn size="small" color="#26CA99" @click="openDialog">Add</v-btn>
        </div>
      </div>
      <div>
        <form-dialog
          :title="dialogTitle"
          v-model="isOpenDialog"
          @update:isOpenDialog="isOpenDialog = $event"
          :onSubmit="submitForm"
          :resetForm="resetForm"
          :isEdit="isEdit"
        >
          <v-form @submit.prevent="submitForm">
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
            <time-frame-select
              :timeFrames="timeFrames"
              :value="formData.timeFrame"
              @onChange="onTimeFrameChange"
            ></time-frame-select>
          </v-form>
        </form-dialog>
        <confirm-dialog
          title="Budget"
          v-model="isOpenConfirmDialog"
          @update:isOpenConfirmDialog="isOpenConfirmDialog = $event"
          :onDelete="onDelete"
        >
        </confirm-dialog>
      </div>
      <div>
        <budgetList
          ref="budgetList"
          :budgets="budgets"
          :onEdit="onClickEdit"
          :onDelete="onClickDelete"
        >
        </budgetList>
      </div>
    </div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import CategoryService from "../services/CategoryService";
import CategorySelect from "./CategorySelect.vue";
import TimeFrameSelect from "./TimeFrameSelect.vue";
import BudgetList from "./BudgetList.vue";
import BudgetService from "../services/BudgetService";
import ConfirmDialog from "./ConfirmDialog.vue";
import { getErrorMessage } from "../commons/utils.js";
// import TransactionService from "../services/TransactionService";

export default {
  name: "BudgetDashboard",
  components: {
    AppBar,
    FormDialog,
    CategorySelect,
    TimeFrameSelect,
    BudgetList,
    ConfirmDialog,
  },
  data() {
    return {
      dialogtitle: "Add Budget",
      budgets: [],
      formData: {
        category: "",
        amount: "",
        timeFrame: "Monthly",
      },
      categories: [],
      isOpenDialog: false,
      isOpenConfirmDialog: false,
      selectedCategory: null,
      timeFrames: ["Weekly", "Monthly", "Yearly"],
      selectedTimeFrame: null,
      isEdit: false,
      selectedItem: null,
      categoryTotals: {},
    };
  },
  async created() {
    // fetch categories
    const categoryData = await CategoryService.get(1);
    this.categories = this.mapCategories(categoryData);
    this.formData.category = this.categories[0];
    // this.formData.timeFrame = this.timeFrames[1];
    this.fetchBudgets();
  },
  methods: {
    async fetchBudgets() {
      // fetch budgets
      const result = await BudgetService.get(1); // TODO: get userId
      this.budgets = result;
    },
    onCategoryChange(value) {
      this.formData.category = value;
    },
    mapCategories(categories) {
      const mappedCategories = categories.filter(
        (category) => category.type === "expense"
      );

      return mappedCategories;
    },
    onTimeFrameChange(value) {
      this.formData.timeFrame = value; // Update formData.timeFrame directly
    },
    openDialog() {
      this.isOpenDialog = true;
    },
    async submitForm(event) {
      event.preventDefault();
      this.isOpenDialog = !this.isOpenDialog;
      //hardcoded userId
      const userId = 1;

      let newData = {
        userId,
        categoryId: this.formData.category.id,
        amount: Number(this.formData.amount),
        timeFrame: this.getTimeFrameValue(this.formData.timeFrame),
      };
      let dataUpdate = {
        categoryId: this.formData.category.id,
        amount: Number(this.formData.amount),
        timeFrame: this.getTimeFrameValue(this.formData.timeFrame),
      };
      // Log selected category and time frame
      // console.log("Selected category:", dataUpdate.categoryId);
      // console.log("Selected time frame:", dataUpdate.timeFrame);
      // console.log("user:", dataUpdate.userId);
      // console.log("amount:", dataUpdate.amount);

      try {
        let upsertPromise = null;
        if (this.selectedItem?.id) {
          console.log("ID+ " + this.selectedItem.id);
          console.log("Selected category:", newData.categoryId);
          console.log("Selected time frame:", newData.timeFrame);
          console.log("user:", newData.userId);
          console.log("amount:", newData.amount);

          upsertPromise = await BudgetService.update(
            dataUpdate,
            this.selectedItem.id
          );
          console.log("Upsert Promise:", upsertPromise); // promise checking

          const resData = this.formatResponseData(upsertPromise);
          const index = this.budgets.findIndex(
            (x) => x.id === upsertPromise.id
          );
          this.budgets[index] = resData;
          this.isEdit = false;
        } else {
          upsertPromise = await BudgetService.create(newData);
          console.log("Upsert Promise:", upsertPromise); // promise checking
          const resData = this.formatResponseData(upsertPromise);
          this.budgets.push(resData);
        }

        this.resetForm();
        this.$refs.budgetList.updateBudgets();
      } catch (error) {
        console.error("Error: ", error.response ? error.response.data : error);
        alert("Error: " + getErrorMessage(error));
      }
    },
    getTimeFrameValue(timeFrame) {
      if (timeFrame === "Weekly") {
        return "week";
      } else if (timeFrame === "Monthly") {
        return "month";
      } else if (timeFrame === "Yearly") {
        return "year";
      }
    },
    formatResponseData(data) {
      const resData = {
        id: data.id,
        category: this.categories.find((x) => x.id === data.categoryId),
        amount: data.amount,
        timeframe: this.getTimeFrameValue(data.timeFrame),
      };
      return resData;
    },
    resetForm() {
      this.formData.amount = "";
      this.selectedCategory = this.categories[0]; // Reset category selection to the first category
      this.selectedTimeFrame = this.timeFrames[1];
    },
    onClickEdit(selected) {
      this.isOpenDialog = true;
      console.log("Selected item in onClickEdit:", selected); // Add this line
      this.loadDataForEditing(selected);
      this.isEdit = true;
      this.selectedItem = selected;
    },
    loadDataForEditing(selected) {
      // this.formData.category = this.categories.find(
      //   (x) => x.id === selected.category.id
      // );
      // this.formData.amount = selected.amount;
      // this.formData.timeFrame = this.timeFrames.find(
      //   (x) => x === selected.timeFrame
      // );
      console.log("Selected item in loadDataForEditing:", selected); // Add this line
      this.formData.category = selected.category;
      this.formData.amount = selected.amount;
      // this.formData.timeFrame = selected.timeFrame;
      if (selected.timeFrame === "week") {
        return (this.formData.timeFrame = "Weekly");
      } else if (selected.timeFrame === "month") {
        return (this.formData.timeFrame = "Monthly");
      } else if (selected.timeFrame === "year") {
        return (this.formData.timeFrame = "Yearly");
      }
    },
    onClickDelete(selected) {
      this.isOpenConfirmDialog = true;
      this.selectedItem = selected;
    },
    async onDelete() {
      await BudgetService.delete(this.selectedItem.id);
      this.budgets = this.budgets.filter((x) => x.id !== this.selectedItem.id);
      this.isOpenConfirmDialog = false;
      this.$refs.budgetList.updateBudgets();
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
