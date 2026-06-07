import prisma from '../../config/database.js';

export interface CreateStudyPlanData {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  durationDays: number;
  problemCount: number;
  isPro?: boolean;
  icon?: string;
  color?: string;
}

export interface AddProblemToPlanData {
  planId: string;
  problemId: number;
  dayNumber: number;
  orderIndex?: number;
  notes?: string;
}

class StudyPlanModel {
  // Create a new study plan
  async createPlan(data: CreateStudyPlanData) {
    return await prisma.studyPlan.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,
        durationDays: data.durationDays,
        problemCount: data.problemCount,
        isPro: data.isPro || false,
        icon: data.icon,
        color: data.color,
      },
    });
  }

  // Get all study plans
  async getAllPlans(userId?: number) {
    const plans = await prisma.studyPlan.findMany({
      include: {
        planProblems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
              },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
        userProgress: userId ? {
          where: { userId },
          take: 1,
        } : false,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Add user progress info
    return plans.map(plan => ({
      ...plan,
      userProgress: plan.userProgress?.[0] || null,
      progress: plan.userProgress?.[0] 
        ? {
            currentDay: plan.userProgress[0].currentDay,
            completedDays: plan.userProgress[0].completedDays,
            completedCount: plan.userProgress[0].completedDays.length,
            isCompleted: !!plan.userProgress[0].completedAt,
          }
        : null,
    }));
  }

  // Get plan by slug
  async getPlanBySlug(slug: string, userId?: number) {
    const plan = await prisma.studyPlan.findUnique({
      where: { slug },
      include: {
        planProblems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                difficulty: true,
                tags: true,
                testCases: true,
              },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
        userProgress: userId ? {
          where: { userId },
          take: 1,
        } : false,
      },
    });

    if (!plan) return null;

    return {
      ...plan,
      userProgress: plan.userProgress?.[0] || null,
      progress: plan.userProgress?.[0]
        ? {
            currentDay: plan.userProgress[0].currentDay,
            completedDays: plan.userProgress[0].completedDays,
            completedCount: plan.userProgress[0].completedDays.length,
            isCompleted: !!plan.userProgress[0].completedAt,
          }
        : null,
    };
  }

  // Start a plan for a user
  async startPlan(userId: number, planId: string) {
    const existing = await prisma.userStudyPlanProgress.findUnique({
      where: {
        userId_planId: {
          userId,
          planId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return await prisma.userStudyPlanProgress.create({
      data: {
        userId,
        planId,
        currentDay: 1,
        completedDays: [], // ✅ FIX: Start with empty array instead of [1]
      },
    });
  }

  // Mark a day as completed
  async completeDay(userId: number, planId: string, dayNumber: number) {
    const progress = await prisma.userStudyPlanProgress.findUnique({
      where: {
        userId_planId: {
          userId,
          planId,
        },
      },
    });

    if (!progress) {
      throw new Error('Plan not started');
    }

    // ✅ FIX: Only add if not already completed
    const completedDays = progress.completedDays.includes(dayNumber)
      ? progress.completedDays
      : [...progress.completedDays, dayNumber];
      
    const isPlanCompleted = completedDays.length === (await this.getPlanDayCount(planId));

    return await prisma.userStudyPlanProgress.update({
      where: {
        userId_planId: {
          userId,
          planId,
        },
      },
      data: {
        completedDays,
        currentDay: dayNumber + 1,
        completedAt: isPlanCompleted ? new Date() : null,
        lastActivityAt: new Date(),
      },
    });
  }

  // Unenroll a user from a plan
  async unenrollPlan(userId: number, planId: string) {
    try {
      return await prisma.userStudyPlanProgress.delete({
        where: {
          userId_planId: {
            userId,
            planId,
          },
        },
      });
    } catch (err: any) {
      return null;
    }
  }

  // Get plan's total days
  async getPlanDayCount(planId: string): Promise<number> {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      select: { durationDays: true },
    });
    return plan?.durationDays || 0;
  }

  // Add problem to plan (seed/admin)
  async addProblemToPlan(data: AddProblemToPlanData) {
    return await prisma.studyPlanProblem.create({
      data: {
        planId: data.planId,
        problemId: data.problemId,
        dayNumber: data.dayNumber,
        orderIndex: data.orderIndex || data.dayNumber,
        notes: data.notes,
      },
    });
  }

  // Seed predefined plans
  async seedPredefinedPlans() {
    const plans = [
      {
        title: "30-Day Placement Sprint",
        slug: "placement-sprint-30",
        description: "A daily curriculum built to take you from zero to campus-placement ready in a month. Breadth over depth — you'll touch every pattern interviewers actually ask.",
        difficulty: "beginner",
        durationDays: 30,
        problemCount: 59,
        isPro: false,
        icon: "🚀",
        color: "#6366f1",
      },
      {
        title: "FAANG Prep Intensive",
        slug: "faang-prep-45",
        description: "45 days of medium + hard problems laser-focused on the patterns FAANG loops actually test. Each week hits one core pattern end-to-end.",
        difficulty: "advanced",
        durationDays: 45,
        problemCount: 76,
        isPro: true,
        icon: "⚡",
        color: "#f59e0b",
      },
      {
        title: "Arrays & Strings Mastery",
        slug: "arrays-mastery-14",
        description: "14-day deep dive into the single topic that shows up in ~60% of interviews. By day 14 you'll pattern-match arrays and strings on sight.",
        difficulty: "intermediate",
        durationDays: 14,
        problemCount: 37,
        isPro: true,
        icon: "🎯",
        color: "#10b981",
      },
      {
        title: "Weekly Challenge",
        slug: "weekly-challenge",
        description: "One carefully chosen problem per day for 7 days — a mix of difficulties and topics. Designed to fit around a day job. Perfect when you only have 20 minutes a day.",
        difficulty: "mixed",
        durationDays: 7,
        problemCount: 7,
        isPro: true,
        icon: "🏆",
        color: "#ef4444",
      },
    ];

    for (const plan of plans) {
      await prisma.studyPlan.upsert({
        where: { slug: plan.slug },
        update: {},
        create: plan,
      });
    }

    console.log("✅ Study plans seeded");
  }
}

export default new StudyPlanModel();