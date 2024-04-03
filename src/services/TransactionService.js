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

  async create(data) {
    try {
      const response = await api.post(`/transactions`, data);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }



  async update(data, id) {
    try {
      const response = await api.put(`/transactions/${id}`, data);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async delete(id) {
    try {
      return await api.delete(`/transactions/${id}`);
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

export default new TransactionService();
