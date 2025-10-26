import mongoose, { Schema, Document } from "mongoose";

interface Option {
  text: string;
  votes: number;
}

export interface PollDocument extends Document {
  question: string;
  options: Option[];
  likes: number;
  createdAt: Date;
}

const PollSchema = new Schema<PollDocument>({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<PollDocument>("Poll", PollSchema);
