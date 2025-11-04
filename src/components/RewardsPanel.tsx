import { Gift, Award, Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { apiService } from '../services/apiService';
import { Reward } from '../types';

interface RewardsPanelProps {
  userId: string;
}

export function RewardsPanel({ userId }: RewardsPanelProps) {
  const [rewards, setRewards] = useState<Reward[]>([] as any);
  const unclaimedRewards = rewards.filter(r => !r.claimed);

  useEffect(() => {
    apiService.getUserRewards(userId).then(setRewards).catch(() => setRewards([] as any));
  }, [userId]);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'nft': return <Award className="w-6 h-6 text-purple-400" />;
      case 'mystery_box': return <Box className="w-6 h-6 text-yellow-400" />;
      default: return <Gift className="w-6 h-6 text-blue-400" />;
    }
  };

  const claimReward = async (reward: Reward & { _id?: string }) => {
    const id = (reward as any)._id || (reward as any).id;
    if (!id) return;
    await fetch(`/api/rewards/${id}/claim`, { method: 'POST' });
    alert(`🎉 Claimed: ${reward.rewardName}!`);
    const fresh = await apiService.getUserRewards(userId);
    setRewards(fresh);
  };

  return (
    <GlassCard className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Gift className="w-8 h-8 text-pink-400" />
          Rewards
        </h2>
        {unclaimedRewards.length > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {unclaimedRewards.length} New
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {rewards.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">Complete swaps to earn rewards!</p>
          </div>
        ) : (
          rewards.map((reward) => (
            <div
              key={reward.id}
              className={`bg-white/5 border rounded-xl p-4 transition-all duration-300 ${
                reward.claimed
                  ? 'border-white/10 opacity-60'
                  : 'border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getRewardIcon(reward.rewardType)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{reward.rewardName}</p>
                    <p className="text-white/60 text-sm capitalize">{reward.rewardType.replace('_', ' ')}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(reward.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {!reward.claimed && (
                  <button
                    onClick={() => claimReward(reward)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    Claim
                  </button>
                )}
                {reward.claimed && (
                  <span className="text-green-400 text-sm font-semibold">Claimed ✓</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
        <p className="text-white/80 text-sm">
          🎁 <span className="font-semibold">Next Reward:</span> Complete 5 swaps for a Mystery Box!
        </p>
      </div>
    </GlassCard>
  );
}
