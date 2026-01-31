import express from 'express';
import {
  uploadResume,
  getResumes,
  deleteResume,
  analyzeResume,
  setDefaultResume,
} from '../controllers/resumes.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadSingleFile } from '../middleware/upload.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getResumes);
router.post('/upload', uploadSingleFile('file'), uploadResume);
router.delete('/:id', deleteResume);
router.post('/:id/analyze', analyzeResume);
router.patch('/:id/default', setDefaultResume);

export default router;