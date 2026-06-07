import { Router } from 'express';
import {
  getFriends,
  getFriendRequests,
  sendFriendInvite,
  acceptFriendRequest,
  declineFriendRequest,
} from './friendshipController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getFriends);
router.get('/requests', protect, getFriendRequests);
router.post('/invite', protect, sendFriendInvite);
router.post('/requests/:id/accept', protect, acceptFriendRequest);
router.post('/requests/:id/decline', protect, declineFriendRequest);

export default router;
