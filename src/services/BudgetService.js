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
}

export default new BudgetService();