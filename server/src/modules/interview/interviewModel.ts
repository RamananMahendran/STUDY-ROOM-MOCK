import prisma from '../../config/database.js';

export interface StartInterviewData {
  userId: number;
  difficulty: string;
  isPro: boolean;
}

export interface SubmitResultData {
  interviewId: string;
  problemId: number;
  code: string;
  passed: boolean;
  runtimeMs: number;
  memoryKb: number;
}

class InterviewModel {
  // Start a new mock interview
  async startInterview(data: StartInterviewData) {
    return await prisma.mockInterview.create({
      data: {
        userId: data.userId,
        difficulty: data.difficulty,
        isPro: data.isPro,
        status: 'in_progress',
        problemCount: 3,
      },
    });
  }

  // Add problems to interview
  async addProblems(interviewId: string, problemIds: number[]) {
    const problems = problemIds.map((problemId, index) => ({
      interviewId,
      problemId,
      orderIndex: index + 1,
    }));

    return await prisma.mockInterviewProblem.createMany({
      data: problems,
    });
  }

  // Get interview with problems
  async getInterview(interviewId: string) {
  return await prisma.mockInterview.findUnique({
    where: { id: interviewId },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              tags: true,
              testCases: true,
            },
          },
        },
        orderBy: { orderIndex: 'asc' },
      },
      results: {
        include: {
          problem: { 
            select: { 
              id: true, 
              title: true, 
              difficulty: true,  // ✅ Make sure this is included
              tags: true 
            } 
          },
        },
        orderBy: { submittedAt: 'desc' },
      },
    },
  });
}

  // Submit result for a problem
  async submitResult(data: SubmitResultData) {
    // Check if already submitted
    const existing = await prisma.mockInterviewResult.findFirst({
      where: {
        interviewId: data.interviewId,
        problemId: data.problemId,
      },
    });

    if (existing) {
      return existing;
    }

    return await prisma.mockInterviewResult.create({
      data: {
        interviewId: data.interviewId,
        problemId: data.problemId,
        code: data.code,
        passed: data.passed,
        runtimeMs: data.runtimeMs,
        memoryKb: data.memoryKb,
        score: data.passed ? 100 : 0,
      },
    });
  }

  // Complete interview and calculate results
  async completeInterview(interviewId: string) {
    const results = await prisma.mockInterviewResult.findMany({
      where: { interviewId },
      include: { problem: { select: { tags: true } } },
    });

    const totalScore = results.reduce((sum, r) => sum + (r.passed ? 100 : 0), 0);
    const totalPossible = results.length * 100;
    const finalScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

    // Calculate weak topics (tags where user failed)
    const failedTags: string[] = [];
    results.forEach(result => {
      if (!result.passed && result.problem.tags) {
        failedTags.push(...result.problem.tags);
      }
    });

    // Count frequency of failed tags
    const tagFrequency: Record<string, number> = {};
    failedTags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    // Get top 3 weak topics
    const weakTopics = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        totalScore: Math.round(finalScore),
        weakTopics,
      },
    });
  }

  // Get user's mock interview history
  async getUserInterviews(userId: number, limit: number = 20) {
    return await prisma.mockInterview.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: limit,
      include: {
        results: {
          include: { problem: { select: { title: true, difficulty: true, tags: true } } },
        },
      },
    });
  }

  // Get interview status (for timer)
  async getInterviewStatus(interviewId: string) {
    return await prisma.mockInterview.findUnique({
      where: { id: interviewId },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        totalScore: true,
        weakTopics: true,
      },
    });
  }

  // Update interview status to timeout
  async timeoutInterview(interviewId: string) {
    return await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        status: 'timeout',
        completedAt: new Date(),
      },
    });
  }

  // Get leaderboard (Pro feature)
  async getLeaderboard(limit: number = 50) {
    return await prisma.mockInterview.groupBy({
      by: ['userId'],
      where: { status: 'completed', isPro: true },
      _max: { totalScore: true },
      orderBy: { _max: { totalScore: 'desc' } },
      take: limit,
    });
  }
}

export default new InterviewModel();