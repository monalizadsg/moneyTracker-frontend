<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required>
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import AccountService from "@/services/AccountService"; // Adjust the path as necessary

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password
      };

      try {
        await AccountService.register(userData);
        this.$router.push('/login'); // Redirect to login page after successful registration
      } catch (error) {
        console.error("Registration failed: ", error.response.data);
        // Handle error, e.g., show an error message
      }
    }
  }
};
</script>

  
  <style scoped>
  .register-container {
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
  </style>
  