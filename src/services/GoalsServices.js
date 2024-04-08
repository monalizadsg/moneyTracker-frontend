import api from "../commons/api.js";

class GoalsServices {
  async get(userId) {
    const response = await api.get(`/goals?userId=${userId}`);
    return response.data;
  }

  async create(data) {
    const response = await api.post(`/goals`, data);
    return response.data;
  }

  async update(data, id) {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  }

  async delete(id) {
    return await api.delete(`/goals/${id}`);
  }
}

export default new GoalsServices();
