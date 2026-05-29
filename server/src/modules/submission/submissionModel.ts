import prisma from '../../config/database.js';

export interface SubmissionData {
  userId: number;
  problemId: number;
  code: string;
  language: string;
  submittedFrom?: string;   // 👈 ADDED: 'solo' or 'pair'
  pairSessionId?: string;   // 👈 ADDED: UUID of the pair session
}

class SubmissionModel {
  async create(data: SubmissionData) {
    return await prisma.submission.create({
      data: {
        userId: data.userId,
        problemId: data.problemId,
        code: data.code,
        language: data.language,
        status: 'pending',
        submittedFrom: data.submittedFrom || 'solo',  // 👈 ADDED
        pairSessionId: data.pairSessionId || null,   // 👈 ADDED
      },
    });
  }

  async updateStatus(
  id: string,
  status: string,
  data: {
    runtimeMs?: number;
    memoryKb?: number;
    errorMessage?: string;  // Changed from error_message
    testResults?: any;       // Changed from test_results
  } = {}
) {
  return await prisma.submission.update({
    where: { id },
    data: {
      status,
      runtimeMs: data.runtimeMs,
      memoryKb: data.memoryKb,
      errorMessage: data.errorMessage,  // Changed
      testResults: data.testResults,     // Changed
      updatedAt: new Date(),
    },
  });
}

  async findById(id: string) {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        problem: {
          select: { id: true, title: true, difficulty: true, testCases: true }
        },
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        pairSession: {  // 👈 ADDED: include pair session info
          select: {
            id: true,
            roomCode: true,
            hostId: true,
            guestId: true,
            status: true
          }
        }
      }
    });
  }

  async getPendingSubmissions(limit: number = 10) {
    return await prisma.submission.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        pairSession: {  // 👈 ADDED: include pair session for worker to know room code
          select: { roomCode: true }
        }
      }
    });
  }

  async getUserSubmissions(userId: number, problemId?: number, limit: number = 50) {
    const where: any = { userId };
    if (problemId) {
      where.problemId = problemId;
    }
    
    return await prisma.submission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        problem: {
          select: { id: true, title: true, difficulty: true }
        },
        pairSession: {  // 👈 ADDED: include pair session info in history
          select: {
            id: true,
            roomCode: true,
            host: { select: { id: true, name: true } },
            guest: { select: { id: true, name: true } }
          }
        }
      }
    });
  }

  // 👈 ADDED: Get latest submission for a pair session (for reconnecting users)
  async getLatestPairSubmission(pairSessionId: string) {
    return await prisma.submission.findFirst({
      where: {
        pairSessionId: pairSessionId,
        status: { not: 'pending' }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        problem: { select: { id: true, title: true, difficulty: true } },
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
  }

  // 👈 ADDED: Get submissions for a specific pair session
  async getPairSessionSubmissions(pairSessionId: string, limit: number = 50) {
    return await prisma.submission.findMany({
      where: { pairSessionId: pairSessionId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        problem: { select: { title: true } },
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
  }
}

export default new SubmissionModel();