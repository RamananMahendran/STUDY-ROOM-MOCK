import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const room = await prisma.studyRoom.findUnique({ where: { id: '8D4R00' } });
  console.log(room);
}
main().catch(console.error).finally(() => prisma.$disconnect());
