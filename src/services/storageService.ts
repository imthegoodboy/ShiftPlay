import { User, Swap, Reward } from '../types';

const STORAGE_KEYS = {
  USERS: 'shiftplay_users',
  SWAPS: 'shiftplay_swaps',
  REWARDS: 'shiftplay_rewards',
  CURRENT_USER: 'shiftplay_current_user',
};

export const storageService = {
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUserByWallet(walletAddress: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || null;
  },

  createUser(walletAddress: string, username?: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: crypto.randomUUID(),
      walletAddress,
      username: username || `Player${Math.floor(Math.random() * 10000)}`,
      xp: 0,
      level: 1,
      totalSwaps: 0,
      totalVolumeUsd: 0,
      streakDays: 0,
      lastSwapDate: null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  },

  updateUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.saveUsers(users);
      if (this.getCurrentUser()?.id === user.id) {
        this.setCurrentUser(user);
      }
    }
  },

  getSwaps(): Swap[] {
    const data = localStorage.getItem(STORAGE_KEYS.SWAPS);
    return data ? JSON.parse(data) : [];
  },

  saveSwaps(swaps: Swap[]): void {
    localStorage.setItem(STORAGE_KEYS.SWAPS, JSON.stringify(swaps));
  },

  getUserSwaps(userId: string): Swap[] {
    return this.getSwaps().filter(s => s.userId === userId);
  },

  addSwap(swap: Swap): void {
    const swaps = this.getSwaps();
    swaps.push(swap);
    this.saveSwaps(swaps);
  },

  updateSwap(swap: Swap): void {
    const swaps = this.getSwaps();
    const index = swaps.findIndex(s => s.id === swap.id);
    if (index !== -1) {
      swaps[index] = swap;
      this.saveSwaps(swaps);
    }
  },

  getRewards(): Reward[] {
    const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return data ? JSON.parse(data) : [];
  },

  saveRewards(rewards: Reward[]): void {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  },

  getUserRewards(userId: string): Reward[] {
    return this.getRewards().filter(r => r.userId === userId);
  },

  addReward(reward: Reward): void {
    const rewards = this.getRewards();
    rewards.push(reward);
    this.saveRewards(rewards);
  },

  updateReward(reward: Reward): void {
    const rewards = this.getRewards();
    const index = rewards.findIndex(r => r.id === reward.id);
    if (index !== -1) {
      rewards[index] = reward;
      this.saveRewards(rewards);
    }
  },
};
