import { Router } from 'express';
import { 
  submitProblem, 
  getSubmissionResult, 
  getUserSubmissions,
  getLatestPairSubmission,
  getPairSessionSubmissions
} from './submissionController.js';

const router = Router();

router.post('/', submitProblem);
router.get('/:id', getSubmissionResult);
router.get('/user/history', getUserSubmissions);
router.get('/pair/latest', getLatestPairSubmission);
router.get('/pair/:pairSessionId', getPairSessionSubmissions);

export default router;