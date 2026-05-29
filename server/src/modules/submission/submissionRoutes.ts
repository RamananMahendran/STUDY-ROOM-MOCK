import { Router } from 'express';
import { 
  submitProblem, 
  getSubmissionResult,
  getUserSubmissions 
} from './submissionController.js';

const router = Router();

// Submit code for a problem
router.post('/', submitProblem);

// Poll submission result
router.get('/:id', getSubmissionResult);

// Get user's submission history
router.get('/user/history', getUserSubmissions);

export default router;