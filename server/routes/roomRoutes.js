import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getActiveRooms,
  createRoom,
} from '../controllers/roomController.js';

const router = express.Router();

router.get('/',  protect, getActiveRooms);
router.post('/', protect, createRoom);

export default router;
