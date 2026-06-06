import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/authRoutes.js';
import problemRoutes from './modules/practice/problemRoutes.js';
import codeExecutionRoutes from './modules/codeExecution/codeExecutionRoutes.js';
import submissionRoutes from './modules/submission/submissionRoutes.js';
import pairRoutes from './modules/pair/pairRoutes.js';
import interviewRoutes from './modules/interview/interviewRoutes.js';
import roomRoutes from './modules/rooms/roomRoutes.js';
import contestRoutes from './modules/contests/contestRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);           // Authentication (Register, Login, Profile)
app.use('/api/problems', problemRoutes);     // Problems CRUD
app.use('/api/code', codeExecutionRoutes);   // Code Execution (Judge0)
app.use('/api/submissions', submissionRoutes); // Submissions (Day 3)
app.use('/api/pair', pairRoutes);            // Pair Coding (Day 4)
app.use('/api/interviews', interviewRoutes);  // Mock Interviews (Day 5) - PRO ONLY
app.use('/api/rooms', roomRoutes);           // Real-time Study Rooms (BE2)
app.use('/api/contests', contestRoutes);      // Competitive Contests (BE3 Day 3 addition)

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;