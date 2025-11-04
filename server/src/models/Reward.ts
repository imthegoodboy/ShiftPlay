import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReward extends Document {
  userId: Types.ObjectId;
  rewardType: 'nft' | 'bonus_xp' | 'mystery_box';
  rewardName: string;
  rewardData: any;
  claimed: boolean;
  createdAt: Date;
}

const RewardSchema = new Schema<IReward>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rewardType: { type: String, enum: ['nft', 'bonus_xp', 'mystery_box'], required: true },
  rewardName: { type: String, required: true },
  rewardData: { type: Schema.Types.Mixed },
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReward>('Reward', RewardSchema);


