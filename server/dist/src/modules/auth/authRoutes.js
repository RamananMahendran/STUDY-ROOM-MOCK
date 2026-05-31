import express from 'express';
import { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword } from './authController.js';
import { protect } from '../../middleware/authMiddleware.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
// Password reset flow
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
export default router;
