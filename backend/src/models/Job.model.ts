import mongoose, { Schema, Document } from 'mongoose';

export type JobStatus = 
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  salaryRange?: string;
  description?: string;
  requirements?: string;
  status: JobStatus;
  appliedDate?: Date;
  notes?: string;
  atsScore?: number;
  atsAnalysis?: {
    overallScore: number;
    keywordMatch: number;
    formattingScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    suggestions: string[];
    analyzedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
      maxlength: [100, 'Salary range cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn'],
        message: '{VALUE} is not a valid status',
      },
      default: 'saved',
      index: true,
    },
    appliedDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
      trim: true,
    },
    atsScore: {
      type: Number,
      min: [0, 'ATS score cannot be less than 0'],
      max: [100, 'ATS score cannot exceed 100'],
      default: null,
    },
    atsAnalysis: {
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      keywordMatch: {
        type: Number,
        min: 0,
        max: 100,
      },
      formattingScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      matchedKeywords: [{ type: String }],
      missingKeywords: [{ type: String }],
      strengths: [{ type: String }],
      suggestions: [{ type: String }],
      analyzedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ userId: 1, createdAt: -1 });
jobSchema.index({ userId: 1, appliedDate: -1 });
jobSchema.index({ userId: 1, company: 1 });
jobSchema.index({ title: 'text', company: 'text', description: 'text', location: 'text' });

export default mongoose.model<IJob>('Job', jobSchema);