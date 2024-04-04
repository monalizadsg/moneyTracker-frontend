// Import the pre-configured Axios instance
import api from "../commons/api.js";

class AccountService {
  // Method to register a new user
  register(data) {
    return api.post('/userAccounts', data);
  }

  // Method to log in a user
  login(data) {
    return api.post('/login', data);
  }

  // Method to get user details by ID
  getUserDetails(userId) {
    return api.get(`/userAccounts/${userId}`);
  }

  // You can add more methods here for other account-related operations
}

// Export an instance of the service
export default new AccountService();
