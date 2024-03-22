<template>
  <router-link :to="path" custom v-slot="{ href, navigate, isActive }">
    <v-list-item class="nav-item" :to="path">
      <NavLink
        class="nav-link"
        :active="isActive"
        :href="href"
        @click="navigate"
      >
        <v-list-item-icon>
          <v-icon class="icon">{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ title }}</v-list-item-title>
        </v-list-item-content></NavLink
      >
    </v-list-item>
  </router-link>
</template>

<script>
export default {
  name: "NavItem",
  props: {
    icon: String,
    title: String,
    path: String,
  },
};
</script>

<style scoped>
.nav-item {
  display: flex;
  border-radius: 10px;
}

.nav-link {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}
.icon {
  color: #2f2f2f;
}
</style>
