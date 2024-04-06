<template>
  <div class="container">
    <AppBar />
    <div class="main-content d-flex">
      <div class="gb-left-col">
        <div class="header">
          <h3>Goals</h3>
          <form-dialog :title="dialogTitle">
            <v-form>
              <v-text-field
                v-model="formData.description"
                label="Description"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="formData.targetAmount"
                label="Goal amount"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="formData.currentAmount"
                label="Current saved amount"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="formData.targetDate"
                label="Target Date"
                variant="outlined"
              ></v-text-field>
            </v-form>
          </form-dialog>
        </div>
        <GoalsList></GoalsList>
      </div>
      <div class="gb-right-col">
        <goal-transaction-list></goal-transaction-list>
      </div>
    </div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import GoalsList from "./GoalsList.vue";
import GoalTransactionList from "./GoalTransactionList.vue";

export default {
  name: "GoalDashboard",
  components: {
    AppBar,
    FormDialog,
    GoalsList,
    GoalTransactionList,
  },
  data() {
    return {
      dialogTitle: "Add Goal",
      formData: {
        description: "",
        targetAmount: "",
        currentAmount: "",
        startDate: "",
        targetDate: "",
      },
    };
  },
};
</script>

<style scoped>
.container {
  height: 100%;
}

.main-content {
  height: calc(100vh - 76px);
}

.gb-left-col {
  width: 65%;
  padding: 20px;
  border-right: 2px solid rgb(226, 226, 226);
}

.gb-right-col {
  padding: 20px;
  width: 35%;
}

.header {
  display: flex;
  justify-content: space-between;
}
</style>
