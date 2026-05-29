import prisma from '../../config/database.js';

export interface SubmissionData {
  userId: number;
  problemId: number;
  code: string;
  language: string;
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
      },
    });
  }

  async updateStatus(
    id: string,
    status: string,
    data: {
      runtimeMs?: number;
      memoryKb?: number;
      error_message?: string;
      test_results?: any;
    } = {}
  ) {
    return await prisma.submission.update({
      where: { id },
      data: {
        status,
        runtimeMs: data.runtimeMs,
        memoryKb: data.memoryKb,
        // Note: You may need to add these fields to your schema if not present
        // error_message: data.error_message,
        // test_results: data.test_results,
      },
    });
  }

  async findById(id: string) {
    return await prisma.submission.findUnique({
        where: { id },  // id is String (UUID) from your schema
        include: {
        problem: {
            select: { title: true, difficulty: true }
        },
        user: {
            select: { name: true, email: true }
        }
        }
    });
}

  async getPendingSubmissions(limit: number = 10) {
    return await prisma.submission.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
      take: limit,
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
          select: { title: true, difficulty: true }
        }
      }
    });
  }
}

export default new SubmissionModel();