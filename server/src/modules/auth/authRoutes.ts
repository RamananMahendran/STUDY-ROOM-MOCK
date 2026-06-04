import express from 'express';
import { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword, googleAuth } from './authController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);           // Google OAuth
router.get('/profile', protect, getUserProfile);

// Password reset flow
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router;

