import api from "../commons/api";

class BudgetService {
    async get(userId) {
        try {
            const response = await api.get(`/budgets?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.log("Error: " + error);
        }
    }

    async create(data) {
        try {
            const response = await api.post(`/budgets`, data);
            return response.data;
          } catch (error) {
            console.log("Error: " + error);
        }
    }

    async update(data, id) {
        try {
          const response = await api.put(`/budgets/${id}`, data);
          return response.data;
        } catch (error) {
          console.log("Error: " + error);
        }
    }

    async delete(id) {
        try {
          return await api.delete(`/budgets/${id}`);
        } catch (error) {
          console.log("Error: " + error);
        }
      }

}

export default new BudgetService();