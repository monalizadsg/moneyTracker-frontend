<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="usernameOrEmail" type="text" placeholder="Username or Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <p>
      New here?
      <router-link to="/register">Sign up</router-link>
    </p>
  </div>
</template>

<script>
import AccountService from "@/services/AccountService"; // Ensure the path is correct

export default {
  data() {
    return {
      usernameOrEmail: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const loginData = {
        username: this.usernameOrEmail,
        password: this.password
      };

      try {
        const loginResponse = await AccountService.login(loginData);

        if (loginResponse.data.userId) {
          // Fetch user details using the userId from login response
          const userDetailsResponse = await AccountService.getUserDetails(loginResponse.data.userId);

          // Assuming userDetailsResponse.data contains the detailed user info
          const userData = {
            userId: userDetailsResponse.data.userId,
            username: userDetailsResponse.data.username,
            email: userDetailsResponse.data.email
          };

          // Store sanitized user info in localStorage
          localStorage.setItem('user', JSON.stringify(userData));

          // Redirect to the home dashboard
          this.$router.push('/');
        } else {
          console.error("Login failed: No userId in response");
          alert("Login failed: No userId provided in login response");
        }
      } catch (error) {
        console.error("Login failed: ", error.response ? error.response.data : error);
        alert("Login failed: " + (error.response && error.response.data && error.response.data.message ? error.response.data.message : "Unknown error"));
      }
    }
  }
};
</script>

<style scoped>
/* Add your styling here */
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
}

input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  box-sizing: border-box;
}

button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

/* Style for the registration link */
p {
  text-align: center;
}
</style>
