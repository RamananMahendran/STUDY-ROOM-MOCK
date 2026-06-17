import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database.js';
import User from '../auth/User.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';
import { logAuditEvent } from '../../utils/auditLogger.js';

// ── Dashboard Stats ─────────────────────────────────────────────────────────
export const getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalProblems, totalSubmissions, totalContests, totalRooms, totalStudyPlans,
      signupsThisWeek, submissionsToday, activeToday, recentUsers, recentSubmissions,
      difficultyDist, rolesDist] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.contest.count(),
      prisma.studyRoom.count(),
      prisma.studyPlan.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.submission.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: todayStart } } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.submission.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true } }, problem: { select: { title: true } } } }),
      prisma.problem.groupBy({ by: ['difficulty'], _count: true }),
      prisma.user.groupBy({ by: ['role'], _count: true }),
    ]);

    res.json({
      success: true, data: {
        totalUsers, totalProblems, totalSubmissions, totalContests, totalRooms, totalStudyPlans,
        signupsThisWeek, submissionsToday, activeToday,
        recentUsers, recentSubmissions,
        difficultyDistribution: difficultyDist.map(d => ({ difficulty: d.difficulty, count: d._count })),
        rolesDistribution: rolesDist.map(r => ({ role: r.role, count: r._count })),
      }
    });
  } catch (error) { next(error); }
};

// ── User Management ─────────────────────────────────────────────────────────
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const search = req.query.search ? String(req.query.search) : undefined;
    const role = req.query.role ? String(req.query.role) : undefined;
    const sortBy = String(req.query.sortBy || 'createdAt');
    const order = String(req.query.order || 'desc') as 'asc' | 'desc';

    const where: any = {};
    if (role) where.role = role;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }];

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { [sortBy]: order },
        select: { id: true, name: true, email: true, role: true, streakCount: true, problemsSolved: true, totalStudyHours: true, createdAt: true, avatarUrl: true, lastActiveAt: true }
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

export const getUserDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id }, include: { _count: { select: { submissions: true, ownedRooms: true, studySessions: true } } } });
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, data: { ...user, username: user.name } });
  } catch (error) { next(error); }
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    if (!role) { res.status(400); throw new Error('Role is required'); }
    const updated = await User.setRole(id, role);
    await logAuditEvent(req.user!.id, 'UPDATE_ROLE', 'user', String(id), { newRole: role });
    res.json({ success: true, data: updated, message: `User role updated to ${role}` });
  } catch (error) { next(error); }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (id === req.user!.id) { res.status(400); throw new Error('Cannot delete your own account'); }
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });
    if (!user) { res.status(404); throw new Error('User not found'); }
    await prisma.user.delete({ where: { id } });
    await logAuditEvent(req.user!.id, 'DELETE_USER', 'user', String(id), { name: user.name, email: user.email });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

// ── Problem Management ──────────────────────────────────────────────────────
export const getProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const search = req.query.search ? String(req.query.search) : undefined;
    const difficulty = req.query.difficulty ? String(req.query.difficulty) : undefined;

    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, difficulty: true, tags: true, isPremium: true, acceptanceRate: true, createdAt: true }
      }),
      prisma.problem.count({ where }),
    ]);
    res.json({ success: true, data: problems, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

export const createProblem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, difficulty, tags, testCases, starterCode, hints, constraints, isPremium, leetcodeUrl } = req.body;
    if (!title || !description || !difficulty) { res.status(400); throw new Error('title, description, difficulty required'); }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const problem = await prisma.problem.create({
      data: { title, slug, description, difficulty, tags: tags || [], testCases: testCases || [], starterCode: starterCode || {}, hints: hints || [], constraints: constraints || null, isPremium: isPremium || false, leetcodeUrl: leetcodeUrl || null }
    });
    await logAuditEvent(req.user!.id, 'CREATE_PROBLEM', 'problem', String(problem.id), { title });
    res.status(201).json({ success: true, data: problem });
  } catch (error) { next(error); }
};

export const updateProblem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { title, description, difficulty, tags, testCases, starterCode, hints, constraints, isPremium, leetcodeUrl } = req.body;
    const data: any = {};
    if (title !== undefined) { data.title = title; data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
    if (description !== undefined) data.description = description;
    if (difficulty !== undefined) data.difficulty = difficulty;
    if (tags !== undefined) data.tags = tags;
    if (testCases !== undefined) data.testCases = testCases;
    if (starterCode !== undefined) data.starterCode = starterCode;
    if (hints !== undefined) data.hints = hints;
    if (constraints !== undefined) data.constraints = constraints;
    if (isPremium !== undefined) data.isPremium = isPremium;
    if (leetcodeUrl !== undefined) data.leetcodeUrl = leetcodeUrl;

    const problem = await prisma.problem.update({ where: { id }, data });
    await logAuditEvent(req.user!.id, 'UPDATE_PROBLEM', 'problem', String(id), { title: problem.title });
    res.json({ success: true, data: problem });
  } catch (error) { next(error); }
};

export const deleteProblem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const problem = await prisma.problem.findUnique({ where: { id }, select: { title: true } });
    if (!problem) { res.status(404); throw new Error('Problem not found'); }
    await prisma.problem.delete({ where: { id } });
    await logAuditEvent(req.user!.id, 'DELETE_PROBLEM', 'problem', String(id), { title: problem.title });
    res.json({ success: true, message: 'Problem deleted' });
  } catch (error) { next(error); }
};

