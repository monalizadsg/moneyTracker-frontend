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
            <v-text-field
              v-model="formData.category"
              label="Category"
              variant="outlined"
            ></v-text-field>
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

export default {
  name: "TransactionDashboard",
  components: {
    AppBar,
    FormDialog,
    TransactionList,
  },
  data() {
    return {
      dialogTitle: "Add Transaction",
      formData: {
        name: "",
        email: "",
      },
    };
  },
  methods: {
    submitForm() {
      console.log("Form submitted with data:", this.formData);
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
