<template>
  <div class="container">
    <AppBar />
    <div class="main-content">Budget</div>
  </div>
</template>

<script>
import AppBar from "./AppBar.vue";

export default {
  name: "BudgetDashboard",
  components: {
    AppBar,
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
}
</style>
