import prisma from '../../config/database.js';
class PairModel {
    async createSession(data) {
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
    async findByRoomCode(roomCode) {
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
    async findById(sessionId) {
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
    async joinSession(roomCode, guestId) {
        return await prisma.pairSession.update({
            where: { roomCode },
            data: {
                guestId,
                status: 'active',
            },
        });
    }
    async updateCode(sessionId, code) {
        return await prisma.pairSession.update({
            where: { id: sessionId },
            data: { currentCode: code },
        });
    }
    async updateCodeByRoomCode(roomCode, code) {
        return await prisma.pairSession.update({
            where: { roomCode },
            data: { currentCode: code },
        });
    }
    async endSession(sessionId) {
        return await prisma.pairSession.update({
            where: { id: sessionId },
            data: { status: 'ended' },
        });
    }
    async updateCursor(sessionId, userId, lineNumber, columnNumber, color = '#7F77DD') {
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
    async getCursors(sessionId) {
        return await prisma.pairCursor.findMany({
            where: { sessionId },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
    }
    async deleteCursor(sessionId, userId) {
        return await prisma.pairCursor.deleteMany({
            where: {
                sessionId,
                userId,
            },
        });
    }
    async getUserSessions(userId) {
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
