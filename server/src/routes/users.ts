import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Swap from '../models/Swap';
import Reward from '../models/Reward';

const router = Router();

router.post('/connect', async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });
  let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  if (!user) {
    const randomId = Math.floor(Math.random() * 10000);
    user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
      username: `Player${randomId}`,
    });
  }
  res.json(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.get('/:id/swaps', async (req, res) => {
  const { id } = req.params;
  let user = null as any;
  if (mongoose.Types.ObjectId.isValid(id)) {
    user = await User.findById(id);
  } else {
    user = await User.findOne({ walletAddress: id.toLowerCase() });
  }
  if (!user) return res.json([]);
  const swaps = await Swap.find({ userId: user._id }).sort({ createdAt: -1 });
  res.json(swaps);
});

router.get('/:id/rewards', async (req, res) => {
  const { id } = req.params;
  let user = null as any;
  if (mongoose.Types.ObjectId.isValid(id)) {
    user = await User.findById(id);
  } else {
    user = await User.findOne({ walletAddress: id.toLowerCase() });
  }
  if (!user) return res.json([]);
  const rewards = await Reward.find({ userId: user._id }).sort({ createdAt: -1 });
  res.json(rewards);
});

router.get('/leaderboard/top', async (_req, res) => {
  const users = await User.find({}).sort({ xp: -1 }).limit(10);
  res.json(users.map((u, index) => ({
    userId: u._id,
    username: u.username,
    walletAddress: u.walletAddress,
    rank: index + 1,
    value: u.xp,
    level: u.level,
  })));
});

export default router;


