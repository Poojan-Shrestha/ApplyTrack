import { Response } from 'express';
import Job from '../models/Job.model';
import InterviewPrep from '../models/InterviewPrep.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Get all jobs -> GET /api/jobs
export const getJobs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, search } = req.query;

    const query: any = { userId: req.user!._id };

    if (status && status !== 'all') query.status = status;
    if (search) query.$text = { $search: search as string };

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