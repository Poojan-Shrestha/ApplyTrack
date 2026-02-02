import express from 'express';
import { getJobs, getJob, createJob, updateJob, deleteJob, atsAnalysis } from '../controllers/jobs.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getJobs);
router.post('/', createJob);
router.get('/:id', getJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/:id/ats-analysis', protect, atsAnalysis);

export default router;