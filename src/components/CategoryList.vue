<template>
    <div class="category-list pb-4">
        <v-list v-if="sortedCategories" lines="one" class="list">
            <v-list-item
                v-for="(item, i) in sortedCategories"
                :key="i"
                class="list-item"
                padding="10px"
            >
                <v-card class="elevation-1 card" outlined>
                    <template v-slot:prepend>
                        <div class="left-col">
                            <v-avatar v-if="item.type === 'income'" color="#26ca99">
                                <v-icon icon="mdi-alpha-i-circle-outline"></v-icon>
                            </v-avatar>
                            <v-avatar v-else color="#f4766d">
                                <v-icon icon="mdi-alpha-e-circle-outline"></v-icon>
                            </v-avatar>
                            <div class="left-col-item">
                                <div class="item-name">{{ item.name }}</div>
                                <div class="item-category">{{ getCategoryType(item.type) }}</div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:append>
                        <div class="right-col">
                            <v-btn
                                color="grey-lighten-1"
                                icon="mdi-pencil"
                                variant="text"
                                size="small"
                                @click="handleEdit(item)"
                            ></v-btn>
                            <v-btn
                                color="grey-lighten-1"
                                icon="mdi-delete"
                                variant="text"
                                size="small"
                                @click="handleDelete(item)"
                            ></v-btn>
                        </div>
                    </template>
                </v-card>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
export default {
    name: "CategoryList",
    props: {
        categories: Array,
        onEdit: {
            type: Function,
            required: true
        },
        onDelete: {
            type: Function,
            required: true
        }
    },
    computed: {
        sortedCategories() {
            // Sort categories by type (income first, then expense)
            return this.categories.slice().sort((a, b) => {
                if (a.type === "income" && b.type === "expense") return -1;
                if (a.type === "expense" && b.type === "income") return 1;
                return 0;
            });
        }
    },
    methods: {
        getCategoryType(type) {
            return type === "income" ? "Income" : "Expense";
        },
        handleEdit(item) {
            this.onEdit(item);
        },
        handleDelete(item) {
            this.onDelete(item);
        }
    }
};
</script>

<style>
    .category-list {
        height: calc(100vh - 110px);
        overflow-y: auto;
    }
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
    
    .left-col .item-category {
        font-size: 0.875rem;
        opacity: 0.6;
    }

    .item-name {
        font-size: 1rem;
        font-weight: bold;
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