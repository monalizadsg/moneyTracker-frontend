import api from "../commons/api";

class TransactionService {
  async get(userId) {
    try {
      const response = await api.get(`/transactions?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }
  
  async getByUserIdAndCategory(userId, categoryName) {
    try {
      const response = await api.get(`/transactions?userId=${userId}&category=${categoryName}`);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

export default new TransactionService();
