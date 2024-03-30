<template>
  <v-select
    v-model="selectedCategory"
    :items="categories"
    variant="outlined"
    item-title="name"
    item-value="categoryId"
    label="Category"
    placeholder="Select Category"
    return-object
    @update:modelValue="handleChange"
  >
    <!-- eslint-disable-next-line -->
    <template #item="{ props, item }">
      <v-list-subheader v-if="props.header">
        {{ props.header }}
      </v-list-subheader>
      <v-divider v-else-if="props.divider" class="mt-2" />
      <v-list-item v-else v-bind="props"></v-list-item>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "CategorySelect",
  props: {
    categories: Array,
    value: Object,
  },
  data() {
    return {
      selectedCategory: this.value,
    };
  },
  test() {},
  methods: {
    handleChange(val) {
      console.log(val);
      this.$emit("onChange", this.selectedCategory);
    },
  },
};
</script>

<style scoped></style>
