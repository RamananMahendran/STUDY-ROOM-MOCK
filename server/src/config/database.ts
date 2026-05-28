import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Read the connection string from the environment, with a local fallback for CLI diagnostics
const connectionString = process.env.DATABASE_URL || "postgresql://studyadmin:studypass123@127.0.0.1:5432/studyroom_db?schema=public";

// 2. Initialize the standard PostgreSQL connection pool
const pool = new Pool({ connectionString });

// 3. Wrap the pool in Prisma's Driver Adapter
const adapter = new PrismaPg(pool);

// 4. Pass the adapter into the Prisma Client constructor
const prisma = new PrismaClient({
  adapter, // ✨ Prisma 7 requires this!
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
