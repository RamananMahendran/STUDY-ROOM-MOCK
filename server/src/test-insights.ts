import prisma from './config/database.js';
import User from './modules/auth/User.js';
import submissionModel from './modules/submission/submissionModel.js';

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

async function testInsights() {
  console.log('Starting Insights and Study Sessions diagnostics...');
  
  // 1. Create a test user
  const email = `test_insights_${Date.now()}@test.com`;
  const user = await prisma.user.create({
    data: {
      name: 'Tester Insights',
      email,
      password: 'testpassword',
      streakCount: 2,
    }
  });
  console.log(`Created test user: ${user.id}`);

  try {
    // 2. Record a study session
    console.log('Recording study session...');
    await User.recordStudySession(user.id, 25 * 60 * 1000, 'Test Room', 'test-room-id');

    // 3. Verify session was created in DB
    const sessions = await prisma.studySession.findMany({
      where: { userId: user.id }
    });
    assert(sessions.length === 1, 'StudySession was not logged in DB');
    assert(sessions[0].roomName === 'Test Room', 'StudySession roomName mismatch');
    assert(sessions[0].durationMinutes === 25, 'StudySession durationMinutes mismatch');
    console.log('PASS: Study session recorded successfully and verified.');

    // 4. Create a test problem
    const problem = await prisma.problem.create({
      data: {
        title: `Test Problem ${Date.now()}`,
        slug: `test-problem-${Date.now()}`,
        description: 'Test problem description',
        difficulty: 'easy',
        tags: ['test'],
        testCases: []
      }
    });

    // 5. Submit code (Accepted)
    console.log('Creating accepted submission...');
    const acceptedSub = await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        code: 'def test(): pass',
        language: 'python',
        status: 'accepted',
      }
    });

    const stats = await submissionModel.getUserStats(user.id);
    assert(stats.problemsSolved === 1, 'problemsSolved stats mismatch');
    assert(stats.totalSubmissions === 1, 'totalSubmissions stats mismatch');
    console.log('PASS: Submission stats calculations verified.');

    // Clean up problem
    await prisma.problem.delete({ where: { id: problem.id } });

  } finally {
    // Clean up
    await prisma.studySession.deleteMany({ where: { userId: user.id } });
    await prisma.submission.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Cleanup completed.');
  }
}

testInsights()
  .then(() => console.log('ALL INSIGHTS TESTS PASSED.'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