// ── Contest Management ──────────────────────────────────────────────────────
export const getContests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contests = await prisma.contest.findMany({ orderBy: { startTime: 'desc' }, include: { _count: { select: { participants: true, problems: true } } } });
    res.json({ success: true, data: contests });
  } catch (error) { next(error); }
};

export const createContest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, startTime, endTime, problems } = req.body;
    if (!title || !description || !startTime || !endTime) { res.status(400); throw new Error('title, description, startTime, endTime required'); }
    const contest = await prisma.contest.create({
      data: { title, description, startTime: new Date(startTime), endTime: new Date(endTime),
        problems: problems?.length ? { create: problems.map((p: any) => ({ problemId: p.problemId, points: p.points || 100 })) } : undefined
      }, include: { problems: true }
    });
    await logAuditEvent(req.user!.id, 'CREATE_CONTEST', 'contest', contest.id, { title });
    res.status(201).json({ success: true, data: contest });
  } catch (error) { next(error); }
};

export const updateContest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, startTime, endTime } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (startTime !== undefined) data.startTime = new Date(startTime);
    if (endTime !== undefined) data.endTime = new Date(endTime);
    const contest = await prisma.contest.update({ where: { id }, data });
    await logAuditEvent(req.user!.id, 'UPDATE_CONTEST', 'contest', id, { title: contest.title });
    res.json({ success: true, data: contest });
  } catch (error) { next(error); }
};

export const deleteContest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const contest = await prisma.contest.findUnique({ where: { id }, select: { title: true } });
    if (!contest) { res.status(404); throw new Error('Contest not found'); }
    await prisma.contest.delete({ where: { id } });
    await logAuditEvent(req.user!.id, 'DELETE_CONTEST', 'contest', id, { title: contest.title });
    res.json({ success: true, message: 'Contest deleted' });
  } catch (error) { next(error); }
};

// ── Room Management ─────────────────────────────────────────────────────────
export const getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rooms = await prisma.studyRoom.findMany({ orderBy: { createdAt: 'desc' }, include: { owner: { select: { name: true } }, _count: { select: { members: true } } } });
    res.json({ success: true, data: rooms });
  } catch (error) { next(error); }
};

export const deleteRoom = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const room = await prisma.studyRoom.findUnique({ where: { id }, select: { name: true } });
    if (!room) { res.status(404); throw new Error('Room not found'); }
    await prisma.studyRoom.delete({ where: { id } });
    await logAuditEvent(req.user!.id, 'DELETE_ROOM', 'room', id, { name: room.name });
    res.json({ success: true, message: 'Room deleted' });
  } catch (error) { next(error); }
};

// ── Submission Viewer ───────────────────────────────────────────────────────
export const getSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const status = req.query.status ? String(req.query.status) : undefined;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true } }, problem: { select: { id: true, title: true, slug: true } } }
      }),
      prisma.submission.count({ where }),
    ]);
    res.json({ success: true, data: submissions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// ── Study Plan Management ───────────────────────────────────────────────────
export const getStudyPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plans = await prisma.studyPlan.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { planProblems: true, userProgress: true } } } });
    res.json({ success: true, data: plans });
  } catch (error) { next(error); }
};

export const createStudyPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, difficulty, durationDays, problemCount, isPro, icon, color } = req.body;
    if (!title || !description || !difficulty || !durationDays) { res.status(400); throw new Error('title, description, difficulty, durationDays required'); }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const plan = await prisma.studyPlan.create({ data: { title, slug, description, difficulty, durationDays, problemCount: problemCount || 0, isPro: isPro || false, icon, color } });
    await logAuditEvent(req.user!.id, 'CREATE_STUDY_PLAN', 'studyPlan', plan.id, { title });
    res.status(201).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

export const updateStudyPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, difficulty, durationDays, problemCount, isPro, icon, color } = req.body;
    const data: any = {};
    if (title !== undefined) { data.title = title; data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
    if (description !== undefined) data.description = description;
    if (difficulty !== undefined) data.difficulty = difficulty;
    if (durationDays !== undefined) data.durationDays = durationDays;
    if (problemCount !== undefined) data.problemCount = problemCount;
    if (isPro !== undefined) data.isPro = isPro;
    if (icon !== undefined) data.icon = icon;
    if (color !== undefined) data.color = color;
    const plan = await prisma.studyPlan.update({ where: { id }, data });
    await logAuditEvent(req.user!.id, 'UPDATE_STUDY_PLAN', 'studyPlan', id, { title: plan.title });
    res.json({ success: true, data: plan });
  } catch (error) { next(error); }
};

export const deleteStudyPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const plan = await prisma.studyPlan.findUnique({ where: { id }, select: { title: true } });
    if (!plan) { res.status(404); throw new Error('Study plan not found'); }
    await prisma.studyPlan.delete({ where: { id } });
    await logAuditEvent(req.user!.id, 'DELETE_STUDY_PLAN', 'studyPlan', id, { title: plan.title });
    res.json({ success: true, message: 'Study plan deleted' });
  } catch (error) { next(error); }
};

// ── Audit Logs ──────────────────────────────────────────────────────────────
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count(),
    ]);
    res.json({ success: true, data: logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};
