// src/models/Poll.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOption {
  id: string;
  text: string;
  order: number;
}

export interface IPoll extends Document {
  _id: Types.ObjectId; 
  question: string;
  options: IOption[];
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const optionSchema = new Schema<IOption>({
  id: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true, 
    trim: true 
  },
  order: { 
    type: Number, 
    required: true 
  }
}, { _id: false });

const pollSchema = new Schema<IPoll>({
  question: { 
    type: String, 
    required: true, 
    trim: true 
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function(v: IOption[]) {
        return v && v.length >= 2 && v.length <= 10;
      },
      message: 'Poll must have between 2 and 10 options'
    }
  },
  createdBy: { 
    type: String, 
    default: 'Anonymous' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

pollSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.model<IPoll>('Poll', pollSchema);