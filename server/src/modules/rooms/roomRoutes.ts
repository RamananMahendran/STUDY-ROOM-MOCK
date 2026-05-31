import { Router } from 'express';
import { getRooms, createRoom } from './roomController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', getRooms);
router.post('/', protect, createRoom);

export default router;
