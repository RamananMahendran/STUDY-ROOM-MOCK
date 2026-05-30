import app from './app.js';
import prisma from './config/database.js';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { setupSocketServer } from './socket/socketServer.js';
dotenv.config();
const PORT = process.env.PORT || 5000;
async function bootstrap() {
    try {
        // 1. Verify connection to the PostgreSQL container by executing a low-overhead native query
        console.log('🔌 Attaching connection hooks to PostgreSQL instance...');
        await prisma.$queryRaw `SELECT 1`;
        console.log('✅ PostgreSQL Database connected successfully via Prisma Client');
        // 2. Create HTTP server and setup Socket.io
        const httpServer = createServer(app);
        setupSocketServer(httpServer);
        // 3. Fire up the Express web server engine listener with Socket.io
        httpServer.listen(PORT, () => {
            console.log(`🚀 StudyRoom core server running actively on port ${PORT}`);
            console.log(`📚 Available endpoints:`);
            console.log(`   Auth:`);
            console.log(`     POST   /api/auth/register`);
            console.log(`     POST   /api/auth/login`);
            console.log(`   Practice Problems:`);
            console.log(`     GET    /api/problems`);
            console.log(`     GET    /api/problems/:id`);
            console.log(`     POST   /api/problems (admin)`);
            console.log(`   Code Execution:`);
            console.log(`     GET    /api/code/languages`);
            console.log(`     POST   /api/code/run`);
            console.log(`   Submissions (Day 3):`);
            console.log(`     POST   /api/submissions - Submit code for problem`);
            console.log(`     GET    /api/submissions/:id - Poll for results`);
            console.log(`     GET    /api/submissions/user/history - User history`);
            console.log(`   Submission Stats (Day 5):`);
            console.log(`     GET    /api/submissions/user/stats - User statistics`);
            console.log(`     GET    /api/submissions/user/submissions - Paginated history`);
            console.log(`   Pair Coding (Day 4):`);
            console.log(`     POST   /api/pair/create - Create pair session`);
            console.log(`     POST   /api/pair/join - Join pair session`);
            console.log(`     GET    /api/pair/room/:roomCode - Get session details`);
            console.log(`     GET    /api/pair/user/sessions - User sessions`);
            console.log(`     POST   /api/pair/:roomCode/submit - Submit from pair session`);
            console.log(`     GET    /api/pair/:roomCode/submissions - Pair submissions`);
            console.log(`   Mock Interviews (Day 5):`);
            console.log(`     POST   /api/interviews - Schedule interview`);
            console.log(`     GET    /api/interviews/upcoming - Upcoming interviews`);
            console.log(`     GET    /api/interviews/history - Interview history`);
            console.log(`     POST   /api/interviews/:id/complete - Complete interview`);
            console.log(`     POST   /api/interviews/:id/cancel - Cancel interview`);
            console.log(`   Socket.io Events:`);
            console.log(`     join-pair-room - Join a pair coding room`);
            console.log(`     cursor-move - Broadcast cursor position`);
            console.log(`     code-change - Broadcast code changes`);
            console.log(`     submission:result - Broadcast submission result`);
            console.log(`     leave-pair-room - Leave pair coding room`);
        });
        // 4. Graceful shutdown handler (Stops active processes securely if Docker issues a stop)
        process.on('SIGTERM', () => {
            console.log('⚠️ SIGTERM received. Initiating safe cluster winding sequence...');
            httpServer.close(async () => {
                await prisma.$disconnect();
                console.log('🧹 Cleanly decoupled Prisma pools. Server process exited safely.');
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('❌ Critical database initialization layer link failure:');
        console.error(error);
        process.exit(1);
    }
}
bootstrap();
