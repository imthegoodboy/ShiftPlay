const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';

export const apiService = {
  async connectWallet(walletAddress: string) {
    const res = await fetch(`${API_BASE}/users/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });
    if (!res.ok) throw new Error('Failed to connect wallet');
    return await res.json();
  },

  async getCoins() {
    const res = await fetch(`${API_BASE}/sideshift/coins`);
    if (!res.ok) throw new Error('Failed to fetch coins');
    return await res.json();
  },

  async getQuote(depositCoin: string, settleCoin: string, depositAmount: string) {
    const res = await fetch(`${API_BASE}/sideshift/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ depositCoin, settleCoin, depositAmount }),
    });
    if (!res.ok) throw new Error('Failed to fetch quote');
    return await res.json();
  },

  async createOrder(params: { userWallet: string; userId: string; quoteId: string; settleAddress: string; }) {
    const res = await fetch(`${API_BASE}/sideshift/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
  },

  async getUserSwaps(userId: string) {
    const res = await fetch(`${API_BASE}/users/${userId}/swaps`);
    if (!res.ok) throw new Error('Failed to fetch swaps');
    return await res.json();
  },

  async getUserRewards(userId: string) {
    const res = await fetch(`${API_BASE}/users/${userId}/rewards`);
    if (!res.ok) throw new Error('Failed to fetch rewards');
    return await res.json();
  },

  async getLeaderboard() {
    const res = await fetch(`${API_BASE}/users/leaderboard/top`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return await res.json();
  },

  async aiChat(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('Chat failed');
    return await res.json();
  },
};


