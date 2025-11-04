import { User, Reward } from '../types';
import { storageService } from './storageService';

const XP_PER_LEVEL = 1000;
const XP_PER_SWAP_BASE = 100;
const STREAK_BONUS_MULTIPLIER = 1.5;
const MYSTERY_BOX_EVERY = 5;

export const gameService = {
  calculateLevel(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  },

  calculateXpForSwap(swapVolumeUsd: number, streakDays: number): number {
    let xp = XP_PER_SWAP_BASE + Math.floor(swapVolumeUsd / 10);
    if (streakDays >= 3) {
      xp = Math.floor(xp * STREAK_BONUS_MULTIPLIER);
    }
    return xp;
  },

  updateStreak(user: User): User {
    const today = new Date().toISOString().split('T')[0];
    const lastSwap = user.lastSwapDate;

    if (!lastSwap) {
      user.streakDays = 1;
    } else {
      const lastDate = new Date(lastSwap);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
      } else if (diffDays === 1) {
        user.streakDays += 1;
      } else {
        user.streakDays = 1;
      }
    }

    user.lastSwapDate = today;
    return user;
  },

  processSwapRewards(user: User, swapVolumeUsd: number): { user: User; rewards: Reward[] } {
    const rewards: Reward[] = [];

    user = this.updateStreak(user);
    const xpEarned = this.calculateXpForSwap(swapVolumeUsd, user.streakDays);

    user.xp += xpEarned;
    user.totalSwaps += 1;
    user.totalVolumeUsd += swapVolumeUsd;

    const newLevel = this.calculateLevel(user.xp);
    const leveledUp = newLevel > user.level;
    user.level = newLevel;

    if (leveledUp) {
      const levelReward: Reward = {
        id: crypto.randomUUID(),
        userId: user.id,
        rewardType: 'nft',
        rewardName: this.getLevelNFTName(user.level),
        rewardData: { level: user.level, unlockedAt: new Date().toISOString() },
        claimed: false,
        createdAt: new Date().toISOString(),
      };
      rewards.push(levelReward);
    }

    if (user.totalSwaps % MYSTERY_BOX_EVERY === 0) {
      const mysteryReward: Reward = {
        id: crypto.randomUUID(),
        userId: user.id,
        rewardType: 'mystery_box',
        rewardName: 'Mystery Box',
        rewardData: { swapMilestone: user.totalSwaps },
        claimed: false,
        createdAt: new Date().toISOString(),
      };
      rewards.push(mysteryReward);
    }

    if (user.streakDays === 7) {
      const streakReward: Reward = {
        id: crypto.randomUUID(),
        userId: user.id,
        rewardType: 'nft',
        rewardName: 'Week Warrior NFT',
        rewardData: { streakDays: 7 },
        claimed: false,
        createdAt: new Date().toISOString(),
      };
      rewards.push(streakReward);
    }

    storageService.updateUser(user);
    rewards.forEach(reward => storageService.addReward(reward));

    return { user, rewards };
  },

  getLevelNFTName(level: number): string {
    if (level < 5) return 'Bronze Swapper NFT';
    if (level < 10) return 'Silver Trader NFT';
    if (level < 20) return 'Gold Master NFT';
    if (level < 30) return 'Platinum Elite NFT';
    return 'Diamond Legend NFT';
  },

  getLevelTier(level: number): string {
    if (level < 5) return 'Bronze';
    if (level < 10) return 'Silver';
    if (level < 20) return 'Gold';
    if (level < 30) return 'Platinum';
    return 'Diamond';
  },

  getLeaderboard(metric: 'xp' | 'totalSwaps' | 'totalVolumeUsd' = 'xp') {
    const users = storageService.getUsers();
    const sorted = [...users].sort((a, b) => b[metric] - a[metric]);
    return sorted.slice(0, 10).map((user, index) => ({
      userId: user.id,
      username: user.username,
      walletAddress: user.walletAddress,
      rank: index + 1,
      value: user[metric],
      level: user.level,
    }));
  },
};
