import { Request, Response } from 'express';
import { getJudge0Languages, runJudge0Submission } from './codeExecutionService.js';

export const getLanguages = async (req: Request, res: Response): Promise<any> => {
  try {
    const languages = await getJudge0Languages();
    return res.json({ success: true, data: languages });
  } catch (error: any) {
    return res.status(502).json({ success: false, error: error.message });
  }
};

export const runCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { sourceCode, languageId, stdin, expectedOutput } = req.body;

    if (!sourceCode || !languageId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sourceCode, languageId',
      });
    }

    const result = await runJudge0Submission({
      sourceCode,
      languageId: Number(languageId),
      stdin,
      expectedOutput,
    });

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(502).json({ success: false, error: error.message });
  }
};
