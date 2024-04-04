<template>
    <v-select
        v-model="selectedCategoryType"
        :items="categoryTypes"
        variant="outlined"
        item-value="categoryType"
        label="Category Type"
        placeholder="Select Category Type"
        return-object
        @update:modelValue="handleChange"
    >
        <template #item="{ props }">
            <v-list-item v-if="!props.header && !props.divider" v-bind="props"></v-list-item>
        </template>
    </v-select>
</template>

<script>
export default {
    name: "CategoryTypeSelect",
    props: {
        categoryTypes: Array,
        value: Object,
    },
    data() {
        return {
            selectedCategoryType: this.value,
        };
    },
    methods: {
        handleChange(val) {
            console.log(val);
            this.$emit("onChange", this.selectedCategoryType);
        },
    },
};
</script>

<style scoped></style>