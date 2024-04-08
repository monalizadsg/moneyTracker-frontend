<template>
  <div class="container">
    <AppBar />
    <div class="main-content d-flex">
      <div class="gb-left-col">
        <div class="header">
          <h3>Goals</h3>
          <v-btn size="small" color="#26CA99" @click="openDialog">Add</v-btn>
        </div>
        <goals-list
          :goals="goals"
          :onEdit="onClickEdit"
          :onDelete="onClickDelete"
        ></goals-list>
      </div>
      <div class="gb-right-col">
        <goal-transaction-list :goals="goals"></goal-transaction-list>
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
          type="date"
          v-model="formData.startDate"
          label="Start Date"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          type="date"
          v-model="formData.targetDate"
          label="Target Date"
          variant="outlined"
        ></v-text-field>
      </v-form>
    </form-dialog>
    <confirm-dialog
      title="Goal"
      v-model="isOpenConfirmDialog"
      @update:isOpenConfirmDialog="isOpenConfirmDialog = $event"
      :onDelete="onDelete"
      msg="Take note that your current money in this goal wallet (if greater than 0) will be transferred to your main wallet"
    >
    </confirm-dialog>
  </div>
</template>

<script>
import GoalsServices from "@/services/GoalsServices";
import CategoryService from "@/services/CategoryService";
import TransactionService from "@/services/TransactionService";
import WalletService from "@/services/WalletService";
import AppBar from "./AppBar.vue";
import FormDialog from "./FormDialog.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import GoalsList from "./GoalsList.vue";
import GoalTransactionList from "./GoalTransactionList.vue";
import { formatDate, getErrorMessage, getUserId } from "@/commons/utils";

export default {
  name: "GoalDashboard",
  components: {
    AppBar,
    FormDialog,
    ConfirmDialog,
    GoalsList,
    GoalTransactionList,
  },
  data() {
    return {
      dialogTitle: "Add Goal",
      isOpenDialog: false,
      isOpenConfirmDialog: false,
      formData: {
        description: "",
        targetAmount: "",
        currentAmount: "",
        startDate: formatDate(new Date()),
        targetDate: formatDate(new Date()),
      },
      goals: [],
      isEdit: false,
      selectedItem: null,
      basicWalletId: null,
      userId: null,
    };
  },
  async created() {
    this.userId = getUserId();
    this.getBasicWalletId();
    this.fetchGoals();
  },
  methods: {
    async fetchGoals() {
      const result = await GoalsServices.get(this.userId);
      this.goals = result;
    },
    openDialog() {
      this.isOpenDialog = true;
    },
    async submitForm(event) {
      event.preventDefault();
      this.isOpenDialog = !this.isOpenDialog;

      const userId = this.userId;

      let newData = {
        userId,
        name: this.formData.description,
        targetAmount: Number(this.formData.targetAmount),
        currentAmount: Number(this.formData.currentAmount),
        startDate: this.formData.startDate,
        targetDate: this.formData.targetDate,
      };

      try {
        let upsertPromise = null;
        // update goal
        if (this.selectedItem?.id) {
          upsertPromise = await GoalsServices.update(
            newData,
            this.selectedItem.id
          );
          const index = this.goals.findIndex((x) => x.id === upsertPromise.id);
          this.goals[index] = upsertPromise;
          this.isEdit = false;
        } else {
          // create goal
          upsertPromise = await GoalsServices.create(newData);
          this.goals.push(upsertPromise);
        }

        this.resetForm();
        this.selectedItem = null;
      } catch (error) {
        console.error("Error: ", error.response ? error.response.data : error);
        alert("Error : " + getErrorMessage(error));
      }
    },
    onClickEdit(selected) {
      this.isOpenDialog = true;
      this.loadDataForEditing(selected);
      this.isEdit = true;
      this.selectedItem = selected;
    },
    loadDataForEditing(selected) {
      this.formData.description = selected.name;
      this.formData.targetAmount = selected.targetAmount;
      this.formData.currentAmount = selected.currentAmount;
      this.formData.startDate = selected.startDate;
      this.formData.targetDate = selected.targetDate;
    },
    resetForm() {
      this.formData.description = "";
      this.formData.targetAmount = "";
      this.formData.currentAmount = "";
      this.formData.startDate = formatDate(new Date());
      this.formData.targetDate = formatDate(new Date());
    },
    onClickDelete(selected) {
      this.isOpenConfirmDialog = true;
      this.selectedItem = selected;
    },
    async onDelete() {
      // transfer the current amount of the goal to the main wallet
      const userId = this.userId;

      if (this.selectedItem.currentAmount > 0) {
        // get income transfer category
        const incTransferCategory = await CategoryService.getByName(
          "Incoming Transfer",
          userId
        );

        // get expense transfer category
        const expTransferCategory = await CategoryService.getByName(
          "Outgoing Transfer",
          userId
        );

        // incoming transfer data to transactions
        const incTransferData = {
          description: this.selectedItem.name,
          categoryId: incTransferCategory.id,
          amount: Number(this.selectedItem.currentAmount),
          date: formatDate(new Date()),
          userId,
          walletId: this.basicWalletId,
        };

        // create transaction for incoming transfer to the main wallet
        const incTransferResult = await TransactionService.create(
          incTransferData
        );
        console.log("incoming transfer result", incTransferResult);

        // outgoing transfer data from goal wallet
        const expTransferData = {
          description: this.selectedItem.name,
          categoryId: expTransferCategory.id,
          amount: Number(this.selectedItem.currentAmount),
          date: formatDate(new Date()),
          userId,
          walletId: this.selectedItem.walletId,
        };

        // create transaction for outgoing transfer from goal wallet
        const expTransferResult = await TransactionService.create(
          expTransferData
        );
        console.log("outgoing transfer result", expTransferResult);
      }

      // delete goal after transferring the current amount
      await GoalsServices.delete(this.selectedItem.id);
      this.goals = this.goals.filter((x) => x.id != this.selectedItem.id);

      this.isOpenConfirmDialog = false;
    },
    async getBasicWalletId() {
      const result = await WalletService.get(this.userId);
      const wallet = result.find((x) => x.type === "BASIC");
      this.basicWalletId = wallet.id;
    },
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
