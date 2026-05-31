import { Router } from 'express';
import { submitProblem, getSubmissionResult, getUserSubmissions, getUserStats, getUserSubmissionsPaginated, getLatestPairSubmission, getPairSessionSubmissions } from './submissionController.js';
const router = Router();
// Core submission endpoints
router.post('/', submitProblem);
// User history endpoints (Day 3 & Day 5) - MUST come before /:id to avoid matching as ID
router.get('/user/history', getUserSubmissions);
router.get('/user/stats', getUserStats);
router.get('/user/submissions', getUserSubmissionsPaginated);
// Pair session submission endpoints (Day 4)
router.get('/pair/latest', getLatestPairSubmission);
router.get('/pair/:pairSessionId', getPairSessionSubmissions);
// Generic ID endpoint - MUST come last
router.get('/:id', getSubmissionResult);
export default router;
