<template>
  <div class="container">
    <AppBar />
    <div class="main-content">
      <div class="header">
        <h4>Goals</h4>
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
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import GoalsList from "./GoalsList.vue";

export default {
   name: "GoalDashboard",
    components: {
    AppBar,
    FormDialog,
    GoalsList
  },
  data(){
    return{
      dialogTitle: "Add Goal",
      formData: {
        description: "",
        targetAmount: "",
        currentAmount: "",
        startDate: "",
        targetDate: "",
      },
    }

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
   padding: 20px;
}
</style>
