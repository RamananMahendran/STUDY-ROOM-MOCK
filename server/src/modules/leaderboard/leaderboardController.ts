import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database.js';

const AVATAR_COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#ec4899', // pink
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#3b82f6', // blue
  '#ef4444', // red
  '#0ea5e9', // sky
  '#14b8a6', // teal
  '#f43f5e'  // rose
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// GET /api/leaderboards/study - Get Study Leaderboard (pomodorosTotal)
export const getStudyLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const currentUserId = (req as any).user?.id || null;

    const users = await prisma.user.findMany({
      orderBy: { pomodorosTotal: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        pomodorosTotal: true,
        streakCount: true
      }
    });

    const leaderboard = users.map(u => ({
      id: u.id,
      name: u.name,
      score: u.pomodorosTotal,
      label: 'pomodoros',
      bg: AVATAR_COLORS[u.id % AVATAR_COLORS.length],
      initial: getInitials(u.name),
      isYou: currentUserId ? u.id === currentUserId : false
    }));

    return res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/leaderboards/coding - Get Coding Leaderboard (problemsSolved)
export const getCodingLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const currentUserId = (req as any).user?.id || null;

    const users = await prisma.user.findMany({
      orderBy: { problemsSolved: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        problemsSolved: true,
        streakCount: true
      }
    });

    const leaderboard = users.map(u => ({
      id: u.id,
      name: u.name,
      score: u.problemsSolved,
      label: 'solved',
      bg: AVATAR_COLORS[u.id % AVATAR_COLORS.length],
      initial: getInitials(u.name),
      isYou: currentUserId ? u.id === currentUserId : false
    }));

    return res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};
