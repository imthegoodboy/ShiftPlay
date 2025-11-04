import { useState, useEffect } from 'react';
import { ArrowDownUp, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { apiService } from '../services/apiService';
import { storageService } from '../services/storageService';
import { gameService } from '../services/gameService';
import { User, Swap } from '../types';

interface SwapInterfaceProps {
  user: User;
  onSwapComplete: () => void;
}

export function SwapInterface({ user, onSwapComplete }: SwapInterfaceProps) {
  const [fromCoin, setFromCoin] = useState('btc');
  const [toCoin, setToCoin] = useState('eth');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState<any[]>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quote, setQuote] = useState<any | null>(null);
  const [settleAddress, setSettleAddress] = useState(user.walletAddress);

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      fetchQuote();
    } else {
      setEstimatedAmount('');
    }
  }, [amount, fromCoin, toCoin]);

  const loadCoins = async () => {
    try {
      const coinsData = await apiService.getCoins();
      if (coinsData && coinsData.length > 0) {
        setCoins(coinsData);
        return;
      }
    } catch (e) {
      console.warn('Falling back to static coin list due to API error');
    }
    setCoins([
      { coin: 'btc', name: 'Bitcoin', networks: ['bitcoin'] },
      { coin: 'eth', name: 'Ethereum', networks: ['ethereum'] },
      { coin: 'usdt', name: 'Tether', networks: ['ethereum'] },
      { coin: 'matic', name: 'Polygon', networks: ['polygon'] },
      { coin: 'sol', name: 'Solana', networks: ['solana'] },
      { coin: 'usdc', name: 'USD Coin', networks: ['ethereum'] },
    ]);
  };

  const fetchQuote = async () => {
    setQuoteLoading(true);
    try {
      const q = await apiService.getQuote(fromCoin, toCoin, amount);
      if (q) {
        setQuote(q);
        setEstimatedAmount(q.settleAmount);
      } else {
        const mockRate = 0.95;
        setEstimatedAmount((parseFloat(amount) * mockRate).toFixed(6));
      }
    } catch (error) {
      console.error('Quote error:', error);
      const mockRate = 0.95;
      setEstimatedAmount((parseFloat(amount) * mockRate).toFixed(6));
    }
    setQuoteLoading(false);
  };

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      if (!quote?.id) {
        alert('Please fetch a quote first.');
        return;
      }
      const resp = await apiService.createOrder({
        userWallet: user.walletAddress,
        userId: user.id,
        quoteId: quote.id,
        settleAddress,
      });

      alert('Order created. Send funds to the deposit address shown in your account. Rewards will be applied on completion.');
      setAmount('');
      setEstimatedAmount('');
      setQuote(null);
      onSwapComplete();
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed. Please try again.');
    }
    setLoading(false);
  };

  const switchCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  return (
    <GlassCard className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-white">Swap Crypto</h2>

      <div className="space-y-4">
        <div>
          <label className="text-white/80 text-sm mb-2 block">From</label>
          <div className="flex gap-3">
            <select
              value={fromCoin}
              onChange={(e) => setFromCoin(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {coins.map((coin) => (
                <option key={coin.coin} value={coin.coin} className="bg-gray-900">
                  {coin.name || coin.coin.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={switchCoins}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-3 transition-all duration-300"
          >
            <ArrowDownUp className="w-5 h-5 text-white" />
          </button>
        </div>

        <div>
          <label className="text-white/80 text-sm mb-2 block">To (estimated)</label>
          <div className="flex gap-3">
            <select
              value={toCoin}
              onChange={(e) => setToCoin(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {coins.map((coin) => (
                <option key={coin.coin} value={coin.coin} className="bg-gray-900">
                  {coin.name || coin.coin.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center justify-center">
              {quoteLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                estimatedAmount || '0.00'
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-white/80 text-sm mb-2 block">Settle Address (destination wallet)</label>
          <input
            type="text"
            value={settleAddress}
            onChange={(e) => setSettleAddress(e.target.value)}
            placeholder="0x... or destination address"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleSwap}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Swap...
            </>
          ) : (
            'Execute Swap'
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm">
          💡 <span className="text-white/80 font-semibold">Pro Tip:</span> Swap daily to maintain your streak and earn bonus XP!
        </p>
      </div>
    </GlassCard>
  );
}
