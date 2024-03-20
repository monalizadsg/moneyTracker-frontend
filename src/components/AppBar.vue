<template>
  <v-app-bar app color="transparent">
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <v-toolbar-title>Welcome, {{ username }}</v-toolbar-title>
        </v-col>
        <v-col cols="auto">
          <v-icon size="30">mdi-account-circle</v-icon>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  data() {
    return {
      username: "Jane", // make it dynamic
    };
  },
};
</script>

<style scoped></style>
