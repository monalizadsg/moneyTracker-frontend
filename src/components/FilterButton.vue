<template>
  <div class="d-flex justify-space-around">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn size="small" color="#26CA99" v-bind="props"> Filter </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(value, key) in items"
          :key="key"
          :value="value"
          @click="handleClickMenu(value)"
        >
          <v-list-item-title>{{ value }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: "FilterButton",
  data: () => ({
    items: {
      THIS_WEEK: "This week",
      THIS_MONTH: "This month",
      LAST_MONTH: "Last month",
      THIS_YEAR: "This year",
    },
  }),
  props: {
    onClickMenu: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleClickMenu(item) {
      this.onClickMenu(item);
    },
  },
};
</script>
