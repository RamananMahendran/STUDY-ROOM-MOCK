import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/authRoutes.js';       //  Import migrated Auth module
import problemRoutes from './modules/practice/problemRoutes.js';
import codeExecutionRoutes from './modules/codeExecution/codeExecutionRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ⚡ Mount integrated features
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/code', codeExecutionRoutes);

// Fallback middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
