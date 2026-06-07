import { Request, Response } from 'express';
import submissionModel from './submissionModel.js';
import { runJudge0Submission } from '../codeExecution/codeExecutionService.js';
import prisma from '../../config/database.js';
import { getIO } from '../../socket/index.js';

// Helper to get problem by ID
const getProblemById = async (id: number) => {
  return await prisma.problem.findUnique({
    where: { id },
  });
};

// Helper to normalize output for comparison
const normalizeOutput = (output: string, expected: any): any => {
  if (typeof expected === 'object') {
    try {
      return JSON.parse(output);
    } catch (e) {
      return output;
    }
  }
  
  if (typeof expected === 'number') {
    const num = Number(output);
    return isNaN(num) ? output : num;
  }
  
  if (typeof expected === 'boolean') {
    if (output.toLowerCase() === 'true') return true;
    if (output.toLowerCase() === 'false') return false;
    return output;
  }
  
  return output;
};

// Deep comparison of two values
const deepEqual = (a: any, b: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

// Run code against multiple test cases
const runCodeWithTestCases = async (
  sourceCode: string,
  languageId: number,
  testCases: any[]
) => {
  const results = [];
  let allPassed = true;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const input = typeof testCase.input === 'object' 
      ? JSON.stringify(testCase.input) 
      : String(testCase.input);
    
    const expected = testCase.expected;

    const result = await runJudge0Submission({
      sourceCode,
      languageId,
      stdin: input,
    });

    const output = result.stdout?.trim() || '';
    
    const normalizedOutput = normalizeOutput(output, expected);
    const normalizedExpected = expected;
    const passed = deepEqual(normalizedOutput, normalizedExpected);
    
    console.log(`Test ${i + 1}: Passed: ${passed}`);
    
    results.push({
      test_case_index: i + 1,
      input: testCase.input,
      expected: expected,
      output: output,
      passed: passed,
      error: result.stderr || result.compile_output || null,
      runtime_ms: parseFloat(result.time) * 1000,
      memory_kb: result.memory || 0,
    });

    if (!passed) {
      allPassed = false;
    }
  }

  return { allPassed, results };
};

const updateUserStats = async (userId: number): Promise<void> => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { userId },
    });

    const totalSubmissions = submissions.length;
    if (totalSubmissions === 0) return;

    // Unique attempted problem IDs
    const attemptedProblemIds = new Set(submissions.map(s => s.problemId));
    const problemsAttempted = attemptedProblemIds.size;

    // Unique solved problem IDs (status === 'accepted')
    const solvedSubmissions = submissions.filter(s => s.status === 'accepted');
    const solvedProblemIds = new Set(solvedSubmissions.map(s => s.problemId));
    const problemsSolved = solvedProblemIds.size;

    const acceptedSubmissionsCount = solvedSubmissions.length;
    const acceptanceRate = parseFloat(((acceptedSubmissionsCount / totalSubmissions) * 100).toFixed(2));

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const solvedThisMonthSubmissions = solvedSubmissions.filter(s => {
      const date = new Date(s.createdAt);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });
    const solvedThisMonthProblemIds = new Set(solvedThisMonthSubmissions.map(s => s.problemId));
    const solvedThisMonth = solvedThisMonthProblemIds.size;

    await prisma.user.update({
      where: { id: userId },
      data: {
        problemsSolved,
        problemsAttempted,
        acceptanceRate,
        solvedThisMonth,
        solvedAllTime: problemsSolved,
      }
    });

    console.log(`Updated stats for user ${userId}: solved=${problemsSolved}, attempted=${problemsAttempted}, rate=${acceptanceRate}%`);
  } catch (error) {
    console.error(`Failed to update user stats for ${userId}:`, error);
  }
};

