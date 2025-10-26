import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  pollId: mongoose.Types.ObjectId;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>({
  pollId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Poll', 
    required: true,
    index: true 
  },
  userId: { type: String, required: true, index: true }
}, {
  timestamps: true
});

// Compound index: one like per user per poll
likeSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', likeSchema);
