import api from "../commons/api.js";

class GoalsServices {
  async get(userId) {
    try {
      const response = await api.get(`/goals?userId=${userId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

export default new GoalsServices();