// Background processing function
const processSubmissionInBackground = async (
  submissionId: string,
  code: string,
  languageId: number,
  testCases: any[],
  submittedFrom?: string,
  pairSessionId?: string,
  userId?: number
) => {
  console.log(`🔄 Processing submission ${submissionId}...`);
  
  try {
    const result = await runCodeWithTestCases(code, languageId, testCases);
    
    let status: string;
    let error_message: string | null = null;

    if (result.allPassed) {
      status = 'accepted';
      console.log(`✅ Submission ${submissionId}: ACCEPTED`);
    } else {
      const failingTest = result.results.find(r => !r.passed);
      if (failingTest?.error) {
        const error = failingTest.error;
        if (error.includes('Compilation') || error.includes('compile')) {
          status = 'compile_error';
        } else if (error.includes('Time Limit')) {
          status = 'time_limit_exceeded';
        } else {
          status = 'runtime_error';
        }
        error_message = failingTest.error;
      } else {
        status = 'wrong_answer';
        error_message = `Wrong answer on test case ${failingTest?.test_case_index}`;
      }
      console.log(`❌ Submission ${submissionId}: ${status.toUpperCase()}`);
    }

    const totalRuntime = result.results.reduce((sum, r) => sum + r.runtime_ms, 0);
    const maxMemory = Math.max(...result.results.map(r => r.memory_kb));

    await submissionModel.updateStatus(submissionId, status, {
      runtimeMs: totalRuntime,
      memoryKb: maxMemory,
      errorMessage: error_message || undefined,
      testResults: result.results,
    });

    if (userId) {
      await updateUserStats(userId);
    }

    // EMIT SOCKET.IO EVENT IF FROM PAIR SESSION
    if (submittedFrom === 'pair' && pairSessionId) {
      try {
        const io = getIO();
        if (io) {
          const pairSession = await prisma.pairSession.findUnique({
            where: { id: pairSessionId },
            include: {
              host: { select: { id: true, name: true } },
              guest: { select: { id: true, name: true } }
            }
          });
          
          if (pairSession) {
            const userName = userId === pairSession.hostId 
              ? pairSession.host.name 
              : pairSession.guest?.name || 'User';
            
            io.to(`pair:${pairSession.roomCode}`).emit('submission:result', {
              submission_id: submissionId,
              status: status,
              runtime_ms: totalRuntime,
              memory_kb: maxMemory,
              test_results: result.results,
              submitted_by: userId,
              submitted_by_name: userName,
              submitted_at: new Date().toISOString()
            });
            console.log(`📡 Emitted submission:result to pair:${pairSession.roomCode}`);
          }
        }
      } catch (socketError) {
        console.error('Failed to emit socket event:', socketError);
      }
    }

    // EMIT SOCKET.IO EVENT IF FROM CONTEST
    if (submittedFrom && submittedFrom.startsWith('contest:')) {
      try {
        const contestId = submittedFrom.split(':')[1];
        const io = getIO();
        if (io) {
          const subObj = await prisma.submission.findUnique({
            where: { id: submissionId },
            select: { problemId: true }
          });
          
          if (subObj) {
            io.to(`contest:${contestId}`).emit('contest:submission', {
              submission_id: submissionId,
              userId,
              problemId: subObj.problemId,
              status,
              runtime_ms: totalRuntime,
              memory_kb: maxMemory,
              submitted_at: new Date().toISOString()
            });
            console.log(`📡 Emitted contest:submission to contest:${contestId}`);
          }
        }
      } catch (socketError) {
        console.error('Failed to emit contest socket event:', socketError);
      }
    }
  } catch (error: any) {
    console.error(`Error processing submission ${submissionId}:`, error);
    await submissionModel.updateStatus(submissionId, 'error', {
      errorMessage: error.message || 'Internal processing error',
    });
  }
};

