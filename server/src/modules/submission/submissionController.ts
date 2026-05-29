import { Request, Response } from 'express';
import submissionModel from './submissionModel.js';
import { runJudge0Submission } from '../codeExecution/codeExecutionService.js';
import prisma from '../../config/database.js';

// Helper to get problem by ID
const getProblemById = async (id: number) => {
  return await prisma.problem.findUnique({
    where: { id },
  });
};

// Helper to normalize output for comparison
const normalizeOutput = (output: string, expected: any): any => {
  // If expected is an object/array, try to parse the output as JSON
  if (typeof expected === 'object') {
    try {
      return JSON.parse(output);
    } catch (e) {
      // If parsing fails, return the original string
      return output;
    }
  }
  
  // For primitive values, try to convert to number if applicable
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

    // IMPORTANT: Don't send expectedOutput - let Judge0 always return status 3
    const result = await runJudge0Submission({
      sourceCode,
      languageId,
      stdin: input,
      // expectedOutput is REMOVED - we compare ourselves
    });

    const isAccepted = result.status?.id === 3;
    const output = result.stdout?.trim() || '';
    
    // Normalize both sides for comparison
    const normalizedOutput = normalizeOutput(output, expected);
    const normalizedExpected = expected;
    
    // Pass if output matches expected (Judge0 always returns status 3 for valid code)
    const passed = deepEqual(normalizedOutput, normalizedExpected);
    
    // Debug logging (remove in production)
    console.log(`Test ${i + 1}:`);
    console.log(`  Input: ${input}`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Got: ${output}`);
    console.log(`  Normalized Got: ${JSON.stringify(normalizedOutput)}`);
    console.log(`  Passed: ${passed}`);
    console.log(`  Judge0 Status: ${result.status?.id} - ${result.status?.description}`);
    
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

// Background processing function
const processSubmissionInBackground = async (
  submissionId: string,
  code: string,
  languageId: number,
  testCases: any[]
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
    });
  } catch (error: any) {
    console.error(`Error processing submission ${submissionId}:`, error);
    await submissionModel.updateStatus(submissionId, 'error', {});
  }
};

// POST /api/submissions - Submit code for a problem
export const submitProblem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { problemId, code, language } = req.body;
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
    });

    // Process in background
    processSubmissionInBackground(
      submission.id, 
      code, 
      languageId, 
      testCases
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
    // Extract id and ensure it's a string
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
        createdAt: submission.createdAt,
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