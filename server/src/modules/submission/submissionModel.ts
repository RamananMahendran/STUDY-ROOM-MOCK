import prisma from '../../config/database.js';

export interface SubmissionData {
  userId: number;
  problemId: number;
  code: string;
  language: string;
  submittedFrom?: string;   // 'solo' or 'pair'
  pairSessionId?: string;   // UUID of the pair session
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
        submittedFrom: data.submittedFrom || 'solo',
        pairSessionId: data.pairSessionId || null,
      },
    });
  }

  async updateStatus(
    id: string,
    status: string,
    data: {
      runtimeMs?: number;
      memoryKb?: number;
      errorMessage?: string;
      testResults?: any;
    } = {}
  ) {
    return await prisma.submission.update({
      where: { id },
      data: {
        status,
        runtimeMs: data.runtimeMs,
        memoryKb: data.memoryKb,
        errorMessage: data.errorMessage,
        testResults: data.testResults,
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
        pairSession: {
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
        pairSession: {
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
        pairSession: {
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

  // 👇 NEW: Get submission stats for a user (for profile page)
  // Get submission stats for a user (for profile page)
async getUserStats(userId: number) {
  // Total problems solved (distinct problem IDs where status is accepted)
  const solvedResult = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT "problem_id") as solved
    FROM submissions
    WHERE user_id = ${userId} AND status = 'accepted'
  `;
  
  // Total submissions
  const totalSubmissions = await prisma.submission.count({
    where: { userId },
  });
  
  // Accepted submissions
  const acceptedSubmissions = await prisma.submission.count({
    where: { userId, status: 'accepted' },
  });
  
  // Language breakdown
  const languageBreakdown = await prisma.submission.groupBy({
    by: ['language'],
    where: { userId },
    _count: { language: true },
    orderBy: { _count: { language: 'desc' } },
  });
  
  // Convert BigInt to Number (fix for JSON serialization)
  const solved = Number((solvedResult as any)[0]?.solved) || 0;
  const successRate = totalSubmissions > 0 
    ? (acceptedSubmissions / totalSubmissions) * 100 
    : 0;
  
  return {
    problemsSolved: solved,
    totalSubmissions,
    acceptedSubmissions,
    successRate: Math.round(successRate * 100) / 100,
    languageBreakdown: languageBreakdown.map(lb => ({
      language: lb.language,
      count: lb._count.language,
    })),
  };
}

  // 👇 NEW: Get paginated submissions with problem details (for profile page)
  async getUserSubmissionsPaginated(userId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const submissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        problem: { 
          select: { id: true, title: true, difficulty: true } 
        },
      },
    });
    
    const total = await prisma.submission.count({ where: { userId } });
    
    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get latest submission for a pair session (for reconnecting users)
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

  // Get submissions for a specific pair session
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