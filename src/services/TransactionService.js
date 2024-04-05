import api from "../commons/api";

class TransactionService {
  async get(userId) {
    const response = await api.get(`/transactions?userId=${userId}`);
    return response.data;
  }

  async getByUserIdAndCategory(userId, categoryName) {
    const response = await api.get(
      `/transactions?userId=${userId}&category=${categoryName}`
    );
    return response.data;
  }

  async create(data) {
    const response = await api.post(`/transactions`, data);
    return response.data;
  }

  async update(data, id) {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  }

  async delete(id) {
    return await api.delete(`/transactions/${id}`);
  }

  async filterByDate(userId, start, end) {
    const response = await api.get(
      `/transactions/filter?userId=${userId}&startDate=${start}&endDate=${end}`
    );
    return response.data;
  }
}

export default new TransactionService();
