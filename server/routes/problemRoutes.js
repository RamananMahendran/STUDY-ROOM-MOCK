import express from 'express';
import {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problemController.js';

const router = express.Router();

// Public routes
router.get('/', getAllProblems);
router.get('/:id', getProblemById);

// Admin routes (authentication will be added later)
router.post('/', createProblem);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;