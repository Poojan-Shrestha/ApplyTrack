import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewPrep extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  // Interview prep content
  behavioral: Array<{
    question: string;
    why_asked: string;
    answer_framework: string;
  }>;
  technical: Array<{
    question: string;
    key_points: string[];
  }>;
  questionsToAsk: Array<{
    question: string;
    purpose: string;
  }>;
  tips: string[];
  mistakesToAvoid: string[];
  
  // Metadata
  generatedAt: Date;
  version: number; // Track regenerations
  isActive: boolean; // User can archive
  viewCount: number; // Track usage
  lastViewedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const interviewPrepSchema = new Schema<IInterviewPrep>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    behavioral: [
      {
        question: { type: String, required: true },
        why_asked: { type: String, required: true },
        answer_framework: { type: String, required: true },
      },
    ],
    technical: [
      {
        question: { type: String, required: true },
        key_points: [{ type: String }],
      },
    ],
    questionsToAsk: [
      {
        question: { type: String, required: true },
        purpose: { type: String, required: true },
      },
    ],
    tips: [{ type: String }],
    mistakesToAvoid: [{ type: String }],
    
    // Permanent storage fields
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lastViewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - one active prep per job per user
// But allows multiple archived versions
interviewPrepSchema.index(
  { jobId: 1, userId: 1, isActive: 1 },
  { 
    unique: true,
    partialFilterExpression: { isActive: true }
  }
);

export default mongoose.model<IInterviewPrep>('InterviewPrep', interviewPrepSchema);