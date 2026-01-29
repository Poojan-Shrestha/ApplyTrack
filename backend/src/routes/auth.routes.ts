import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;