import { Response, NextFunction } from 'express';
import prisma from '../../config/database.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

// GET /api/friendships - Get all accepted friends
export const getFriends = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
            streakCount: true,
            avatarUrl: true,
            totalStudyHours: true,
            problemsSolved: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
            streakCount: true,
            avatarUrl: true,
            totalStudyHours: true,
            problemsSolved: true
          }
        }
      }
    });

    const friends = friendships.map(f => {
      const friendUser = f.userAId === userId ? f.userB : f.userA;
      return {
        friendshipId: f.id,
        id: friendUser.id,
        name: friendUser.name,
        email: friendUser.email,
        streakCount: friendUser.streakCount,
        avatarUrl: friendUser.avatarUrl,
        totalStudyHours: friendUser.totalStudyHours,
        problemsSolved: friendUser.problemsSolved
      };
    });

    return res.json({
      success: true,
      data: friends
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/friendships/requests - Get incoming & outgoing pending requests
export const getFriendRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const incoming = await prisma.friendship.findMany({
      where: {
        userBId: userId,
        status: 'pending'
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
            streakCount: true,
            avatarUrl: true
          }
        }
      }
    });

    const outgoing = await prisma.friendship.findMany({
      where: {
        userAId: userId,
        status: 'pending'
      },
      include: {
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
            streakCount: true,
            avatarUrl: true
          }
        }
      }
    });

    return res.json({
      success: true,
      incoming: incoming.map(r => ({
        friendshipId: r.id,
        id: r.userA.id,
        name: r.userA.name,
        email: r.userA.email,
        streakCount: r.userA.streakCount,
        avatarUrl: r.userA.avatarUrl
      })),
      outgoing: outgoing.map(r => ({
        friendshipId: r.id,
        id: r.userB.id,
        name: r.userB.name,
        email: r.userB.email,
        streakCount: r.userB.streakCount,
        avatarUrl: r.userB.avatarUrl
      }))
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/friendships/invite - Send friend request / invite by email
export const sendFriendInvite = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { email } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user is trying to invite themselves
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });
    if (currentUser?.email.toLowerCase() === cleanEmail) {
      return res.status(400).json({ success: false, error: "You cannot add yourself as a friend" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!targetUser) {
      // Simulate invite email sending
      return res.json({
        success: true,
        message: 'Invite email sent successfully!',
        invitedEmail: cleanEmail,
        isNewUser: true
      });
    }

    const receiverId = targetUser.id;

    // Check if relationship already exists
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: receiverId },
          { userAId: receiverId, userBId: userId }
        ]
      }
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ success: false, error: 'You are already friends' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ success: false, error: 'Friend request is already pending' });
      }
      return res.status(400).json({ success: false, error: 'Unable to send friend request' });
    }

    const newRequest = await prisma.friendship.create({
      data: {
        userAId: userId,
        userBId: receiverId,
        status: 'pending'
      }
    });

    return res.json({
      success: true,
      message: 'Friend request sent successfully!',
      friendship: newRequest,
      isNewUser: false
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/friendships/requests/:id/accept - Accept request
export const acceptFriendRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?.id;
    const friendshipId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship) {
      return res.status(404).json({ success: false, error: 'Friend request not found' });
    }

    if (friendship.userBId !== userId) {
      return res.status(403).json({ success: false, error: 'You can only accept requests sent to you' });
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' }
    });

    return res.json({
      success: true,
      message: 'Friend request accepted!',
      friendship: updated
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/friendships/requests/:id/decline - Decline/Cancel request or unfriend
export const declineFriendRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?.id;
    const friendshipId = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship) {
      return res.status(404).json({ success: false, error: 'Friend relation not found' });
    }

    if (friendship.userAId !== userId && friendship.userBId !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await prisma.friendship.delete({
      where: { id: friendshipId }
    });

    return res.json({
      success: true,
      message: 'Friend relationship removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
