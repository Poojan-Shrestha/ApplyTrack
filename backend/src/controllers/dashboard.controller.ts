import { Response } from 'express';
import Job from '../models/Job.model';
import Resume from '../models/Resume.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Get dashboard statistics for user -> GET /api/dashboard/stats
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const [totalJobs, totalResumes, jobsByStatus] = await Promise.all([
      Job.countDocuments({ userId }),
      Resume.countDocuments({ userId }),
      Job.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const statusCounts: Record<string, number> = {
      saved: 0,
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0,
    };

    jobsByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    const recentJobs = await Job.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalApplied =
      statusCounts.applied +
      statusCounts.interviewing +
      statusCounts.offered +
      statusCounts.rejected;

    const successRate =
      totalApplied > 0
        ? Math.round((statusCounts.offered / totalApplied) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalResumes,
        jobsByStatus: statusCounts,
        recentApplications: recentJobs,
        successRate,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to fetch dashboard statistics',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};