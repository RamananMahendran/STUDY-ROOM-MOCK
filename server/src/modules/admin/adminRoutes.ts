import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';
import {
  getStats,
  getUsers, getUserDetail, updateUserRole, deleteUser,
  getProblems, createProblem, updateProblem, deleteProblem,
  getContests, createContest, updateContest, deleteContest,
  getRooms, deleteRoom,
  getSubmissions,
  getStudyPlans, createStudyPlan, updateStudyPlan, deleteStudyPlan,
  getAuditLogs,
} from './adminController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, requireAdmin);

// Dashboard
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Problems
router.get('/problems', getProblems);
router.post('/problems', createProblem);
router.put('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);

// Contests
router.get('/contests', getContests);
router.post('/contests', createContest);
router.put('/contests/:id', updateContest);
router.delete('/contests/:id', deleteContest);

// Rooms
router.get('/rooms', getRooms);
router.delete('/rooms/:id', deleteRoom);

// Submissions
router.get('/submissions', getSubmissions);

// Study Plans
router.get('/study-plans', getStudyPlans);
router.post('/study-plans', createStudyPlan);
router.put('/study-plans/:id', updateStudyPlan);
router.delete('/study-plans/:id', deleteStudyPlan);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

export default router;
