import { Router } from 'express';
import axios from 'axios';
import User from '../models/User';
import Swap from '../models/Swap';
import Reward from '../models/Reward';

const router = Router();
const SIDESHIFT_API = process.env.SIDESHIFT_API_URL || 'https://sideshift.ai/api/v2';
const AFFILIATE_ID = process.env.SIDESHIFT_AFFILIATE_ID || undefined;

router.get('/coins', async (_req, res) => {
  try {
    const { data } = await axios.get(`${SIDESHIFT_API}/coins`);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

router.get('/pairs', async (_req, res) => {
  try {
    const { data } = await axios.get(`${SIDESHIFT_API}/pairs`);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch pairs' });
  }
});

router.post('/quote', async (req, res) => {
  try {
    const { depositCoin, settleCoin, depositAmount } = req.body;
    const { data } = await axios.post(`${SIDESHIFT_API}/quotes`, {
      depositCoin,
      settleCoin,
      depositAmount,
    });
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: 'Failed to create quote', details: e?.response?.data });
  }
});

router.post('/order', async (req, res) => {
  try {
    const { userWallet, userId, quoteId, settleAddress } = req.body;

    const { data: order } = await axios.post(`${SIDESHIFT_API}/shifts/fixed`, {
      quoteId,
      settleAddress,
      affiliateId: AFFILIATE_ID,
    });

    const user = await User.findOne({ walletAddress: userWallet });
    const dbUserId = userId || user?._id;
    if (!dbUserId) return res.status(400).json({ error: 'User not found' });

    const swap = await Swap.create({
      userId: dbUserId,
      sideshiftOrderId: order.id,
      fromCoin: order.depositCoin,
      toCoin: order.settleCoin,
      fromAmount: Number(order.depositAmount) || 0,
      toAmount: Number(order.settleAmount) || undefined,
      status: 'pending',
      xpEarned: 0,
    });

    res.json({ order, swapId: swap._id });
  } catch (e: any) {
    res.status(400).json({ error: 'Failed to create order', details: e?.response?.data });
  }
});

router.get('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${SIDESHIFT_API}/shifts/${id}`);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: 'Failed to fetch order', details: e?.response?.data });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    const orderId = payload?.id;
    if (!orderId) return res.status(400).json({ ok: false });

    const swap = await Swap.findOne({ sideshiftOrderId: orderId });
    if (!swap) return res.json({ ok: true });

    const status = payload.status as string;
    if (status === 'settled' || status === 'completed') {
      swap.status = 'completed';
      swap.completedAt = new Date();

      const user = await User.findById(swap.userId);
      if (user) {
        // Simple XP logic (server-side)
        const volumeUsd = Number(swap.fromAmount) * 50000; // naive placeholder, replace with real pricing if needed
        const baseXp = 100 + Math.floor(volumeUsd / 10);
        user.xp += baseXp;
        user.totalSwaps += 1;
        user.totalVolumeUsd += volumeUsd;

        // streak tracking
        const today = new Date().toISOString().split('T')[0];
        if (!user.lastSwapDate) {
          user.streakDays = 1;
        } else {
          const lastDate = new Date(user.lastSwapDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) user.streakDays += 1;
          else if (diffDays > 1) user.streakDays = 1;
        }
        user.lastSwapDate = today;

        const newLevel = Math.floor(user.xp / 1000) + 1;
        const leveledUp = newLevel > user.level;
        user.level = newLevel;

        swap.xpEarned = baseXp;

        await user.save();
        await swap.save();

        if (leveledUp) {
          await Reward.create({
            userId: user._id,
            rewardType: 'nft',
            rewardName: getLevelNFTName(user.level),
            rewardData: { level: user.level, unlockedAt: new Date().toISOString() },
            claimed: false,
          });
        }

        if (user.totalSwaps % 5 === 0) {
          await Reward.create({
            userId: user._id,
            rewardType: 'mystery_box',
            rewardName: 'Mystery Box',
            rewardData: { swapMilestone: user.totalSwaps },
            claimed: false,
          });
        }

        if (user.streakDays === 7) {
          await Reward.create({
            userId: user._id,
            rewardType: 'nft',
            rewardName: 'Week Warrior NFT',
            rewardData: { streakDays: 7 },
            claimed: false,
          });
        }
      }
    } else if (status === 'failed' || status === 'rejected') {
      swap.status = 'failed';
      await swap.save();
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: true });
  }
});

function getLevelNFTName(level: number): string {
  if (level < 5) return 'Bronze Swapper NFT';
  if (level < 10) return 'Silver Trader NFT';
  if (level < 20) return 'Gold Master NFT';
  if (level < 30) return 'Platinum Elite NFT';
  return 'Diamond Legend NFT';
}

export default router;


