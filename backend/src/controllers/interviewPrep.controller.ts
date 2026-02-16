import { Response } from 'express';
import mongoose from 'mongoose';
import { GeminiService } from '../services/gemini.service';
import Job from '../models/Job.model';
import InterviewPrep from '../models/InterviewPrep.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Helpers
const isValidObjectId = (id: any): boolean =>
  typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);

const badRequest = (res: Response, message: string) => {
  res.status(400).json({ success: false, message });
};

const getNextVersion = async (
  jobId: string,
  userId: string
): Promise<number> => {
  const last = await InterviewPrep.findOne({ jobId, userId })
    .sort({ version: -1 })
    .select('version');

  return (last?.version || 0) + 1;
};

// Generate / Get Interview Prep -> POST /api/interview-prep
export const interviewPrep = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobId, regenerate = false } = req.body;

    if (!jobId) {
      badRequest(res, 'jobId is required');
      return;
    }

    if (!isValidObjectId(jobId)) {
      badRequest(res, 'Invalid jobId');
      return;
    }

    if (typeof regenerate !== 'boolean') {
      badRequest(res, 'regenerate must be a boolean');
      return;
    }

    const job = await Job.findOne({ _id: jobId, userId: req.user._id });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // Return cached active version
    if (!regenerate) {
      const existingPrep = await InterviewPrep.findOne({
        jobId,
        userId: req.user._id,
        isActive: true,
      });

      if (existingPrep) {
        // Update view count and last viewed
        existingPrep.viewCount += 1;
        existingPrep.lastViewedAt = new Date();
        await existingPrep.save();

        res.status(200).json({
            success: true,
            data: {
                behavioral: existingPrep.behavioral,
                technical: existingPrep.technical,
                questionsToAsk: existingPrep.questionsToAsk,
                tips: existingPrep.tips,
                mistakesToAvoid: existingPrep.mistakesToAvoid,
            },
            cached: true,
            version: existingPrep.version,
            viewCount: existingPrep.viewCount,
            generatedAt: existingPrep.generatedAt,
            message: 'Interview prep retrieved from storage',
        });
        return;
      }
    }

    // Generate via AI
    const jobDescription = `${job.description}\n\n${job.requirements || ''}`;
    const prep = await GeminiService.generateInterviewPrep(
      job.title,
      job.company,
      jobDescription
    );

    if (
      !prep ||
      !prep.behavioral ||
      !prep.technical ||
      !prep.questionsToAsk
    ) {
      res.status(502).json({
        success: false,
        message: 'AI failed to generate valid interview preparation',
      });
      return;
    }

    // Archive old versions
    await InterviewPrep.updateMany(
      { jobId, userId: req.user._id, isActive: true },
      { isActive: false }
    );

    const newPrep = await InterviewPrep.create({
      jobId,
      userId: req.user._id,
      behavioral: prep.behavioral,
      technical: prep.technical,
      questionsToAsk: prep.questionsToAsk,
      tips: prep.tips,
      mistakesToAvoid: prep.mistakesToAvoid,
      generatedAt: new Date(),
      version: regenerate ? await getNextVersion(jobId, req.user._id) : 1,
      isActive: true,
      viewCount: 1,
      lastViewedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: prep,
      cached: false,
      version: newPrep.version,
      viewCount: 1,
      generatedAt: newPrep.generatedAt,
      message: regenerate 
        ? 'Interview prep regenerated successfully'
        : 'Interview prep generated successfully',
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      badRequest(res, 'Invalid ID format');
      return;
    }

    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to generate interview preparation',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

// Get Single Interview Prep -> GET /api/interview-prep/:id
export const getInterviewPrepById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      badRequest(res, 'Invalid interview prep id');
      return;
    }

    const prep = await InterviewPrep.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('jobId', 'title company');

    if (!prep) {
      res.status(404).json({ success: false, message: 'Interview prep not found' });
      return;
    }

    prep.viewCount += 1;
    prep.lastViewedAt = new Date();
    await prep.save();

    res.status(200).json({ success: true, data: prep });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to fetch interview prep',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

// Get Interview Prep History -> GET /api/interview-prep/history/:jobId
export const getInterviewPrepHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.jobId)) {
      badRequest(res, 'Invalid jobId');
      return;
    }

    const preps = await InterviewPrep.find({
      jobId: req.params.jobId,
      userId: req.user._id,
    })
      .sort({ version: -1 })
      .select('version generatedAt viewCount isActive');

    res.status(200).json({
      success: true,
      totalVersions: preps.length,
      data: preps,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to fetch interview prep history',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

// Restore Interview Prep -> PATCH /api/interview-prep/:id/restore
export const restoreInterviewPrep = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      badRequest(res, 'Invalid interview prep id');
      return;
    }

    const prep = await InterviewPrep.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!prep) {
      res.status(404).json({ success: false, message: 'Interview prep not found' });
      return;
    }

    await InterviewPrep.updateMany(
      { jobId: prep.jobId, userId: req.user._id },
      { isActive: false }
    );

    prep.isActive = true;
    await prep.save();

    res.status(200).json({
      success: true,
      message: `Interview prep version ${prep.version} restored successfully`,
      data: prep,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to restore interview prep',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

// Delete Interview Prep -> DELETE /api/interview-prep/:id
export const deleteInterviewPrep = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      badRequest(res, 'Invalid interview prep id');
      return;
    }

    const prep = await InterviewPrep.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!prep) {
      res.status(404).json({ success: false, message: 'Interview prep not found' });
      return;
    }

    const activeCount = await InterviewPrep.countDocuments({
      jobId: prep.jobId,
      userId: req.user._id,
      isActive: true,
    });

    if (prep.isActive && activeCount === 1) {
      badRequest(res, 'Cannot delete the only active interview prep');
      return;
    }

    await prep.deleteOne();

    res.status(200).json({
      success: true,
      message: `Interview prep version ${prep.version} deleted permanently`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to delete interview prep',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};