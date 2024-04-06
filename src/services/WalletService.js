import api from "../commons/api";

class WalletService {
  async get(userId) {
    const response = await api.get(`/wallets?userId=${userId}`);
    return response.data;
  }
}

export default new WalletService();