// POST /api/submissions - Submit code for a problem
export const submitProblem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { problemId, code, language, submittedFrom, pairSessionId } = req.body;
    const userId = (req as any).user?.id || 1;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: problemId, code, language'
      });
    }

    const problem = await getProblemById(parseInt(problemId));
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }

    const testCases = problem.testCases as any[];
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Problem has no test cases'
      });
    }

    const languageMap: Record<string, number> = {
      python: 71,
      javascript: 63,
      java: 62,
      cpp: 54,
    };
    const languageId = languageMap[language.toLowerCase()] || 71;

    const submission = await submissionModel.create({
      userId,
      problemId: parseInt(problemId),
      code,
      language,
      submittedFrom: submittedFrom || 'solo',
      pairSessionId: pairSessionId || null,
    });

    // Process in background with pair session info
    processSubmissionInBackground(
      submission.id, 
      code, 
      languageId, 
      testCases,
      submittedFrom,
      pairSessionId,
      userId
    );

    return res.status(201).json({
      success: true,
      data: {
        id: submission.id,
        status: submission.status,
        createdAt: submission.createdAt,
      },
      message: 'Code submitted successfully. Poll /api/submissions/:id for results',
    });
  } catch (error: any) {
    console.error('Error submitting code:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/submissions/:id - Poll submission result
export const getSubmissionResult = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const submissionId = Array.isArray(id) ? id[0] : id;
    
    if (!submissionId) {
      return res.status(400).json({
        success: false,
        error: 'Submission ID is required'
      });
    }
    
    const submission = await submissionModel.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    return res.json({
      success: true,
      data: {
        id: submission.id,
        userId: submission.userId,
        problemId: submission.problemId,
        problemTitle: submission.problem?.title,
        language: submission.language,
        code: submission.code,
        status: submission.status,
        runtimeMs: submission.runtimeMs,
        memoryKb: submission.memoryKb,
        error_message: (submission as any).errorMessage,
        test_results: (submission as any).testResults,
        createdAt: submission.createdAt,
        submittedFrom: (submission as any).submittedFrom,
        pairSessionId: (submission as any).pairSessionId,
      },
    });
  } catch (error: any) {
    console.error('Error fetching submission:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/submissions/user/history - Get user's submission history
export const getUserSubmissions = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || 1;
    const { problemId, limit = 50 } = req.query;
    
    const submissions = await submissionModel.getUserSubmissions(
      userId,
      problemId ? parseInt(problemId as string) : undefined,
      parseInt(limit as string)
    );
    
    return res.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 👇 NEW: GET /api/submissions/user/stats - Get user's submission statistics
export const getUserStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || 1;
    const { userId: queryUserId } = req.query;
    
    const targetUserId = queryUserId ? parseInt(queryUserId as string) : userId;
    
    const stats = await submissionModel.getUserStats(targetUserId);
    
    return res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 👇 NEW: GET /api/submissions/user/submissions - Get paginated submissions
export const getUserSubmissionsPaginated = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || 1;
    const { userId: queryUserId, page = 1, limit = 20 } = req.query;
    
    const targetUserId = queryUserId ? parseInt(queryUserId as string) : userId;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    const result = await submissionModel.getUserSubmissionsPaginated(targetUserId, pageNum, limitNum);
    
    return res.json({
      success: true,
      data: result.submissions,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/submissions/pair/latest - Get latest submission for pair session
export const getLatestPairSubmission = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pairSessionId } = req.query;
    
    if (!pairSessionId) {
      return res.status(400).json({
        success: false,
        error: 'pairSessionId is required'
      });
    }
    
    const submission = await submissionModel.getLatestPairSubmission(pairSessionId as string);
    
    return res.json({
      success: true,
      data: submission,
    });
  } catch (error: any) {
    console.error('Error fetching latest pair submission:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/submissions/pair/:pairSessionId - Get all submissions for pair session
export const getPairSessionSubmissions = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pairSessionId } = req.params;
    const { limit = 50 } = req.query;
    
    const submissions = await submissionModel.getPairSessionSubmissions(
      pairSessionId as string,
      parseInt(limit as string)
    );
    
    return res.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    console.error('Error fetching pair session submissions:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};