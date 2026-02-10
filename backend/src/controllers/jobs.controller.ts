import { Response } from 'express';
import Job from '../models/Job.model';
import Resume from '../models/Resume.model';
import InterviewPrep from '../models/InterviewPrep.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { GeminiService } from '../services/gemini.service';
import mongoose from 'mongoose';

// Helpers
const isValidObjectId = (id: any): boolean =>
  typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);

const badRequest = (res: Response, message: string) => {
  res.status(400).json({ success: false, message });
};

// Get all jobs -> GET /api/jobs
export const getJobs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const query: any = {
      userId: req.user!._id,
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
      total: jobs.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to fetch jobs',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Get single job by ID -> GET /api/jobs/:id
export const getJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      badRequest(res, 'Invalid job id');
      return;
    }

    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to fetch job',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Create new job -> POST /api/jobs
export const createJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.body?.title || !req.body?.company) {
      badRequest(res, 'title and company are required');
      return;
    }

    const job = await Job.create({
      ...req.body,
      userId: req.user!._id,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to create job',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Update job -> Patch /api/jobs/:id
export const updateJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      badRequest(res, 'Invalid job id');
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      badRequest(res, 'Request body cannot be empty');
      return;
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to update job',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Delete job AND related interview prep -> DELETE /api/jobs/:id
export const deleteJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      badRequest(res, 'Invalid job id');
      return;
    }

    const job = await Job.findOne({ _id: req.params.id, userId: req.user!._id });
    
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // CASCADE DELETE: Delete interview preps first
    await InterviewPrep.deleteMany({
      jobId: job._id,
      userId: req.user!._id,
    });

    // Then delete the job
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job and related interview prep deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to delete job',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Analyze job with resume (ATS score) -> POST /api/jobs/:id/ats-analysis
export const atsAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const jobId = req.params.id;
    const { resumeId } = req.body;

    if (!isValidObjectId(jobId)) {
      badRequest(res, 'Invalid job id');
      return;
    }

    if (!resumeId) {
      badRequest(res, 'resumeId is required');
      return;
    }

    if (!isValidObjectId(resumeId)) {
      badRequest(res, 'Invalid resumeId');
      return;
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    const job = await Job.findOne({
      _id: jobId,
      userId: req.user!._id,
    });

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    const response = await fetch(resume.fileUrl);
    const pdfBuffer = Buffer.from(await response.arrayBuffer());

    const jobDesc = `${job.description}\n\n${job.requirements || ''}`;

    const analysis = await GeminiService.analyzeATSWithPDF(
      pdfBuffer,
      jobDesc
    );

    job.atsScore = analysis.overall_score;
    job.atsAnalysis = {
      overallScore: analysis.overall_score,
      keywordMatch: analysis.keyword_match,
      formattingScore: analysis.formatting_score,
      matchedKeywords: analysis.matched_keywords,
      missingKeywords: analysis.missing_keywords,
      strengths: analysis.strengths,
      suggestions: analysis.suggestions,
      analyzedAt: new Date(),
    };
    job.atsAnalyzedResumeId = resume._id;

    await job.save();

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to perform ATS analysis',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};