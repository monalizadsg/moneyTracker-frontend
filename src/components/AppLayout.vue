<template>
  <div class="user-app-container d-flex">
    <div class="left-col">
      <SideNav />
    </div>
    <div class="right-col">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideNav from "./SideNav.vue";

export default {
  components: {
    SideNav,
  },
};
</script>

<style scoped>
.user-app-container {
  height: 100vh;
  width: 100vw;
}

.left-col {
  width: 25%;
  height: 100%;
}

.right-col {
  width: 75%;
  height: 100%;
}
</style>
