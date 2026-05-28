import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// Standard Production Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Health Check Endpoint (Used to audit container life cycles)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Note for Team: Mount your specific feature modules below
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/rooms', roomRoutes);

export default app;