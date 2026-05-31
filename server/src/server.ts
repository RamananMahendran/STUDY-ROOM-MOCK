import app from './app.js';
import prisma from './config/database.js';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { setupSocketServer } from './socket/socketServer.js';
import { initializeSocketServer } from './socket/index.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    console.log('🔌 Attaching connection hooks to PostgreSQL instance...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL Database connected successfully via Prisma Client');

    const httpServer = createServer(app);
    
    setupSocketServer(httpServer);
    initializeSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🚀 StudyRoom server running on port ${PORT}`);
      console.log(`📚 REST API: /api/auth, /api/problems, /api/code, /api/submissions, /api/pair, /api/interviews, /api/rooms`);
      console.log(`🔌 Socket.io: Pair coding + Real-time engine initialized`);
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