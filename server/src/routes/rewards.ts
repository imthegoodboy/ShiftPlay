import { Router } from 'express';
import Reward from '../models/Reward';

const router = Router();

router.post('/:id/claim', async (req, res) => {
  const { id } = req.params;
  const reward = await Reward.findById(id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  reward.claimed = true;
  await reward.save();
  res.json(reward);
});

export default router;


