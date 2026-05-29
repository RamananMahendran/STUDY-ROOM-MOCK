import { Router } from 'express';
import { 
  submitProblem, 
  getSubmissionResult, 
  getUserSubmissions,
  getUserStats,
  getUserSubmissionsPaginated,
  getLatestPairSubmission,
  getPairSessionSubmissions
} from './submissionController.js';

const router = Router();

// Core submission endpoints
router.post('/', submitProblem);
router.get('/:id', getSubmissionResult);

// User history endpoints (Day 3 & Day 5)
router.get('/user/history', getUserSubmissions);
router.get('/user/stats', getUserStats);
router.get('/user/submissions', getUserSubmissionsPaginated);

// Pair session submission endpoints (Day 4)
router.get('/pair/latest', getLatestPairSubmission);
router.get('/pair/:pairSessionId', getPairSessionSubmissions);

export default router;