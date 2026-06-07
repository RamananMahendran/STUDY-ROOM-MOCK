import prisma from '../../config/database.js';

class WeeklyChallengeModel {
  // Get or create current week's challenge
  async getOrCreateCurrentWeek() {
    const now = new Date();
    const currentWeekNumber = this.getWeekNumber(now);
    
    // Find existing challenge for current week
    let challenge = await prisma.weeklyChallenge.findUnique({
      where: { weekNumber: currentWeekNumber },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                tags: true,
              },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });
    
    // If no challenge exists for current week, create one
    if (!challenge) {
      const startDate = this.getStartOfWeek(now);
      const endDate = this.getEndOfWeek(now);
      
      challenge = await prisma.weeklyChallenge.create({
        data: {
          weekNumber: currentWeekNumber,
          startDate,
          endDate,
          isActive: true,
        },
        include: {
          problems: {
            include: {
              problem: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  difficulty: true,
                  tags: true,
                },
              },
            },
            orderBy: { dayNumber: 'asc' },
          },
        },
      });
      
      // Seed default problems for the week (you can customize this)
      await this.seedWeeklyProblems(challenge.id, currentWeekNumber);
      
      // Fetch again with problems
      challenge = await prisma.weeklyChallenge.findUnique({
        where: { id: challenge.id },
        include: {
          problems: {
            include: {
              problem: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  difficulty: true,
                  tags: true,
                },
              },
            },
            orderBy: { dayNumber: 'asc' },
          },
        },
      });
    }
    
    return challenge;
  }
  
  // Get user progress for a challenge
  async getUserProgress(userId: number, challengeId: string) {
    return await prisma.userWeeklyChallengeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });
  }
  
  // Start a challenge for a user
  async startChallenge(userId: number, challengeId: string) {
    const existing = await this.getUserProgress(userId, challengeId);
    
    if (existing) {
      return existing;
    }
    
    return await prisma.userWeeklyChallengeProgress.create({
      data: {
        userId,
        challengeId,
        completedDays: [], // ✅ FIX: Start with empty array
        startedAt: new Date(),
      },
    });
  }
  
  // Complete a day in the challenge
  async completeDay(userId: number, challengeId: string, dayNumber: number) {
    const progress = await this.getUserProgress(userId, challengeId);
    
    if (!progress) {
      throw new Error('Weekly challenge not started');
    }
    
    // ✅ FIX: Only add if not already completed
    const completedDays = progress.completedDays.includes(dayNumber)
      ? progress.completedDays
      : [...progress.completedDays, dayNumber];
    
    const challenge = await prisma.weeklyChallenge.findUnique({
      where: { id: challengeId },
      include: { problems: true },
    });
    
    const isCompleted = completedDays.length === (challenge?.problems?.length || 0);
    
    return await prisma.userWeeklyChallengeProgress.update({
      where: { id: progress.id },
      data: {
        completedDays,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }
  
  // Update problem completion (optional - for granular tracking)
  async updateProblemCompletion(
    userId: number,
    challengeId: string,
    dayNumber: number,
    problemId: string,
    completed: boolean
  ) {
    // You can implement this if you want to track individual problem completion
    // For now, we'll just track day completion
    return await this.completeDay(userId, challengeId, dayNumber);
  }
  
  // Get completions for a specific day
  async getDayCompletions(userId: number, challengeId: string, dayNumber: number) {
    const progress = await this.getUserProgress(userId, challengeId);
    if (!progress) {
      return {};
    }
    
    // For weekly challenge, since we only track day completion,
    // return empty object or implement problem-level tracking if needed
    return {};
  }
  
  // Update progress (for granular updates)
  async updateProgress(userId: number, challengeId: string, data: any) {
    const progress = await this.getUserProgress(userId, challengeId);
    if (!progress) {
      throw new Error('Weekly challenge not started');
    }
    
    return await prisma.userWeeklyChallengeProgress.update({
      where: { id: progress.id },
      data,
    });
  }
  
  // Seed problems for the weekly challenge
  async seedWeeklyProblems(challengeId: string, weekNumber: number) {
    // Define problems for each day of the week
    // This is example data - replace with your actual problem IDs
    const weeklyProblems = [
      { problemId: 1, dayNumber: 1 },  // Two Sum
      { problemId: 3, dayNumber: 2 },  // Palindrome Number
      { problemId: 4, dayNumber: 3 },  // FizzBuzz
      { problemId: 45, dayNumber: 4 }, // Binary Search
      { problemId: 46, dayNumber: 5 }, // Validate BST
      { problemId: 47, dayNumber: 6 }, // Sliding Window Maximum
      { problemId: 95, dayNumber: 7 }, // Median of Two Arrays
    ];
    
    for (const item of weeklyProblems) {
      await prisma.weeklyChallengeProblem.upsert({
        where: {
          challengeId_dayNumber: {
            challengeId,
            dayNumber: item.dayNumber,
          },
        },
        update: {},
        create: {
          challengeId,
          problemId: item.problemId,
          dayNumber: item.dayNumber,
          orderIndex: item.dayNumber,
        },
      });
    }
    
    console.log(`✅ Seeded problems for week ${weekNumber}`);
  }
  
  // Helper: Get week number from date
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
  
  // Helper: Get start of week (Monday)
  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  
  // Helper: Get end of week (Sunday)
  getEndOfWeek(date: Date): Date {
    const start = this.getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }
}

export default new WeeklyChallengeModel();