<template>
  <div class="side-nav">
    <div class="logo">
      <h2>moneyTracker.</h2>
    </div>
    <div>
      <v-list class="nav-list">
        <NavItem icon="mdi-view-dashboard" title="Dashboard" path="/" />
        <NavItem
          icon="mdi-swap-horizontal"
          title="Transaction"
          path="/transactions"
        />
        <NavItem icon="mdi-wallet" title="Budget" path="/budgets" />
        <NavItem icon="mdi-bullseye" title="Goal" path="/goals" />
        <NavItem icon="mdi-form-select" title="Category" path="/categories" />
      </v-list>
    </div>
  </div>
</template>

<script>
import NavItem from "./NavItem.vue";

export default {
  name: "SideNav",
  components: {
    NavItem,
  },
};
</script>

<style scoped>
.side-nav {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 20px;
  border-right: 2px solid rgb(226, 226, 226);
}

.logo {
  align-self: center;
  color: #26ca99;
}

.nav-list {
  margin-top: 30px;
  padding: 0 40px;
}
</style>
