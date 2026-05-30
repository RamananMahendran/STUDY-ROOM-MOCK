import { Router } from 'express';
import { createSession, joinSession, getSession, getSessionById, updateCode, endSession, getUserSessions, submitPairCode, // 👈 ADD THIS
getPairSubmissions // 👈 ADD THIS
 } from './pairController.js';
const router = Router();
router.post('/create', createSession);
router.post('/join', joinSession);
router.get('/room/:roomCode', getSession);
router.get('/session/:sessionId', getSessionById);
router.post('/:roomCode/code', updateCode);
router.post('/:roomCode/submit', submitPairCode); // 👈 ADD THIS
router.get('/:roomCode/submissions', getPairSubmissions); // 👈 ADD THIS
router.delete('/:roomCode/end', endSession);
router.get('/user/sessions', getUserSessions);
export default router;
