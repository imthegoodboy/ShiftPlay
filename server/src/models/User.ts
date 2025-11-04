import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username: string;
  xp: number;
  level: number;
  totalSwaps: number;
  totalVolumeUsd: number;
  streakDays: number;
  lastSwapDate: string | null;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, index: true, unique: true },
  username: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalSwaps: { type: Number, default: 0 },
  totalVolumeUsd: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastSwapDate: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);


