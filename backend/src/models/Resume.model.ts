import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string; // Random secure filename
  originalFilename: string; // User's original filename
  fileUrl: string; // ImageKit CDN URL
  fileId: string; // ImageKit file ID
  fileSize: number; 
  mimeType: string;
  isDefault: boolean;
  analysis?: {
    structureScore: number;
    contentScore: number;
    missingSections: string[];
    suggestions: string[];
    analyzedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileId: { type: String, required: true, unique: true },
    fileSize: { type: Number, required: true },
    mimeType: {
      type: String,
      required: true,
      enum: {
        values: [
          'application/pdf',
        ],
        message: '{VALUE} is not a supported file type',
      },
    },
    isDefault: { type: Boolean, default: false },
    analysis: {
      structureScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      contentScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      missingSections: [{ type: String }],
      suggestions: [{ type: String }],
      analyzedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

// Indexes
// Ensure only one default resume per user
resumeSchema.index(
  { userId: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

// PRE-SAVE HOOK - ENSURE SINGLE DEFAULT RESUME
resumeSchema.pre('save', async function () {
  if (this.isDefault && this.isModified('isDefault')) {
    // Unset all other default resumes for this user
    await mongoose.model('Resume').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
});

export default mongoose.model<IResume>('Resume', resumeSchema);