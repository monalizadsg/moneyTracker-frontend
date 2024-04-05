import api from "../commons/api";

class BudgetService {
  async get(userId) {
    const response = await api.get(`/budgets?userId=${userId}`);
    return response.data;
  }

  async create(data) {
    const response = await api.post(`/budgets`, data);
    return response.data;
  }

  async update(data, id) {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  }

  async delete(id) {
    return await api.delete(`/budgets/${id}`);
  }
}

export default new BudgetService();
