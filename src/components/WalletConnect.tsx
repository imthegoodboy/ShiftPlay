import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnecting(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0]) {
          onConnect(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      } finally {
        setConnecting(false);
      }
    } else {
      if (address) {
        onConnect(address);
      } else {
        alert('Please enter a wallet address or install MetaMask');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ShiftPlay</h1>
          <p className="text-white/60">Gamified Cross-Chain Swaps</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/40">or</span>
            </div>
          </div>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleConnect}
            disabled={!address || connecting}
            className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
          >
            Continue with Address
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <span className="text-2xl">🎮</span>
            <span>Earn XP with every swap</span>
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <span className="text-2xl">🏆</span>
            <span>Unlock exclusive NFT rewards</span>
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <span className="text-2xl">🔥</span>
            <span>Build streaks for bonus multipliers</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
