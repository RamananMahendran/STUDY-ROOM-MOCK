import { Router, Response, NextFunction } from 'express';
import { getStudyLeaderboard, getCodingLeaderboard } from './leaderboardController.js';
import jwt from 'jsonwebtoken';
import User from '../auth/User.js';

const router = Router();

// Optional protect middleware to identify logged-in user in leaderboards
const optionalProtect = async (req: any, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as jwt.JwtPayload;
      req.user = await User.findById(decoded.userId);
    } catch (error) {
      // Silent catch: optional protect does not fail if token is invalid or expired
    }
  }
  next();
};

router.get('/study', optionalProtect, getStudyLeaderboard);
router.get('/coding', optionalProtect, getCodingLeaderboard);

export default router;
