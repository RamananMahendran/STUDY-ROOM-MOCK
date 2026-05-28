// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`
    INSERT INTO problems (title, description, difficulty, tags, test_cases) VALUES 
    ('Two Sum', 'Given an array of integers...', 'easy', ARRAY['array'], '[{"input":{"nums":[2,7,11,15],"target":9},"expected":[0,1]}]'::jsonb)
    ON CONFLICT (title) DO NOTHING;
  `;
  console.log('✅ Core algorithmic problem sets seeded successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());