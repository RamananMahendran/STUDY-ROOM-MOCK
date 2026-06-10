import express from 'express';
import { getAllProblems, getProblemById, getProblemLeaderboard, createProblem, updateProblem, deleteProblem } from './problemController.js';

const router = express.Router();

// Public routes
router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.get('/:id/leaderboard', getProblemLeaderboard);

// Admin routes (authentication will be added later)
router.post('/', createProblem);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;