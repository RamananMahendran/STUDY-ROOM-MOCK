import { PrismaClient } from '@prisma/client';
import "dotenv/config"; 

// Keep this entirely empty. Prisma 7 handles the configuration internally.
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed injection with advanced problem sets...');

  const problemsToSeed = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'easy',
      tags: ['array', 'hash-table'],
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
      ]
    },
    {
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      description: 'Given a string s containing just the characters \'( \', \')\', \'{ \', \'}\', \'[\' and \']\', determine if the input string is valid.',
      difficulty: 'easy',
      tags: ['string', 'stack'],
      testCases: [
        { input: { s: '()' }, expected: true },
        { input: { s: '()[]{}' }, expected: true },
        { input: { s: '(]' }, expected: false }
      ]
    },
    {
      title: 'Reverse Linked List',
      slug: 'reverse-linked-list',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      difficulty: 'easy',
      tags: ['linked-list'],
      testCases: [
        { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1] },
        { input: { head: [] }, expected: [] }
      ]
    },
    {
      title: 'Container With Most Water',
      slug: 'container-with-most-water',
      description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
      difficulty: 'medium',
      tags: ['array', 'two-pointers'],
      testCases: [
        { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
        { input: { height: [1, 1] }, expected: 1 }
      ]
    },
    {
      title: 'Number of Islands',
      slug: 'number-of-islands',
      description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
      difficulty: 'medium',
      tags: ['grid', 'bfs', 'dfs', 'graphs'],
      testCases: [
        {
          input: {
            grid: [
              ['1', '1', '1', '1', '0'],
              ['1', '1', '0', '1', '0'],
              ['1', '1', '0', '0', '0'],
              ['0', '0', '0', '0', '0']
            ]
          },
          expected: 1
        },
        {
          input: {
            grid: [
              ['1', '1', '0', '0', '0'],
              ['1', '1', '0', '0', '0'],
              ['0', '0', '1', '0', '0'],
              ['0', '0', '0', '1', '1']
            ]
          },
          expected: 3
        }
      ]
    },
    {
      title: 'Longest Palindromic Substring',
      slug: 'longest-palindromic-substring',
      description: 'Given a string s, return the longest palindromic substring in s.',
      difficulty: 'medium',
      tags: ['string', 'dynamic-programming'],
      testCases: [
        { input: { s: 'babad' }, expected: 'bab' },
        { input: { s: 'cbbd' }, expected: 'bb' }
      ]
    }
  ];

  for (const item of problemsToSeed) {
    const record = await prisma.problem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        tags: item.tags,
        testCases: item.testCases
      },
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        difficulty: item.difficulty,
        tags: item.tags,
        testCases: item.testCases
      }
    });
    console.log(`✅ Synced: "${record.title}"`);
  }

  console.log('🏁 Seeding step finished cleanly!');
}

main()
  .catch((error) => {
    console.error('❌ Crash detected running seed task:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });