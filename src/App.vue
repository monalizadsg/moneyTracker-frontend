<template>
  <AppLayout />
</template>

<script>
import AppLayout from "./components/AppLayout.vue";

export default {
  name: "App",
  components: {
    AppLayout,
  },
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}

html {
  overflow-y: hidden !important;
}
</style>
