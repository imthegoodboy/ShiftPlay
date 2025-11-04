import { ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { apiService } from '../services/apiService';
import { Swap } from '../types';

interface SwapHistoryProps {
  userId: string;
}

export function SwapHistory({ userId }: SwapHistoryProps) {
  const [swaps, setSwaps] = useState<Swap[]>([] as any);

  useEffect(() => {
    apiService.getUserSwaps(userId)
      .then((list) => setSwaps(list))
      .catch(() => setSwaps([] as any));
  }, [userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <GlassCard className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Recent Swaps</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {swaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40">No swaps yet. Make your first swap!</p>
          </div>
        ) : (
          swaps.map((swap: Swap) => (
            <div
              key={swap.id}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold uppercase">{swap.fromCoin}</span>
                  <ArrowRight className="w-4 h-4 text-white/40" />
                  <span className="text-white font-semibold uppercase">{swap.toCoin}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(swap.status)}
                  <span className="text-white/60 text-sm capitalize">{swap.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-white/60">Amount: <span className="text-white font-semibold">{swap.fromAmount}</span></p>
                  {swap.toAmount && (
                    <p className="text-white/60">Received: <span className="text-white font-semibold">{swap.toAmount}</span></p>
                  )}
                </div>
                {swap.xpEarned > 0 && (
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                    +{swap.xpEarned} XP
                  </div>
                )}
              </div>

              <p className="text-white/40 text-xs mt-2">
                {new Date(swap.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
