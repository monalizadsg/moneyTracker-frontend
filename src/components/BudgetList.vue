<template>
    <div>
        <v-list v-if="budgets" lines="one" class="list">
            <v-list-item class="list-item" padding="10px" v-for="(budget, index) in budgets" :key="index">
                <v-card class="card" outlined>
                    <template v-slot:prepend>
                        <div class="left-col">
                            <v-avatar color="#000000" rounded="50">
                                <v-icon icon="mdi-wallet-bifold" color="#FFFFFF"></v-icon>
                            </v-avatar>
                            <div class="left-col-item">
                                <div class="budget-category">{{ budget.category.name }}</div>
                                <div class="budget-timeFrame">
                                    Time Frame: {{ getTimeFrame(budget.timeFrame) }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:append v-if="categoryTotals[budget.category.name] !== undefined">
                        <div class="right-col">
                            <div class="right-col-item">
                                ${{ categoryTotals[budget.category.name] }} of ${{ budget.amount }}
                            </div>
                        </div>
                        <div>
                            <v-btn
                                color="grey-lighten-1"
                                icon="mdi-pencil"
                                variant="text"
                                size="small"
                                @click="handleEdit(budget)"
                            ></v-btn>
                            <v-btn
                                color="grey-lighten-1"
                                icon="mdi-delete"
                                variant="text"
                                size="small"
                                @click="handleDelete(budget)"
                            ></v-btn>
                        </div>
                    </template>
                    <div class="progress-bar">
                        <v-progress-linear :percentage="calculatePercentageSpent(budget.totalSpent, budget.amount)" :color="percentage > 75 ? 'red' : 'green'" height="15" v-model="percentage">
                            <template v-slot:default="{ value }" >
                                <strong style="font-size: 12px; text-align: center; display: inline-block; width: fit-content;">
                                {{ value }}%
                                </strong>
                            </template>
                        </v-progress-linear>
                        <!-- <v-progress-linear :percentage="budget.percentageSpent" color="green" height="15">
                            <template v-slot:default="{ value }" >
                                <strong style="font-size: 12px; text-align: center; display: inline-block; width: fit-content;">
                                {{ value }}%
                                </strong>
                            </template>
                        </v-progress-linear> -->
                    </div>
                </v-card>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
import TransactionService from "../services/TransactionService";
import BudgetService from "../services/BudgetService";

export default {  
    name: "BudgetList",
    //newly added
    props: {
        onEdit: {
            type: Function,
            required: true,
        },
        onDelete: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            budgets: [],
            categoryTotals: [],
        };
    },
    async created() {
        this.budgets = await BudgetService.get(1);
        await this.calculateBudgetsTotalSpent();
        console.log(this.budgets);
    },

    methods: {
        handleEdit(budget) {
            console.log("Selected item in handleEdit:", budget); // Add this line

            this.onEdit(budget);
        },
        handleDelete(budget) {
            this.onDelete(budget);
        },
        getTimeFrame(timeFrame) {
            if (timeFrame === "month") {
                return timeFrame = "Monthly";
            } else if (timeFrame === "week") {
                return timeFrame = "Weekly";
            } else if (timeFrame === "year"){
                return timeFrame = "Yearly";
            }
        },
        async calculateBudgetsTotalSpent() {
            for (let budget of this.budgets) {
                const transactions = await TransactionService.getByUserIdAndCategory(1, budget.category.name);
                console.log("This is to show: "+ budget.category.name);
                console.log("This is to show transactions: "+ transactions);
                let totalSpent = 0;

                // adding of spent
                for (let transaction of transactions) {
                    if (transaction.category.name === budget.category.name) {
                        totalSpent += transaction.amount;
                    }
                }

                budget.totalSpent = totalSpent;
                // budget.percentageSpent = this.calculatePercentageSpent(totalSpent, budget.amount);
                // console.log(budget.percentageSpent);

                // Update categoryTotals
                if (!this.categoryTotals[budget.category.name]) {
                    this.categoryTotals[budget.category.name] = 0;
                }
                this.categoryTotals[budget.category.name] += totalSpent;
                console.log("Category " + this.categoryTotals[budget.category.name])
            }
        },
        calculatePercentageSpent(totalSpent, budgetAmount) {
            if (budgetAmount === 0) {
                return 0;
            }
            this.percentage = Math.round((totalSpent / budgetAmount) * 100);
            return this.percentage;
        },
        async updateBudgets() {
            this.budgets = await BudgetService.get(1);
            await this.calculateBudgetsTotalSpent();
    }
    }
}
</script>

<style>
    .list {
    padding: 20px 5px;
    }
    
    .list-item {
    margin: 10px;
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
    
    .left-col .budget-timeFrame {
    font-size: 0.875rem;
    opacity: 0.6;
    }

    /* .right-col {
    display: flex;
    justify-content: center;
    align-items: center;
    } */

    .budget-category {
    font-weight: bold;
    font-size: larger
    }

    .right-col-item {
    text-align: right;
    margin-right: 10px;
    }
    
    .progress-bar {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    }

</style>