import prisma from '../config/database.js';

async function main() {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    console.log('Users:', JSON.stringify(users, null, 2));

    const rooms = await prisma.studyRoom.findMany({ select: { id: true, name: true } });
    console.log('Rooms:', JSON.stringify(rooms, null, 2));

    const msgs = await prisma.chatMessage.findMany({
      take: 20,
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { name: true } } }
    });
    console.log(`Chat messages (${msgs.length} total):`);
    msgs.forEach(m => {
      console.log(`  userId=${m.userId} (${m.user?.name}) : "${m.message}" @ ${m.createdAt.toISOString()}`);
    });
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
