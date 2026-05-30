import interviewModel from './interviewModel.js';
import prisma from '../../config/database.js';
// Helper to safely get string from params
const getParamString = (param) => {
    if (!param)
        return '';
    return Array.isArray(param) ? param[0] : param;
};
// Helper to check if user is Pro
const isProUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });
    return user?.role === 'pro';
};
// Helper to select random problems based on difficulty
const selectRandomProblems = async (difficulty, count = 3) => {
    let whereClause = {};
    if (difficulty === 'easy')
        whereClause = { difficulty: 'easy' };
    else if (difficulty === 'medium')
        whereClause = { difficulty: 'medium' };
    else if (difficulty === 'hard')
        whereClause = { difficulty: 'hard' };
    else if (difficulty === 'mixed')
        whereClause = {};
    else if (difficulty === 'random') {
        const difficulties = ['easy', 'medium', 'hard'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        whereClause = { difficulty: randomDifficulty };
    }
    const problems = await prisma.problem.findMany({
        where: whereClause,
        take: count * 2,
    });
    const shuffled = problems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(p => p.id);
};
// POST /api/interviews/start - Start a new mock interview (PRO ONLY)
export const startInterview = async (req, res) => {
    try {
        const { difficulty = 'mixed' } = req.body;
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Mock interviews are a Pro feature. Please upgrade to Pro to access this feature.',
                upgradeRequired: true,
                upgradeUrl: '/api/subscriptions/upgrade',
                message: '🔒 This feature is only available for Pro members. Upgrade now to unlock unlimited mock interviews!',
                features: [
                    '45-minute timed sessions',
                    'Random problem selection (Easy/Medium/Hard/Mixed)',
                    'Detailed performance analytics',
                    'Weak topic identification',
                    'Readiness score',
                    'Personalized study plan',
                    'Leaderboard access'
                ]
            });
        }
        // Select random problems
        const problemIds = await selectRandomProblems(difficulty, 3);
        if (problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No problems found for selected difficulty',
            });
        }
        // Create interview
        const interview = await interviewModel.startInterview({
            userId,
            difficulty,
            isPro: true,
        });
        // Add problems to interview
        await interviewModel.addProblems(interview.id, problemIds);
        const fullInterview = await interviewModel.getInterview(interview.id);
        if (!fullInterview) {
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve interview details',
            });
        }
        return res.status(201).json({
            success: true,
            data: {
                id: fullInterview.id,
                startedAt: fullInterview.startedAt,
                difficulty: fullInterview.difficulty,
                isPro: true,
                problems: fullInterview.problems.map(p => ({
                    id: p.problem.id,
                    title: p.problem.title,
                    difficulty: p.problem.difficulty,
                    orderIndex: p.orderIndex,
                })),
                duration: 45,
                message: 'You have 45 minutes to complete all problems. Good luck!'
            },
            message: 'Mock interview started. You have 45 minutes.',
        });
    }
    catch (error) {
        console.error('Error starting interview:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/interviews/:id - Get interview details (PRO ONLY)
export const getInterviewDetails = async (req, res) => {
    try {
        const id = getParamString(req.params.id);
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Mock interviews are a Pro feature.',
                upgradeRequired: true
            });
        }
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Interview ID is required',
            });
        }
        const interview = await interviewModel.getInterview(id);
        if (!interview) {
            return res.status(404).json({
                success: false,
                error: 'Interview not found',
            });
        }
        if (interview.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized',
            });
        }
        return res.json({
            success: true,
            data: interview,
        });
    }
    catch (error) {
        console.error('Error fetching interview:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// POST /api/interviews/:id/submit - Submit solution for a problem (PRO ONLY)
export const submitProblemSolution = async (req, res) => {
    try {
        const id = getParamString(req.params.id);
        const { problemId, code, passed, runtimeMs, memoryKb } = req.body;
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Mock interviews are a Pro feature.',
                upgradeRequired: true
            });
        }
        if (!id || !problemId || !code) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }
        const interview = await interviewModel.getInterview(id);
        if (!interview) {
            return res.status(404).json({
                success: false,
                error: 'Interview not found',
            });
        }
        if (interview.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized',
            });
        }
        if (interview.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                error: `Interview is already ${interview.status}`,
            });
        }
        const result = await interviewModel.submitResult({
            interviewId: id,
            problemId,
            code,
            passed: passed || false,
            runtimeMs: runtimeMs || 0,
            memoryKb: memoryKb || 0,
        });
        // Calculate remaining time if needed
        const elapsedMinutes = (Date.now() - new Date(interview.startedAt).getTime()) / 60000;
        const remainingMinutes = Math.max(0, 45 - Math.floor(elapsedMinutes));
        return res.json({
            success: true,
            data: result,
            remainingMinutes,
            message: passed ? '✅ Correct solution! Great job!' : '❌ Wrong answer. Keep practicing!',
        });
    }
    catch (error) {
        console.error('Error submitting solution:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// POST /api/interviews/:id/complete - Complete interview and get results (PRO ONLY)
export const completeInterview = async (req, res) => {
    try {
        const id = getParamString(req.params.id);
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Mock interviews are a Pro feature.',
                upgradeRequired: true
            });
        }
        const interview = await interviewModel.getInterview(id);
        if (!interview) {
            return res.status(404).json({
                success: false,
                error: 'Interview not found',
            });
        }
        if (interview.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized',
            });
        }
        if (interview.status !== 'in_progress') {
            return res.status(400).json({
                success: false,
                error: `Interview is already ${interview.status}`,
            });
        }
        const completed = await interviewModel.completeInterview(id);
        // Prepare results breakdown
        const results = (interview.results || []).map(r => ({
            problemId: r.problemId,
            problemTitle: r.problem.title,
            problemDifficulty: r.problem.difficulty || 'unknown',
            passed: r.passed,
            score: r.score,
            runtimeMs: r.runtimeMs,
            memoryKb: r.memoryKb,
            submittedAt: r.submittedAt,
        }));
        // Calculate performance metrics
        const totalProblems = results.length;
        const solvedProblems = results.filter(r => r.passed).length;
        const averageRuntime = results.reduce((sum, r) => sum + (r.runtimeMs || 0), 0) / totalProblems;
        // Readiness score formula
        const problemScore = (solvedProblems / totalProblems) * 70;
        const performanceScore = Math.max(0, 30 - (averageRuntime / 1000));
        const readinessScore = Math.min(100, Math.round(problemScore + performanceScore));
        // Calculate time taken
        const timeTakenMinutes = Math.round((new Date(completed.completedAt || new Date()).getTime() - new Date(interview.startedAt).getTime()) / 60000);
        const timeBonus = Math.max(0, 45 - timeTakenMinutes);
        const finalScoreWithTimeBonus = Math.min(100, (completed.totalScore || 0) + Math.floor(timeBonus / 2));
        // Get weak topics analysis
        const difficultyWeakness = {};
        const topicWeakness = {};
        results.forEach(result => {
            if (!result.passed) {
                const difficulty = result.problemDifficulty || 'unknown';
                difficultyWeakness[difficulty] = (difficultyWeakness[difficulty] || 0) + 1;
            }
        });
        const weakTopics = Object.entries(difficultyWeakness)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic]) => `${topic} problems`);
        // Pro detailed analysis (always true since only pro users can access)
        const detailedAnalysis = {
            scoreBreakdown: {
                problemsSolved: `${solvedProblems}/${totalProblems}`,
                averageRuntime: `${Math.round(averageRuntime)}ms`,
                timeBonus: timeBonus,
                finalScore: finalScoreWithTimeBonus
            },
            weakTopics: {
                byDifficulty: difficultyWeakness,
                suggestions: weakTopics.map(topic => ({
                    topic: topic,
                    suggestion: `Practice more ${topic} to improve your score.`,
                    recommendedProblems: 5
                }))
            },
            performance: {
                readinessScore: readinessScore,
                percentile: Math.min(99, Math.floor(readinessScore * 0.8)),
                comparisonMessage: readinessScore >= 80 ? "Excellent! You're in the top 20% of candidates!" :
                    readinessScore >= 60 ? "Good job! Keep practicing to reach expert level." :
                        "Keep practicing! Focus on weak topics to improve."
            },
            improvementPlan: {
                focusAreas: weakTopics,
                estimatedTimeToMaster: weakTopics.length * 2,
                recommendedNextSteps: [
                    "Review the problems you got wrong",
                    "Practice similar difficulty problems",
                    "Take another mock interview in 2-3 days"
                ]
            }
        };
        return res.json({
            success: true,
            data: {
                id: completed.id,
                totalScore: finalScoreWithTimeBonus,
                readinessScore: readinessScore,
                weakTopics: weakTopics,
                problemsSolved: solvedProblems,
                totalProblems: totalProblems,
                timeTakenMinutes: timeTakenMinutes,
                timeRemaining: Math.max(0, 45 - timeTakenMinutes),
                results,
                isPro: true,
                detailedAnalysis,
                message: '✅ Mock interview completed! Check your detailed analysis below.',
                shareableResults: {
                    score: finalScoreWithTimeBonus,
                    solved: solvedProblems,
                    total: totalProblems,
                    readiness: readinessScore
                }
            },
        });
    }
    catch (error) {
        console.error('Error completing interview:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/interviews/status/:id - Get interview status (PRO ONLY)
export const getInterviewStatus = async (req, res) => {
    try {
        const id = getParamString(req.params.id);
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Mock interviews are a Pro feature.',
                upgradeRequired: true
            });
        }
        const status = await interviewModel.getInterviewStatus(id);
        if (!status) {
            return res.status(404).json({
                success: false,
                error: 'Interview not found',
            });
        }
        // Calculate remaining time
        const elapsedMinutes = (Date.now() - new Date(status.startedAt).getTime()) / 60000;
        const remainingMinutes = Math.max(0, 45 - Math.floor(elapsedMinutes));
        const isExpired = remainingMinutes <= 0;
        return res.json({
            success: true,
            data: {
                ...status,
                remainingMinutes,
                isExpired,
                warning: remainingMinutes <= 5 ? '⚠️ Less than 5 minutes remaining!' : null
            },
        });
    }
    catch (error) {
        console.error('Error fetching interview status:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/interviews/history - Get user's interview history (PRO ONLY)
export const getInterviewHistory = async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Interview history is a Pro feature.',
                upgradeRequired: true
            });
        }
        const { limit = 20 } = req.query;
        // Fetch interviews directly with Prisma to ensure data is included
        const interviews = await prisma.mockInterview.findMany({
            where: { userId },
            orderBy: { startedAt: 'desc' },
            take: parseInt(limit),
            include: {
                results: {
                    include: {
                        problem: {
                            select: {
                                id: true,
                                title: true,
                                difficulty: true,
                                tags: true
                            }
                        }
                    },
                    orderBy: { submittedAt: 'desc' }
                }
            }
        });
        // Calculate stats
        const completedInterviews = interviews.filter(i => i.status === 'completed');
        const totalScoreSum = completedInterviews.reduce((sum, i) => sum + (i.totalScore || 0), 0);
        const avgScore = completedInterviews.length > 0
            ? Math.round(totalScoreSum / completedInterviews.length)
            : 0;
        const bestScore = completedInterviews.length > 0
            ? Math.max(...completedInterviews.map(i => i.totalScore || 0))
            : 0;
        // Format the response
        const formattedInterviews = interviews.map(interview => ({
            id: interview.id,
            status: interview.status,
            difficulty: interview.difficulty,
            totalScore: interview.totalScore || 0,
            startedAt: interview.startedAt,
            completedAt: interview.completedAt,
            problemsSolved: interview.results.filter(r => r.passed).length,
            totalProblems: interview.results.length,
            results: interview.results.map(r => ({
                problemId: r.problemId,
                problemTitle: r.problem.title,
                problemDifficulty: r.problem.difficulty,
                passed: r.passed,
                score: r.score,
                runtimeMs: r.runtimeMs,
                memoryKb: r.memoryKb,
                submittedAt: r.submittedAt
            }))
        }));
        return res.json({
            success: true,
            data: {
                interviews: formattedInterviews,
                stats: {
                    totalInterviews: interviews.length,
                    completedInterviews: completedInterviews.length,
                    averageScore: avgScore,
                    bestScore: bestScore
                }
            },
        });
    }
    catch (error) {
        console.error('Error fetching interview history:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/interviews/leaderboard - Get leaderboard (Pro feature)
export const getLeaderboard = async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        // 🔒 PRO ONLY CHECK
        const isPro = await isProUser(userId);
        if (!isPro) {
            return res.status(403).json({
                success: false,
                error: 'Leaderboard is a Pro feature.',
                upgradeRequired: true
            });
        }
        const { limit = 50 } = req.query;
        // Get leaderboard data using raw query for best scores
        const leaderboardData = await prisma.$queryRaw `
      SELECT 
        u.id as "userId",
        u.name as "userName",
        u.avatar_url as "avatarUrl",
        MAX(m.total_score) as "bestScore",
        COUNT(*) as "interviewsTaken",
        ROUND(AVG(m.total_score)) as "averageScore"
      FROM mock_interviews m
      JOIN users u ON m.user_id = u.id
      WHERE m.status = 'completed' AND m.total_score IS NOT NULL
      GROUP BY u.id, u.name, u.avatar_url
      ORDER BY "bestScore" DESC
      LIMIT ${parseInt(limit)}
    `;
        // Find current user's rank
        const currentUserEntry = leaderboardData.find((entry) => entry.userId === userId);
        const currentUserRank = currentUserEntry
            ? leaderboardData.findIndex((entry) => entry.userId === userId) + 1
            : null;
        const leaderboardWithRanks = leaderboardData.map((entry, index) => ({
            rank: index + 1,
            user: {
                id: entry.userId,
                name: entry.userName,
                avatarUrl: entry.avatarUrl
            },
            bestScore: entry.bestScore,
            interviewsTaken: Number(entry.interviewsTaken), // Convert BigInt to Number
            averageScore: entry.averageScore,
            isCurrentUser: entry.userId === userId
        }));
        return res.json({
            success: true,
            data: {
                leaderboard: leaderboardWithRanks,
                currentUserRank,
                totalParticipants: leaderboardData.length
            },
        });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
