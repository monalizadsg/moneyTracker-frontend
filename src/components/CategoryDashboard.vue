<template>
    <div class="container">
      <AppBar />
      <div class="main-content">
        <div class="header pb-2">
          <h4>Categories</h4>
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
            <v-form>
              <v-text-field
                v-model="formData.name"
                label="Name"
                variant="outlined"
              ></v-text-field>
              <category-type-select
                :categoryTypes="categoryType"
                :value="formData.type"
                @onChange="onCategoryTypeChange"
              ></category-type-select>
            </v-form>

          </form-dialog>
          <confirm-dialog
              title="Category"
              v-model="isOpenConfirmDialog"
              @update:isOpenConfirmDialog="isOpenConfirmDialog = $event"
              :onDelete="onDelete"
            >
          </confirm-dialog>
          <category-list 
            :categories="categories"
            :onEdit="onClickEdit"
            :onDelete="onClickDelete"
          ></category-list>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AppBar from "./AppBar.vue";
  import CategoryList from "./CategoryList.vue";
  import CategoryService from "@/services/CategoryService";
  import CategoryTypeSelect from "./CategoryTypeSelect.vue";
  import FormDialog from "./FormDialog.vue";
  import ConfirmDialog from "./ConfirmDialog.vue";
  import { getErrorMessage } from "../commons/utils.js";

 

  export default {
    name: "CategoryDashboard",
    components: {
      AppBar,
      CategoryList,
      CategoryTypeSelect,
      FormDialog,
      ConfirmDialog
    },
    data() {
      return {
        categories: [],
        categoryType: ["Income", "Expense"],
        selectedCategoryType: null,
        // dialogTitle: "Add Category",
        isOpenConfirmDialog: false,
        isOpenDialog: false,
        formData: {
          name: "",
          type: "Income",
        },
        selectedItem: null,
        isEdit: false,
      }
    },
    async created() {
      this.fetchCategories();
    },
    computed: {
    dialogTitle() {
      if (this.isEdit && this.selectedItem) {
        return `Edit ${this.selectedItem.name} Category` ;
      } else {
        return "Add Category";
      }
    }
  },
    methods: {
      async fetchCategories(){
        const result = await CategoryService.get(1);
        this.categories = result;
      },
      openDialog() {
      this.isOpenDialog = true;
      this.isEdit = false;
      },
      async submitForm(event) {
        event.preventDefault();
        this.isOpenDialog = !this.isOpenDialog;
        const userId = 1;
        let newData = {
          name: this.formData.name,
          type: this.getCategoryType(this.formData.type),
          userId,
        };
        try {
          let upsertPromise = null;
          if (this.selectedItem?.id) {
            upsertPromise = await CategoryService.update(
              newData,
              this.selectedItem.id
            );
            const resData = this.formatResponseData(upsertPromise);
            const index = this.categories.findIndex(
              (item) => item.id === upsertPromise.id
            );
            this.categories[index] = resData;
            this.isEdit = false;
          } else {
            upsertPromise = await CategoryService.create(newData);
            const resData = this.formatResponseData(upsertPromise);
            this.categories.push(resData);
          }
          this.resetForm();
          this.selectedItem = null;
          console.log("open dialog", this.isOpenDialog);
        } catch (error) {
          ("Error: " + getErrorMessage(error));
          alert("Error: " + getErrorMessage(error));
        }          
      },
      onCategoryTypeChange(val) {
        this.formData.type = val;
        console.log("category type", val);
      },
      getCategoryType(type) {
        if (type === "Income") {
          return "income";
        } else if (type === "Expense") {
          return "expense";
        }
      },
      resetForm() {
        this.formData = {
          name: "",
          type: "Income",
        };
      },
      formatResponseData(data) {
        const resData = {
          id: data.id,
          name: data.name,
          type: data.type,
        };
        return resData;
      },
      onClickDelete(selected){
        this.selectedItem = selected;
        this.isOpenConfirmDialog = true;
      },
      async onDelete() {
        await CategoryService.delete(this.selectedItem.id);
        const newData = this.categories.filter((item) => item.id !== this.selectedItem.id);
        this.categories = newData;
        this.selectedItem = null;
        this.isOpenConfirmDialog = false;
      },
      onClickEdit(selected) {
        this.isOpenDialog = true;
        this.loadDataForEditing(selected);
        this.isEdit = true;
        this.selectedItem = selected;
      },
      loadDataForEditing(selected) {
        this.formData.name = selected.name;
        if(selected.type === "income") {
          this.formData.type = "Income";
        } else {
          this.formData.type = "Expense";
        }
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
    /* overflow-y: auto; */
    padding: 20px;
  }

  .header {
    display: flex;
    /* border: 1px solid green; */
    justify-content: space-between;
    align-items: center;
  }

  .header-right-col {
    display: flex;
    gap: 10px;
  }
  </style>