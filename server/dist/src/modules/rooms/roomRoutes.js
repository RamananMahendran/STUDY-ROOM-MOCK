import { Router } from 'express';
import { getRooms, createRoom } from './roomController.js';
const router = Router();
router.get('/', getRooms);
router.post('/', createRoom);
export default router;
