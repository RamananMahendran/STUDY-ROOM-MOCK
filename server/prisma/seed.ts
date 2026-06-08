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
    connectionString: process.env.DATABASE_URL || "postgresql://studyadmin:studypass123@localhost:5432/studyroom_db?schema=public",
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

    console.log('Seeding statistics and analytics for users...');
    
    // Seed stats for ramanan@live.in (User ID 1) and others
    const sampleLog = [
      { "label": "5/24", "value": 0.0 },
      { "label": "5/25", "value": 0.0 },
      { "label": "5/26", "value": 0.0 },
      { "label": "5/27", "value": 0.0 },
      { "label": "5/28", "value": 0.0 },
      { "label": "5/29", "value": 0.0 },
      { "label": "5/30", "value": 0.0 },
      { "label": "5/31", "value": 0.0 },
      { "label": "6/1", "value": 0.0 },
      { "label": "6/2", "value": 0.0 },
      { "label": "6/3", "value": 0.0 },
      { "label": "6/4", "value": 0.0 },
      { "label": "6/5", "value": 0.6 },
      { "label": "6/6", "value": 0.0 }
    ];

    const sampleHeatmap = [
      { "type": "weekly", "col": 4, "row": 0 },
      { "type": "weekly", "col": 2, "row": 3 },
      { "type": "yearly", "col": 30, "row": 1 },
      { "type": "yearly", "col": 31, "row": 4 }
    ];

    const usersToUpdate = [
      {
        email: 'ramanan@live.in',
        streakCount: 1,
        totalStudyHours: 0.4,
        focusSessionsCount: 1,
        problemsSolved: 0,
        problemsAttempted: 5,
        acceptanceRate: 0.0,
        pomodorosToday: 0,
        pomodorosTotal: 0,
        solvedThisMonth: 0,
        solvedAllTime: 0,
        studyHoursThisWeek: 0.6,
        activityActiveDays: 1,
        longestStreak: 1,
        totalSessions: 4,
        studyHoursToday: 0.0,
        subjectMix: { "First focus block": 0.1 },
        studyHoursLog: sampleLog,
        heatmapData: sampleHeatmap
      },
      {
        email: 'ramanan2312001@ssn.edu.in',
        streakCount: 2,
        totalStudyHours: 1.2,
        focusSessionsCount: 3,
        problemsSolved: 2,
        problemsAttempted: 8,
        acceptanceRate: 25.0,
        pomodorosToday: 1,
        pomodorosTotal: 4,
        solvedThisMonth: 2,
        solvedAllTime: 2,
        studyHoursThisWeek: 1.5,
        activityActiveDays: 2,
        longestStreak: 2,
        totalSessions: 6,
        studyHoursToday: 0.5,
        subjectMix: { "First focus block": 0.5, "Algorithm study": 0.7 },
        studyHoursLog: sampleLog,
        heatmapData: [
          { "type": "weekly", "col": 4, "row": 0 },
          { "type": "weekly", "col": 2, "row": 3 },
          { "type": "weekly", "col": 1, "row": 1 },
          { "type": "yearly", "col": 30, "row": 1 },
          { "type": "yearly", "col": 29, "row": 2 }
        ]
      },
      {
        email: 'alice@studyroom.com',
        streakCount: 5,
        totalStudyHours: 4.8,
        focusSessionsCount: 12,
        problemsSolved: 15,
        problemsAttempted: 20,
        acceptanceRate: 75.0,
        pomodorosToday: 4,
        pomodorosTotal: 24,
        solvedThisMonth: 12,
        solvedAllTime: 15,
        studyHoursThisWeek: 3.2,
        activityActiveDays: 5,
        longestStreak: 5,
        totalSessions: 15,
        studyHoursToday: 1.5,
        subjectMix: { "First focus block": 1.2, "Recursion practice": 3.6 },
        studyHoursLog: sampleLog,
        heatmapData: sampleHeatmap
      }
    ];

    for (const u of usersToUpdate) {
      const userExists = await prisma.user.findFirst({ where: { email: u.email } });
      if (userExists) {
        await prisma.user.update({
          where: { id: userExists.id },
          data: {
            streakCount: u.streakCount,
            totalStudyHours: u.totalStudyHours,
            focusSessionsCount: u.focusSessionsCount,
            problemsSolved: u.problemsSolved,
            problemsAttempted: u.problemsAttempted,
            acceptanceRate: u.acceptanceRate,
            pomodorosToday: u.pomodorosToday,
            pomodorosTotal: u.pomodorosTotal,
            solvedThisMonth: u.solvedThisMonth,
            solvedAllTime: u.solvedAllTime,
            studyHoursThisWeek: u.studyHoursThisWeek,
            activityActiveDays: u.activityActiveDays,
            longestStreak: u.longestStreak,
            totalSessions: u.totalSessions,
            studyHoursToday: u.studyHoursToday,
            subjectMix: u.subjectMix,
            studyHoursLog: u.studyHoursLog,
            heatmapData: u.heatmapData
          }
        });
        console.log(`Updated statistics for user: ${u.email}`);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
    await prisma.$disconnect();
  }
}

seedDatabase();