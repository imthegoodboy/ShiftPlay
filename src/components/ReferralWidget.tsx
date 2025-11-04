import { useMemo, useState } from 'react';
import { GlassCard } from './GlassCard';

interface ReferralWidgetProps {
  walletAddress: string;
}

export function ReferralWidget({ walletAddress }: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false);
  const refLink = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/?ref=${walletAddress}`;
  }, [walletAddress]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-white text-xl font-bold mb-2">Referral</h3>
      <p className="text-white/70 text-sm mb-3">Share your link. When friends swap, you both earn bonus XP.</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={refLink}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white overflow-hidden text-ellipsis"
        />
        <button onClick={copy} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-xl">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-white/50 text-xs mt-2">Tip: Post it on Twitter/Discord to climb the leaderboard faster.</p>
    </GlassCard>
  );
}


