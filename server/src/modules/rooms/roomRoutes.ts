import { Router } from 'express';
import { getRooms, createRoom, getRoomById } from './roomController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', getRooms);
router.get('/flush', async (req, res) => {
  const { Redis } = require('ioredis');
  const redis = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });
  await redis.flushall();
  res.send('Flushed');
});

router.get('/:id', getRoomById);
router.post('/', createRoom);

export default router;
