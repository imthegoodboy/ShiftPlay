import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { apiService } from '../services/apiService';

export function Leaderboard() {
  const [metric, setMetric] = useState<'xp' | 'totalSwaps' | 'totalVolumeUsd'>('xp');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    apiService.getLeaderboard().then(setLeaderboard).catch(() => setLeaderboard([]));
  }, []);

  const shortAddress = (addr?: string) => {
    if (!addr || typeof addr !== 'string' || addr.length < 10) return addr || '—';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const formatValue = (value: number) => {
    if (metric === 'totalVolumeUsd') {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <GlassCard className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Leaderboard
        </h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMetric('xp')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
            metric === 'xp'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-1" />
          XP
        </button>
        <button
          onClick={() => setMetric('totalSwaps')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
            metric === 'totalSwaps'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-1" />
          Swaps
        </button>
        <button
          onClick={() => setMetric('totalVolumeUsd')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
            metric === 'totalVolumeUsd'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Volume
        </button>
      </div>

      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40">No players yet. Be the first!</p>
          </div>
        ) : (
          leaderboard.filter(Boolean).map((entry) => (
            <div
              key={entry.userId}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-12 text-center">
                  {getRankMedal(entry.rank)}
                </div>
                <div>
                  <p className="text-white font-semibold">{entry.username}</p>
                  <p className="text-white/40 text-sm font-mono">
                    {shortAddress(entry.walletAddress)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-xl font-bold">{formatValue(entry.value)}</p>
                <p className="text-white/60 text-sm">Level {entry.level}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
