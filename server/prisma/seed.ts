import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../src/config/database.js';
import { generateStarterCode } from '../src/utils/starterCodeGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function seedDatabase() {
  const client = new Client({
    connectionString: "postgresql://studyadmin:studypass123@localhost:5432/studyroom_db?schema=public", // Adjust to your config
  });

  try {
    await client.connect();
    console.log('Connected to database. Reading seed.sql...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '../seed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing seed script...');
        const statements = sql
      .split(/;[ \t]*(\r?\n|$)/)
      .map(s => s.trim())
      .filter(s => {
        const stripped = s
          .replace(/--[^\n]*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .trim();
        return stripped.length > 0;
      });

    for (const statement of statements) {
      await client.query(statement);
    }
    
    console.log('Generating starter codes for all problems...');
    const problems = await prisma.problem.findMany();
    for (const problem of problems) {
      const starter = generateStarterCode(problem.title, problem.slug, problem.testCases);
      await prisma.problem.update({
        where: { id: problem.id },
        data: { starterCode: starter },
      });
    }
    console.log(`Generated starter codes for ${problems.length} problems!`);

    // Log the final row counts returned by the SELECT statements at the end of your file
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
    await prisma.$disconnect();
  }
}

seedDatabase();