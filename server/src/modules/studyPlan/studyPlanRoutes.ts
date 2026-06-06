import { Router } from 'express';
import {
  getAllPlans,
  getPlanBySlug,
  startPlan,
  completeDay,
  getCurrentWeeklyChallenge,
  startWeeklyChallenge,
  completeWeeklyDay,
  seedPlans,
} from './studyPlanController.js';

const router = Router();

// ⚠️ IMPORTANT: Weekly routes MUST come BEFORE the /:slug route
router.get('/weekly/current', getCurrentWeeklyChallenge);
router.post('/weekly/start', startWeeklyChallenge);
router.post('/weekly/complete-day', completeWeeklyDay);

router.get('/', getAllPlans);
router.get('/:slug', getPlanBySlug);
router.post('/:slug/start', startPlan);
router.post('/:slug/complete-day', completeDay);

router.post('/seed', seedPlans);

export default router;