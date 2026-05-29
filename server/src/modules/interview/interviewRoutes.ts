import { Router } from 'express';
import { requirePro } from '../../middleware/proMiddleware.js';
import {
  startInterview,
  getInterviewDetails,
  submitProblemSolution,
  completeInterview,
  getInterviewStatus,
  getInterviewHistory,
  getLeaderboard,
} from './interviewController.js';

const router = Router();

// All mock interview routes require Pro membership
router.use(requirePro);  // 👈 Apply to all routes below

router.post('/start', startInterview);
router.get('/history', getInterviewHistory);
router.get('/status/:id', getInterviewStatus);
router.get('/leaderboard/global', getLeaderboard);
router.post('/:id/submit', submitProblemSolution);
router.post('/:id/complete', completeInterview);
router.get('/:id', getInterviewDetails);

export default router;