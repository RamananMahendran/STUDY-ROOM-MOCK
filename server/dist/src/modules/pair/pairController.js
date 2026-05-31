import pairModel from './pairModel.js';
import prisma from '../../config/database.js';
// Helper to safely get string from params
const getParamString = (param) => {
    if (!param)
        return '';
    return Array.isArray(param) ? param[0] : param;
};
// Generate a readable 6-character room code
const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};
// Helper to create submission from pair session
const submitCodeFromPair = async (sessionId, roomCode, userId, code, language, problemId) => {
    // Get the submission endpoint URL
    const submissionUrl = `http://localhost:${process.env.PORT || 5000}/api/submissions`;
    const response = await fetch(submissionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            problemId,
            code,
            language,
            submittedFrom: 'pair',
            pairSessionId: sessionId,
        }),
    });
    return await response.json();
};
// POST /api/pair/create - Create a new pair session
export const createSession = async (req, res) => {
    try {
        let { problemId, language } = req.body;
        const hostId = req.user?.id || 1;
        // If no problemId provided, try to fetch the first available problem
        // If no problems exist, allow creation without a problemId (for demo/testing)
        if (!problemId) {
            try {
                const firstProblem = await prisma.problem.findFirst({
                    select: { id: true },
                });
                if (firstProblem) {
                    problemId = firstProblem.id;
                }
                // Otherwise leave problemId undefined - the schema will handle it
            }
            catch (err) {
                console.error('Error fetching first problem:', err);
                // Continue without problemId for now
            }
        }
        const roomCode = generateRoomCode();
        // Only pass problemId if it exists
        const sessionData = {
            roomCode,
            hostId,
            language: language || 'python',
        };
        if (problemId) {
            sessionData.problemId = parseInt(problemId);
        }
        const session = await pairModel.createSession(sessionData);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        return res.status(201).json({
            success: true,
            data: {
                roomCode: session.roomCode,
                sessionId: session.id,
                shareableLink: `${clientUrl}/pair/${session.roomCode}`,
                status: session.status,
            },
        });
    }
    catch (error) {
        console.error('Error creating session:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// POST /api/pair/join - Join an existing pair session
export const joinSession = async (req, res) => {
    try {
        const { roomCode } = req.body;
        const guestId = req.user?.id || 2;
        if (!roomCode) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: roomCode',
            });
        }
        const session = await pairModel.findByRoomCode(roomCode);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        if (session.status !== 'waiting') {
            return res.status(400).json({
                success: false,
                error: 'Session is no longer available',
            });
        }
        const updatedSession = await pairModel.joinSession(roomCode, guestId);
        return res.json({
            success: true,
            data: {
                sessionId: updatedSession.id,
                roomCode: updatedSession.roomCode,
                problem: session.problem,
                language: session.language,
                host: session.host,
                guest: session.guest,
                currentCode: session.currentCode,
            },
        });
    }
    catch (error) {
        console.error('Error joining session:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// POST /api/pair/:roomCode/submit - Submit code from within pair session
export const submitPairCode = async (req, res) => {
    try {
        const roomCode = getParamString(req.params.roomCode);
        const { code, language } = req.body;
        const userId = req.user?.id || 1;
        if (!roomCode || !code || !language) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: roomCode, code, language',
            });
        }
        const session = await pairModel.findByRoomCode(roomCode);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        if (session.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: 'Session is not active. Both users must join first.',
            });
        }
        // Submit code with pair context
        const submissionResult = await submitCodeFromPair(session.id, roomCode, userId, code, language, session.problemId);
        if (!submissionResult.success) {
            return res.status(500).json({
                success: false,
                error: submissionResult.error || 'Failed to submit code',
            });
        }
        return res.status(201).json({
            success: true,
            data: {
                submissionId: submissionResult.data.id,
                status: submissionResult.data.status,
                message: 'Code submitted. Waiting for results...',
            },
        });
    }
    catch (error) {
        console.error('Error submitting pair code:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/pair/:roomCode - Get session details
export const getSession = async (req, res) => {
    try {
        const roomCode = getParamString(req.params.roomCode);
        if (!roomCode) {
            return res.status(400).json({
                success: false,
                error: 'Room code is required',
            });
        }
        const session = await pairModel.findByRoomCode(roomCode);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        // Get recent submissions for this pair session
        const recentSubmissions = await prisma.submission.findMany({
            where: {
                pairSessionId: session.id,
                status: { not: 'pending' }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } }
            }
        });
        return res.json({
            success: true,
            data: {
                roomCode: session.roomCode,
                sessionId: session.id,
                problem: session.problem,
                host: session.host,
                guest: session.guest,
                status: session.status,
                language: session.language,
                currentCode: session.currentCode,
                cursors: session.cursors,
                recentSubmissions,
            },
        });
    }
    catch (error) {
        console.error('Error fetching session:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/pair/session/:sessionId - Get session by ID
export const getSessionById = async (req, res) => {
    try {
        const sessionId = getParamString(req.params.sessionId);
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Session ID is required',
            });
        }
        const session = await pairModel.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        // Get submissions for this pair session
        const submissions = await prisma.submission.findMany({
            where: {
                pairSessionId: session.id,
                status: { not: 'pending' }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } }
            }
        });
        return res.json({
            success: true,
            data: {
                ...session,
                submissions,
            },
        });
    }
    catch (error) {
        console.error('Error fetching session:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// POST /api/pair/:roomCode/code - Update code (REST fallback)
export const updateCode = async (req, res) => {
    try {
        const roomCode = getParamString(req.params.roomCode);
        const { code } = req.body;
        if (!roomCode) {
            return res.status(400).json({
                success: false,
                error: 'Room code is required',
            });
        }
        const session = await pairModel.findByRoomCode(roomCode);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        await pairModel.updateCodeByRoomCode(roomCode, code);
        return res.json({
            success: true,
            message: 'Code updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating code:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// DELETE /api/pair/:roomCode/end - End session
export const endSession = async (req, res) => {
    try {
        const roomCode = getParamString(req.params.roomCode);
        if (!roomCode) {
            return res.status(400).json({
                success: false,
                error: 'Room code is required',
            });
        }
        const session = await pairModel.findByRoomCode(roomCode);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        await pairModel.endSession(session.id);
        return res.json({
            success: true,
            message: 'Session ended successfully',
        });
    }
    catch (error) {
        console.error('Error ending session:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/pair/user/sessions - Get user's pair sessions
export const getUserSessions = async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        const sessions = await pairModel.getUserSessions(userId);
        return res.json({
            success: true,
            data: sessions,
        });
    }
    catch (error) {
        console.error('Error fetching user sessions:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// GET /api/pair/:roomCode/submissions - Get all submissions for this pair session
export const getPairSubmissions = async (req, res) => {
    try {
        const roomCode = getParamString(req.params.roomCode);
        if (!roomCode) {
            return res.status(400).json({
                success: false,
                error: 'Room code is required',
            });
        }
        const session = await pairModel.findByRoomCode(roomCode);
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }
        const submissions = await prisma.submission.findMany({
            where: {
                pairSessionId: session.id,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
                problem: { select: { title: true, difficulty: true } }
            }
        });
        return res.json({
            success: true,
            data: submissions,
        });
    }
    catch (error) {
        console.error('Error fetching pair submissions:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
