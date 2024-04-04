<template>
  <v-container class="app-bar">
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h2>Hello, {{ username }}</h2>
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <v-icon size="35">mdi-account-circle</v-icon>
        <!-- Logout Button -->
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AppBar",
  data() {
    return {
      user: this.fetchUser(), // Initialize user data from localStorage
    };
  },
  computed: {
    username() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user); // Debugging line to see what's being retrieved
    return user ? user.username : 'Guest';
  }
  },
  methods: {
    fetchUser() {
      // Method to fetch user data from localStorage
      return JSON.parse(localStorage.getItem('user'));
    },
    logout() {
      // Clear user authentication data from storage
      localStorage.removeItem('user');
      // Redirect to the login page
      this.$router.push('/login');
    }
  },
  watch: {
    // Watcher to update user data if localStorage changes
    '$route': function() {
      this.user = this.fetchUser();
    }
  }
};
</script>

<style scoped>
.app-bar {
  /* border: 1px solid green; */
  width: 100%;
  padding: 20px 30px;
  border-bottom: 2px solid rgb(226, 226, 226);
}

.d-flex {
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust the gap as needed */
}

/* Add styles for your logout button if needed */
</style>
