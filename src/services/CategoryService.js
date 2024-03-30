import api from "../commons/api";

class CategoryService {
  async get(userId) {
    try {
      const response = await api.get(`/categories?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

export default new CategoryService();
