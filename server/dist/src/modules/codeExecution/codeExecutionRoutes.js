import express from 'express';
import { getLanguages, runCode } from './codeExecutionController.js';
const router = express.Router();
router.get('/languages', getLanguages);
router.post('/run', runCode);
export default router;
