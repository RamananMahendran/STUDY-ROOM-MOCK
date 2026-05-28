import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Test PostgreSQL Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('PostgreSQL Connected');
  release();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);  // ← ADDED: Problem routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get('/', (req, res) => {
  res.send('Study Room API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   POST   /api/auth/register - Register user`);
  console.log(`   POST   /api/auth/login - Login user`);
  console.log(`   GET    /api/problems - List problems with filters`);
  console.log(`   GET    /api/problems/:id - Get problem details`);
  console.log(`   POST   /api/problems - Create problem (admin)`);
  console.log(`   PUT    /api/problems/:id - Update problem (admin)`);
  console.log(`   DELETE /api/problems/:id - Delete problem (admin)`);
  console.log(`   GET    /health - Health check`);
});