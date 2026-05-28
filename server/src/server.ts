import app from './app.js';
import prisma from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Verify connection to the PostgreSQL container by executing a low-overhead native query
    console.log(' Attaching connection hooks to PostgreSQL instance...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL Database connected successfully via Prisma Client');

    // 2. Fire up the Express web server engine listener
    const server = app.listen(PORT, () => {
      console.log(` StudyRoom core server running actively on port ${PORT}`);
    });

    // 3. Graceful shutdown handler (Stops active processes securely if Docker issues a stop)
    process.on('SIGTERM', () => {
      console.log(' SIGTERM received. Initiating safe cluster winding sequence...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log(' Cleanly decoupled Prisma pools. Server process exited safely.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error(' Critical database initialization layer link failure:');
    console.error(error);
    process.exit(1);
  }
}

bootstrap();