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
  
  async create(data) {
    try {
      const response = await api.post(`/categories`, data);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async update(data, id) {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async delete(id) {
    try {
      return await api.delete(`/categories/${id}`);
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

export default new CategoryService();
