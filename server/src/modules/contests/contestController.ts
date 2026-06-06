import { Request, Response } from 'express';
import prisma from '../../config/database.js';
import { getIO } from '../../socket/index.js';

// GET /api/contests - List contests
export const getContests = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || 1;
    const contests = await prisma.contest.findMany({
      include: {
        participants: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { startTime: 'desc' },
    }) as any[];

    const now = new Date();
    const active = [];
    const upcoming = [];
    const past = [];

    for (const contest of contests) {
      const isRegistered = contest.participants.length > 0;
      const contestData = {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        startTime: contest.startTime,
        endTime: contest.endTime,
        createdAt: contest.createdAt,
        participantCount: contest._count.participants,
        isRegistered,
      };

      if (contest.startTime <= now && contest.endTime >= now) {
        active.push(contestData);
      } else if (contest.startTime > now) {
        upcoming.push(contestData);
      } else {
        past.push(contestData);
      }
    }

    return res.status(200).json({
      success: true,
      data: { active, upcoming, past },
    });
  } catch (error: any) {
    console.error('Error fetching contests:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/contests/:id - Get contest by ID
export const getContest = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user?.id || 1;

    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
              },
            },
          },
        },
        participants: {
          where: { userId },
        },
        _count: {
          select: { participants: true },
        },
      },
    }) as any;

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    const isRegistered = contest.participants.length > 0;
    const now = new Date();
    const isUpcoming = contest.startTime > now;

    // Filter out problems details for upcoming contests to prevent cheating
    const problems = isUpcoming
      ? []
      : contest.problems.map((cp: any) => ({
          id: cp.problemId,
          title: cp.problem.title,
          slug: cp.problem.slug,
          difficulty: cp.problem.difficulty,
          points: cp.points,
        }));

    return res.status(200).json({
      success: true,
      data: {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        startTime: contest.startTime,
        endTime: contest.endTime,
        participantCount: contest._count.participants,
        isRegistered,
        status: isUpcoming ? 'upcoming' : contest.endTime < now ? 'past' : 'active',
        problems,
      },
    });
  } catch (error: any) {
    console.error('Error fetching contest:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/contests/:id/register - Register for a contest
export const registerForContest = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user?.id || 1;

    const contest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    if (contest.endTime < new Date()) {
      return res.status(400).json({ success: false, error: 'Contest has already ended' });
    }

    // Check if already registered
    const existing = await prisma.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId: id,
          userId,
        },
      },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Already registered for this contest',
      });
    }

    // Create participant record
    await prisma.contestParticipant.create({
      data: {
        contestId: id,
        userId,
        totalScore: 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the contest',
    });
  } catch (error: any) {
    console.error('Error registering for contest:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/contests/:id/problems - Get problems for contest
export const getContestProblems = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user?.id || 1;

    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
        participants: {
          where: { userId },
        },
      },
    }) as any;

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    const now = new Date();
    if (contest.startTime > now) {
      return res.status(403).json({ success: false, error: 'Contest has not started yet' });
    }

    const isPast = contest.endTime < now;
    const isRegistered = contest.participants.length > 0;

    if (!isPast && !isRegistered) {
      return res.status(403).json({ success: false, error: 'You are not registered for this contest' });
    }

    // Fetch user submissions for these problems during the contest (to check if they solved them)
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        submittedFrom: `contest:${id}`,
      },
      select: {
        problemId: true,
        status: true,
      },
    });

    const solvedProblemIds = new Set(
      submissions.filter((s) => s.status === 'accepted').map((s) => s.problemId)
    );
    const attemptedProblemIds = new Set(submissions.map((s) => s.problemId));

    const problems = contest.problems.map((cp: any) => {
      let status = 'unsolved';
      if (solvedProblemIds.has(cp.problemId)) {
        status = 'solved';
      } else if (attemptedProblemIds.has(cp.problemId)) {
        status = 'attempted';
      }

      return {
        id: cp.problemId,
        title: cp.problem.title,
        slug: cp.problem.slug,
        difficulty: cp.problem.difficulty,
        points: cp.points,
        status,
      };
    });

    return res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error: any) {
    console.error('Error fetching contest problems:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/contests/:id/leaderboard - Get contest leaderboard
export const getContestLeaderboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        problems: {
          select: { problemId: true, points: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    }) as any;

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    // Fetch all submissions for this contest
    const submissions = await prisma.submission.findMany({
      where: {
        submittedFrom: `contest:${id}`,
        createdAt: {
          lte: contest.endTime, // Only include submissions during the contest
        },
      },
      orderBy: { createdAt: 'asc' }, // Order chronologically to correctly compute penalty
    });

    // Structure problems metadata for scoring
    const contestProblemsMap = new Map(contest.problems.map((p: any) => [p.problemId, p.points]));

    const participantMap = new Map();
    // Initialize all registered participants in the map so they show up even with 0 points
    for (const participant of contest.participants) {
      participantMap.set(participant.userId, {
        userId: participant.userId,
        name: participant.user.name,
        totalScore: 0,
        totalPenalty: 0,
        problems: {}, // problemId -> { solved: boolean, penalty: number, attempts: number, timeSolved: number }
      });

      // Initialize problem map for each participant
      for (const p of contest.problems) {
        participantMap.get(participant.userId).problems[p.problemId] = {
          solved: false,
          penalty: 0,
          attempts: 0,
          timeSolved: null,
        };
      }
    }

    // Process submissions chronologically
    const contestStartMs = contest.startTime.getTime();

    for (const sub of submissions) {
      const { userId, problemId, status, createdAt } = sub;

      // Skip if participant is not registered
      if (!participantMap.has(userId)) continue;

      // Skip if problem is not in the contest
      if (!contestProblemsMap.has(problemId)) continue;

      const pData = participantMap.get(userId).problems[problemId];

      // If already solved, ignore subsequent submissions for scoring
      if (pData.solved) continue;

      if (status === 'accepted') {
        pData.solved = true;
        pData.timeSolved = Math.floor((createdAt.getTime() - contestStartMs) / 60000); // Minutes from start
        const points = contestProblemsMap.get(problemId) || 100;
        
        // ICPC Penalty = minutes from start + 20 mins per wrong attempt before solving
        pData.penalty = pData.timeSolved + pData.attempts * 20;

        // Update overall user totals
        const userSummary = participantMap.get(userId);
        userSummary.totalScore += points;
        userSummary.totalPenalty += pData.penalty;
      } else {
        // Increment attempts count for wrong answers
        if (status !== 'pending') {
          pData.attempts += 1;
        }
      }
    }

    // Convert map to array and sort
    const standings = Array.from(participantMap.values());

    standings.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore; // Higher score first
      }
      return a.totalPenalty - b.totalPenalty; // Lower penalty first
    });

    // Add rank fields
    let rank = 1;
    for (let i = 0; i < standings.length; i++) {
      if (i > 0) {
        const prev = standings[i - 1];
        const curr = standings[i];
        if (curr.totalScore !== prev.totalScore || curr.totalPenalty !== prev.totalPenalty) {
          rank = i + 1;
        }
      }
      standings[i].rank = rank;
    }

    // Update database cached scores if contest is past (optional but good practice)
    if (contest.endTime < new Date()) {
      for (const standing of standings) {
        try {
          await prisma.contestParticipant.update({
            where: {
              contestId_userId: {
                contestId: id,
                userId: standing.userId,
              },
            },
            data: {
              totalScore: standing.totalScore,
            },
          });
        } catch (dbErr) {
          // Ignore unique/concurrency update errors
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: standings,
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
