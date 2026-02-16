import express from 'express';
import {
  interviewPrep,
  getInterviewPrepById,
  getInterviewPrepHistory,
  restoreInterviewPrep,
  deleteInterviewPrep,
} from '../controllers/interviewPrep.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', interviewPrep);
router.get('/history/:jobId', getInterviewPrepHistory);
router.patch('/:id/restore', restoreInterviewPrep);
router.get('/:id', getInterviewPrepById);
router.delete('/:id', deleteInterviewPrep);

export default router;