import { Router } from 'express';
import { getUserSessionHistory } from './sessionController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/user/history', protect, getUserSessionHistory);

export default router;
