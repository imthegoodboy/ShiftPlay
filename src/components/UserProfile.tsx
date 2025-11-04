import { Trophy, TrendingUp, Zap, Flame } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { User } from '../types';
import { gameService } from '../services/gameService';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const tier = gameService.getLevelTier(user.level);
  const xpToNextLevel = (user.level * 1000) - user.xp;
  const progress = ((user.xp % 1000) / 1000) * 100;

  const getTierColor = () => {
    switch (tier) {
      case 'Bronze': return 'from-amber-700 to-amber-900';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-cyan-400 to-blue-600';
      case 'Diamond': return 'from-purple-400 to-pink-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <GlassCard className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">{user.username}</h2>
          <p className="text-white/60 text-sm font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</p>
        </div>
        <div className={`bg-gradient-to-r ${getTierColor()} px-6 py-2 rounded-full`}>
          <p className="text-white font-bold text-sm">{tier}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white/80 text-sm">Level {user.level}</p>
          <p className="text-white/60 text-sm">{xpToNextLevel} XP to next level</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white text-2xl font-bold mt-2">{user.xp.toLocaleString()} XP</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <p className="text-white/60 text-sm">Total Swaps</p>
          </div>
          <p className="text-white text-2xl font-bold">{user.totalSwaps}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-white/60 text-sm">Volume</p>
          </div>
          <p className="text-white text-2xl font-bold">${(user.totalVolumeUsd / 1000).toFixed(1)}K</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <p className="text-white/60 text-sm">Streak</p>
          </div>
          <p className="text-white text-2xl font-bold">{user.streakDays} days</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <p className="text-white/60 text-sm">Rank</p>
          </div>
          <p className="text-white text-2xl font-bold">#{calculateRank(user)}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function calculateRank(user: User): number {
  const leaderboard = gameService.getLeaderboard('xp');
  const userEntry = leaderboard.find(entry => entry.userId === user.id);
  return userEntry?.rank || 999;
}
