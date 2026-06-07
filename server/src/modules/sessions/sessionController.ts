import { Response } from 'express';
import prisma from '../../config/database.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

export const getUserSessionHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Profile.jsx expects a response structure like: data.data || data || []
    res.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
