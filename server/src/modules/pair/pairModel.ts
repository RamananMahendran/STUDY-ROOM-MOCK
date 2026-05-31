import prisma from '../../config/database.js';

export interface CreatePairSessionData {
  roomCode: string;
  problemId?: number;
  hostId: number;
  language?: string;
}

class PairModel {
  async createSession(data: CreatePairSessionData) {
    return await prisma.pairSession.create({
      data: {
        roomCode: data.roomCode,
        problemId: data.problemId,
        hostId: data.hostId,
        language: data.language || 'python',
        status: 'waiting',
      },
    });
  }

  async findByRoomCode(roomCode: string) {
    return await prisma.pairSession.findUnique({
      where: { roomCode },
      include: {
        problem: { select: { id: true, title: true, description: true, difficulty: true, testCases: true } },
        host: { select: { id: true, name: true, email: true, avatarUrl: true } },
        guest: { select: { id: true, name: true, email: true, avatarUrl: true } },
        cursors: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async findById(sessionId: string) {
    return await prisma.pairSession.findUnique({
      where: { id: sessionId },
      include: {
        problem: true,
        host: true,
        guest: true,
        cursors: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async joinSession(roomCode: string, guestId: number) {
    return await prisma.pairSession.update({
      where: { roomCode },
      data: {
        guestId,
        status: 'active',
      },
    });
  }

  async updateCode(sessionId: string, code: string) {
    return await prisma.pairSession.update({
      where: { id: sessionId },
      data: { currentCode: code },
    });
  }

  async updateCodeByRoomCode(roomCode: string, code: string) {
    return await prisma.pairSession.update({
      where: { roomCode },
      data: { currentCode: code },
    });
  }

  async endSession(sessionId: string) {
    return await prisma.pairSession.update({
      where: { id: sessionId },
      data: { status: 'ended' },
    });
  }

  async updateCursor(
    sessionId: string,
    userId: number,
    lineNumber: number,
    columnNumber: number,
    color: string = '#7F77DD'
  ) {
    return await prisma.pairCursor.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      update: {
        lineNumber,
        columnNumber,
        color,
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        userId,
        lineNumber,
        columnNumber,
        color,
      },
    });
  }

  async getCursors(sessionId: string) {
    return await prisma.pairCursor.findMany({
      where: { sessionId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async deleteCursor(sessionId: string, userId: number) {
    return await prisma.pairCursor.deleteMany({
      where: {
        sessionId,
        userId,
      },
    });
  }

  async getUserSessions(userId: number) {
    return await prisma.pairSession.findMany({
      where: {
        OR: [{ hostId: userId }, { guestId: userId }],
      },
      include: {
        problem: { select: { id: true, title: true, difficulty: true } },
        host: { select: { id: true, name: true } },
        guest: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new PairModel();