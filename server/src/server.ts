import app from './app.js';
import prisma from './config/database.js';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocketServer } from './socket/index.js';  // Only use this one

dotenv.config();

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  try {
    console.log('🔌 Attaching connection hooks to PostgreSQL instance...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL Database connected successfully via Prisma Client');

    const httpServer = createServer(app);
    
    // Only initialize Socket.io once
    initializeSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🚀 StudyRoom core server running actively on port ${PORT}`);
      console.log(`📚 Available endpoints:`);
      console.log(`   Auth: POST /api/auth/register, POST /api/auth/login`);
      console.log(`   Problems: GET /api/problems, GET /api/problems/:id`);
      console.log(`   Code Execution: POST /api/code/run, GET /api/code/languages`);
      console.log(`   Submissions: POST /api/submissions, GET /api/submissions/:id`);
      console.log(`   Pair Coding: POST /api/pair/create, POST /api/pair/join`);
      console.log(`   Mock Interviews: POST /api/interviews/start (Pro only)`);
      console.log(`   Rooms: /api/rooms endpoints`);
      console.log(`🔌 Socket.io: Real-time engine initialized`);
    });

    process.on('SIGTERM', () => {
      console.log('⚠️ SIGTERM received. Shutting down gracefully...');
      httpServer.close(async () => {
        await prisma.$disconnect();
        console.log('🧹 Server shutdown complete.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Critical database initialization layer link failure:');
    console.error(error);
    process.exit(1);
  }
}

bootstrap();