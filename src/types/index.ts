export interface User {
  id: string;
  walletAddress: string;
  username: string;
  xp: number;
  level: number;
  totalSwaps: number;
  totalVolumeUsd: number;
  streakDays: number;
  lastSwapDate: string | null;
  createdAt: string;
}

export interface Swap {
  id: string;
  userId: string;
  sideshiftOrderId?: string;
  fromCoin: string;
  toCoin: string;
  fromAmount: number;
  toAmount?: number;
  status: 'pending' | 'completed' | 'failed';
  xpEarned: number;
  createdAt: string;
  completedAt?: string;
}

export interface Reward {
  id: string;
  userId: string;
  rewardType: 'nft' | 'bonus_xp' | 'mystery_box';
  rewardName: string;
  rewardData: any;
  claimed: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  walletAddress: string;
  rank: number;
  value: number;
  level: number;
}

export interface SideShiftQuote {
  id: string;
  depositCoin: string;
  settleCoin: string;
  depositAmount: string;
  settleAmount: string;
  expiresAt: string;
  rate: string;
}

export interface SideShiftOrder {
  id: string;
  depositCoin: string;
  settleCoin: string;
  depositAddress: string;
  settleAddress: string;
  depositAmount: string;
  settleAmount: string;
  status: string;
}
