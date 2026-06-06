import { Router } from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import {
  getContests,
  getContest,
  registerForContest,
  getContestProblems,
  getContestLeaderboard,
} from './contestController.js';

const router = Router();

// All routes require authentication
router.get('/', protect as any, getContests);
router.get('/:id', protect as any, getContest);
router.post('/:id/register', protect as any, registerForContest);
router.get('/:id/problems', protect as any, getContestProblems);
router.get('/:id/leaderboard', protect as any, getContestLeaderboard);

export default router;
