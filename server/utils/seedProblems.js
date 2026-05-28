import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'prar0210thna',
  database: 'studyplatform',
});

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
    difficulty: 'easy',
    tags: ['array', 'hash-table'],
    test_cases: [
      { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1] },
      { input: { nums: [3,2,4], target: 6 }, expected: [1,2] },
      { input: { nums: [3,3], target: 6 }, expected: [0,1] }
    ]
  },
  {
    title: 'Palindrome Number',
    description: 'Given an integer x, return true if x is a palindrome.',
    difficulty: 'easy',
    tags: ['math', 'string'],
    test_cases: [
      { input: { x: 121 }, expected: true },
      { input: { x: -121 }, expected: false },
      { input: { x: 10 }, expected: false }
    ]
  },
  {
    title: 'FizzBuzz',
    description: 'Write a program that outputs numbers from 1 to n.',
    difficulty: 'easy',
    tags: ['math', 'string'],
    test_cases: [
      { input: { n: 3 }, expected: ["1","2","Fizz"] },
      { input: { n: 5 }, expected: ["1","2","Fizz","4","Buzz"] }
    ]
  }
];

// Generate 37 more problems
for (let i = 4; i <= 40; i++) {
  problems.push({
    title: `Easy Problem ${i}`,
    description: `Practice problem number ${i}.`,
    difficulty: 'easy',
    tags: ['algorithms', 'problem-solving'],
    test_cases: [
      { input: { test: 1 }, expected: "pass" }
    ]
  });
}

async function seed() {
  try {
    console.log('🌱 Seeding 40 problems into local PostgreSQL...\n');
    
    for (const problem of problems) {
      await pool.query(
        `INSERT INTO problems (title, description, difficulty, tags, test_cases)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (title) DO NOTHING`,
        [
          problem.title,
          problem.description,
          problem.difficulty,
          problem.tags,
          JSON.stringify(problem.test_cases)
        ]
      );
    }
    
    const result = await pool.query('SELECT COUNT(*) FROM problems');
    console.log(`✅ Successfully seeded ${result.rows[0].count} problems!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();