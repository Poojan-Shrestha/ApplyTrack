import express from 'express';
import {
  interviewPrep,
  getInterviewPreps,
  getInterviewPrepById,
  getInterviewPrepHistory,
  restoreInterviewPrep,
  deleteInterviewPrep,
  deleteAllInterviewPrepsForJob,
} from '../controllers/interviewPrep.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', interviewPrep);
router.get('/', getInterviewPreps);
router.get('/:id', getInterviewPrepById);
router.get('/history/:jobId', getInterviewPrepHistory);
router.patch('/:id/restore', restoreInterviewPrep);
router.delete('/:id', deleteInterviewPrep);
router.delete('/job/:jobId', deleteAllInterviewPrepsForJob);

export default router;