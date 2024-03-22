<template>
  <v-container class="app-bar">
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h2>Hello, {{ username }}</h2>
      </v-col>
      <v-col cols="auto">
        <v-icon size="35">mdi-account-circle</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AppBar",
  data() {
    return {
      username: "Jane", //TODO: make it dynamic
    };
  },
};
</script>

<style scoped>
.app-bar {
  /* border: 1px solid green; */
  width: 100%;
  padding: 20px 30px;
  border-bottom: 2px solid rgb(226, 226, 226);
}
</style>
