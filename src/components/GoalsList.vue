<template>
  <div>
    <v-list v-if="goals" lines="one" class="list">
      <v-list-item
        class="list-item"
        padding="10px"
        v-for="(goal, index) in goals"
        :key="index"
      >
        <v-card class="card" outlined>
          <template v-slot:prepend>
            <div class="left-col">
              <v-avatar color="#000000" rounded="50">
                <v-icon icon="mdi-wallet-bifold" color="#FFFFFF"></v-icon>
              </v-avatar>
              <div class="left-col-item">
                <div class="goal-name">{{ goal.name }}</div>
                <div class="goal-monthly-savings">
                  Monthly Savings:
                  <!--${{ monthlySavings(goal.targetAmount,new Date(goal.startDate), new Date(goal.targetDate)) }}-->
                  ${{ monthlySavingsValues[index] }}
                </div>
              </div>
            </div>
          </template>
          <template v-slot:append>
            <div class="right-col">
              <div class="right-col-item">
                ${{ goal.currentAmount }} of ${{ goal.targetAmount }}
              </div>
            </div>
            <div v-if="!isReadOnly">
              <v-btn
                color="grey-lighten-1"
                icon="mdi-pencil"
                variant="text"
                size="small"
                @click="handleEdit(goal)"
              ></v-btn>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-delete"
                variant="text"
                size="small"
                @click="handleDelete(goal)"
              ></v-btn>
            </div>
          </template>
          <div class="progress-bar">
            <v-progress-linear
              :percentage="
                updatePercentage(goal.currentAmount, goal.targetAmount)
              "
              v-model="percentage"
              color="green"
              height="15"
            >
              <template v-slot:default="{ value }">
                <strong
                  style="
                    font-size: 12px;
                    text-align: center;
                    display: inline-block;
                    width: fit-content;
                  "
                >
                  {{ value }}
                  %</strong
                >
              </template>
            </v-progress-linear>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "GoalsList",
  props: {
    goals: Array,
    onEdit: {
      type: Function,
      required: true,
    },
    onDelete: {
      type: Function,
      required: true,
    },
    isReadOnly: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      monthsInAYear: 12,
    };
  },
  computed: {
    monthlySavingsValues() {
      return this.goals.map((goal) =>
        this.monthlySavings(
          goal.targetAmount,
          new Date(goal.startDate),
          new Date(goal.targetDate)
        )
      );
    },
  },
  methods: {
    updatePercentage(currentAmount, targetAmount) {
      this.percentage = Math.round((currentAmount / targetAmount) * 100);
      return this.percentage;
    },
    monthlySavings(targetAmount, startDate, targetDate) {
      const getMonthsInAYear =
        (targetDate.getFullYear() - startDate.getFullYear()) *
        this.monthsInAYear;
      const months =
        getMonthsInAYear + (targetDate.getMonth() - startDate.getMonth());

      let savingsAmount = 0;
      if (months === 0) {
        savingsAmount = targetAmount;
      } else {
        savingsAmount = Math.ceil(targetAmount / months);
      }

      return savingsAmount;
    },
    handleEdit(goal) {
      this.onEdit(goal);
    },
    handleDelete(goal) {
      this.onDelete(goal);
    },
  },
};
</script>

<style scoped>
.list {
  padding: 20px 5px;
}

.list-item {
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  border-radius: 6px;
}

.left-col {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}

.goal-monthly-savings {
  font-size: 0.875rem;
  opacity: 0.6;
}

.right-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-col-item {
  text-align: right;
  margin-right: 10px;
}

.goal-name {
  font-weight: bold;
}

.progress-bar {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>
