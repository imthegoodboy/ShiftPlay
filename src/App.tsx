import { useState, useEffect } from 'react';
import { LogOut, Gamepad2, MessageCircle } from 'lucide-react';
import { WalletConnect } from './components/WalletConnect';
import { UserProfile } from './components/UserProfile';
import { SwapInterface } from './components/SwapInterface';
import { Leaderboard } from './components/Leaderboard';
import { RewardsPanel } from './components/RewardsPanel';
import { SwapHistory } from './components/SwapHistory';
import { ReferralWidget } from './components/ReferralWidget';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import { User } from './types';
import { ChatWidget } from './components/ChatWidget';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      const updatedUser = storageService.getUserByWallet(currentUser.walletAddress);
      if (updatedUser) {
        setUser(updatedUser);
        storageService.setCurrentUser(updatedUser);
      }
    }
  }, [refreshKey]);

  const handleConnect = async (walletAddress: string) => {
    try {
      const backendUser = await apiService.connectWallet(walletAddress);
      const merged = {
        id: backendUser._id || backendUser.id,
        walletAddress: backendUser.walletAddress,
        username: backendUser.username,
        xp: backendUser.xp || 0,
        level: backendUser.level || 1,
        totalSwaps: backendUser.totalSwaps || 0,
        totalVolumeUsd: backendUser.totalVolumeUsd || 0,
        streakDays: backendUser.streakDays || 0,
        lastSwapDate: backendUser.lastSwapDate || null,
        createdAt: backendUser.createdAt || new Date().toISOString(),
      } as any;
      setUser(merged);
      storageService.setCurrentUser(merged);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    setUser(null);
    storageService.setCurrentUser(null);
  };

  const handleSwapComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjItMnptMCAwdjItMnptMCAwdjItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <WalletConnect onConnect={handleConnect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjItMnptMCAwdjItMnptMCAwdjItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <nav className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ShiftPlay</h1>
                <p className="text-white/60 text-sm">Level Up Your Swaps</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                AI Assistant
              </button>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <UserProfile user={user} />
          </div>
          <div>
            <RewardsPanel userId={user.id} />
            <div className="mt-6">
              <ReferralWidget walletAddress={user.walletAddress} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SwapInterface user={user} onSwapComplete={handleSwapComplete} />
          <SwapHistory userId={user.id} />
        </div>

        <div>
          <Leaderboard />
        </div>
      </main>

      <footer className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              Powered by SideShift.ai
            </p>
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <span>🎮 Gamified DeFi</span>
              <span>•</span>
              <span>🔥 Daily Streaks</span>
              <span>•</span>
              <span>🏆 NFT Rewards</span>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default App;
