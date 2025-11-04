import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISwap extends Document {
  userId: Types.ObjectId;
  sideshiftOrderId?: string;
  fromCoin: string;
  toCoin: string;
  fromAmount: number;
  toAmount?: number;
  status: 'pending' | 'completed' | 'failed';
  xpEarned: number;
  createdAt: Date;
  completedAt?: Date;
}

const SwapSchema = new Schema<ISwap>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sideshiftOrderId: { type: String },
  fromCoin: { type: String, required: true },
  toCoin: { type: String, required: true },
  fromAmount: { type: Number, required: true },
  toAmount: { type: Number },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },
  xpEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
}, { collection: 'shiftplay_swaps' });

export default mongoose.model<ISwap>('Swap', SwapSchema);


