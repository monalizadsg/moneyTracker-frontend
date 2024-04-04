<template>
    <v-select
      v-model="selectedTimeFrame"
      :items="timeFrames"
      variant="outlined"
      item-value="timeFrame"
      label="Time Frame"
      placeholder="Select Time Frame"
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
    name: "TimeFrameSelect",
    props: {
        timeFrames: Array,
        value: Object,
    },
    data() {
        return {
            selectedTimeFrame: this.value,
        }
    },
    test() {},
    methods: {
    handleChange(val) {
      console.log(val);
      this.$emit("onChange", this.selectedTimeFrame);
    },
  },
}
</script>

<style scoped></style>