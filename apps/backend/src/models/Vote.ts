import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  pollId: mongoose.Types.ObjectId;
  userId: string;
  optionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>({
  pollId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Poll', 
    required: true,
    index: true 
  },
  userId: { type: String, required: true, index: true },
  optionId: { type: String, required: true }
}, {
  timestamps: true
});

// Compound index: one vote per user per poll
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IVote>('Vote', voteSchema);
