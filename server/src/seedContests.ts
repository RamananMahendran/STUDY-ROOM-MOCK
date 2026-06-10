import prisma from './config/database.js';
import bcrypt from 'bcryptjs';
import { generateStarterCode } from './utils/starterCodeGenerator.js';

export async function seedContests() {
  console.log('🌱 Starting contests seeding...');

  try {
    // 1. Ensure mock users exist
    const passwordHash = await bcrypt.hash('studypass123', 10);
    const mockUserData = [
      { name: 'Alice Smith', email: 'alice@studyroom.com', username: 'alice_smith' },
      { name: 'Bob Jones', email: 'bob@studyroom.com', username: 'bob_jones' },
      { name: 'Charlie Brown', email: 'charlie@studyroom.com', username: 'charlie_brown' },
    ];

    const users = [];
    for (const userData of mockUserData) {
      let user = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: passwordHash,
            role: 'free',
            streakCount: 5,
          },
        });
        console.log(`Created user: ${user.name}`);
      }
      users.push(user);
    }

    // 2. Fetch required problems
    const problemSlugs = [
      'two-sum',
      'palindrome-number',
      'fizzbuzz',
      'valid-parentheses',
      'product-of-array-except-self',
      'house-robber',
      'median-of-two-sorted-arrays',
    ];

    const problems = await prisma.problem.findMany({
      where: { slug: { in: problemSlugs } },
    });

    if (problems.length === 0) {
      console.error('❌ No problems found in DB! Please run the main db seed first.');
      return;
    }

    const problemMap = new Map(problems.map(p => [p.slug, p.id]));
    
    // Fallback in case some slugs are missing
    const getProblemId = (slug: string): number => {
      const id = problemMap.get(slug);
      if (id !== undefined) return id;
      return problems[0].id; // Return first found problem as fallback
    };

    console.log(`Found ${problems.length} problems for contests.`);

    // 3. Clear existing contests to make seeding idempotent
    const existingContests = await prisma.contest.findMany({
      where: {
        title: {
          in: ['Weekly Code Clash #1', 'Bytecode Showdown 2026', 'Algorithmic Cup'],
        },
      },
    });

    if (existingContests.length > 0) {
      console.log('Cleaning up existing seeded contests...');
      await prisma.contest.deleteMany({
        where: { id: { in: existingContests.map(c => c.id) } },
      });
    }

    const now = new Date();

    // 4. Create Past Contest: Weekly Code Clash #1
    // Started 2 days ago, ended 1.5 days ago
    const pastStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000);
    const pastContest = await prisma.contest.create({
      data: {
        title: 'Weekly Code Clash #1',
        description: 'Challenge your coding limits with these 3 handpicked algorithmic problems. Bring your A-game!',
        startTime: pastStart,
        endTime: pastEnd,
        problems: {
          create: [
            { problemId: getProblemId('two-sum'), points: 100 },
            { problemId: getProblemId('product-of-array-except-self'), points: 200 },
            { problemId: getProblemId('median-of-two-sorted-arrays'), points: 300 },
          ],
        },
        participants: {
          create: users.map(u => ({ userId: u.id, totalScore: 0 })),
        },
      },
    });
    console.log(`Created Past Contest: ${pastContest.title}`);

    // 5. Create Ongoing Contest: Bytecode Showdown 2026
    // Started 30 mins ago, ends in 1.5 hours
    const ongoingStart = new Date(now.getTime() - 30 * 60 * 1000);
    const ongoingEnd = new Date(now.getTime() + 90 * 60 * 1000);
    const ongoingContest = await prisma.contest.create({
      data: {
        title: 'Bytecode Showdown 2026',
        description: 'Our monthly premier coding event. Outsmart the competition, claim your spot on the live leaderboard!',
        startTime: ongoingStart,
        endTime: ongoingEnd,
        problems: {
          create: [
            { problemId: getProblemId('palindrome-number'), points: 100 },
            { problemId: getProblemId('valid-parentheses'), points: 150 },
          ],
        },
        participants: {
          create: users.map(u => ({ userId: u.id, totalScore: 0 })),
        },
      },
    });
    console.log(`Created Ongoing Contest: ${ongoingContest.title}`);

    // 6. Create Upcoming Contest: Algorithmic Cup
    // Starts in 1 day, ends in 1 day + 2 hours
    const upcomingStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcomingEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000);
    const upcomingContest = await prisma.contest.create({
      data: {
        title: 'Algorithmic Cup',
        description: 'Hosted by the Advanced Algorithm Club. Test your problem-solving skills on DP and Graph topics.',
        startTime: upcomingStart,
        endTime: upcomingEnd,
        problems: {
          create: [
            { problemId: getProblemId('fizzbuzz'), points: 50 },
            { problemId: getProblemId('house-robber'), points: 150 },
          ],
        },
        // No participants pre-registered, let user register
      },
    });
    console.log(`Created Upcoming Contest: ${upcomingContest.title}`);

    // 7. Seed Past Contest Submissions (to construct a realistic leaderboard)
    // We will insert submissions with creation time within the contest window: [pastStart, pastEnd]
    const p1 = getProblemId('two-sum');
    const p2 = getProblemId('product-of-array-except-self');
    const p3 = getProblemId('median-of-two-sorted-arrays');

    const [alice, bob, charlie] = users;

    const mockSubmissions = [
      // --- ALICE ---
      // Two sum solved at 10m
      {
        userId: alice.id,
        problemId: p1,
        language: 'python',
        code: `class Solution:\n    def twoSum(self, nums, target):\n        d = {}\n        for i, n in enumerate(nums):\n            if target - n in d:\n                return [d[target-n], i]\n            d[n] = i\n        return []`,
        status: 'accepted',
        createdAt: new Date(pastStart.getTime() + 10 * 60 * 1000),
      },
      // Product of array failed at 30m
      {
        userId: alice.id,
        problemId: p2,
        language: 'python',
        code: `class Solution:\n    def productExceptSelf(self, nums):\n        # Incorrect implementation\n        return [1] * len(nums)`,
        status: 'wrong_answer',
        createdAt: new Date(pastStart.getTime() + 30 * 60 * 1000),
      },
      // Product of array solved at 45m
      {
        userId: alice.id,
        problemId: p2,
        language: 'python',
        code: `class Solution:\n    def productExceptSelf(self, nums):\n        res = [1] * len(nums)\n        prefix = 1\n        for i in range(len(nums)):\n            res[i] = prefix\n            prefix *= nums[i]\n        suffix = 1\n        for i in range(len(nums)-1, -1, -1):\n            res[i] *= suffix\n            suffix *= nums[i]\n        return res`,
        status: 'accepted',
        createdAt: new Date(pastStart.getTime() + 45 * 60 * 1000),
      },
      // Median of array failed at 60m
      {
        userId: alice.id,
        problemId: p3,
        language: 'python',
        code: `class Solution:\n    def findMedianSortedArrays(self, nums1, nums2):\n        return 0.0`,
        status: 'wrong_answer',
        createdAt: new Date(pastStart.getTime() + 60 * 60 * 1000),
      },

      // --- BOB ---
      // Two sum failed at 5m
      {
        userId: bob.id,
        problemId: p1,
        language: 'javascript',
        code: `var twoSum = function(nums, target) { return []; };`,
        status: 'wrong_answer',
        createdAt: new Date(pastStart.getTime() + 5 * 60 * 1000),
      },
      // Two sum solved at 15m
      {
        userId: bob.id,
        problemId: p1,
        language: 'javascript',
        code: `var twoSum = function(nums, target) {\n    const map = new Map();\n    for(let i=0; i<nums.length; i++) {\n        const diff = target - nums[i];\n        if(map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
        status: 'accepted',
        createdAt: new Date(pastStart.getTime() + 15 * 60 * 1000),
      },

      // --- CHARLIE ---
      // Two sum solved at 5m
      {
        userId: charlie.id,
        problemId: p1,
        language: 'cpp',
        code: `#include <vector>\n#include <unordered_map>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> m;\n        for(int i=0; i<nums.size(); i++) {\n            if(m.count(target-nums[i])) return {m[target-nums[i]], i};\n            m[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
        status: 'accepted',
        createdAt: new Date(pastStart.getTime() + 5 * 60 * 1000),
      },
      // Product of array solved at 85m
      {
        userId: charlie.id,
        problemId: p2,
        language: 'cpp',
        code: `// standard logic`,
        status: 'accepted',
        createdAt: new Date(pastStart.getTime() + 85 * 60 * 1000),
      },
      // Median of array failed at 90m
      {
        userId: charlie.id,
        problemId: p3,
        language: 'cpp',
        code: `// bad logic`,
        status: 'wrong_answer',
        createdAt: new Date(pastStart.getTime() + 90 * 60 * 1000),
      },
      // Median of array failed at 100m
      {
        userId: charlie.id,
        problemId: p3,
        language: 'cpp',
        code: `// bad logic 2`,
        status: 'time_limit_exceeded',
        createdAt: new Date(pastStart.getTime() + 100 * 60 * 1000),
      },
      // Median of array solved at 110m
      {
        userId: charlie.id,
        problemId: p3,
        language: 'cpp',
        code: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // dummy correct representation for seeding\n        return 2.0;\n    }\n};`,
        status: 'accepted',
        createdAt: new Date(pastStart.getTime() + 110 * 60 * 1000),
      },
    ];

    console.log('Seeding mock submissions...');
    for (const sub of mockSubmissions) {
      await prisma.submission.create({
        data: {
          userId: sub.userId,
          problemId: sub.problemId,
          language: sub.language,
          code: sub.code,
          status: sub.status,
          submittedFrom: `contest:${pastContest.id}`,
          createdAt: sub.createdAt,
        },
      });
    }

    // Update participants totalScore based on solved problems points
    console.log('Updating participant total scores...');
    // Alice solved Two sum (100pt) + Product except self (200pt) = 300
    await prisma.contestParticipant.update({
      where: { contestId_userId: { contestId: pastContest.id, userId: alice.id } },
      data: { totalScore: 300 },
    });
    // Bob solved Two sum (100pt) = 100
    await prisma.contestParticipant.update({
      where: { contestId_userId: { contestId: pastContest.id, userId: bob.id } },
      data: { totalScore: 100 },
    });
    // Charlie solved Two sum (100pt) + Product (200pt) + Median (300pt) = 600
    await prisma.contestParticipant.update({
      where: { contestId_userId: { contestId: pastContest.id, userId: charlie.id } },
      data: { totalScore: 600 },
    });

    console.log('Regenerating starter codes for contest problems...');
    for (const problem of problems) {
      const starter = generateStarterCode(problem.title, problem.slug, problem.testCases);
      await prisma.problem.update({
        where: { id: problem.id },
        data: { starterCode: starter },
      });
    }
    console.log(`Regenerated starter codes for ${problems.length} contest problems!`);

    console.log('✅ Seeding contests completed successfully!');
  } catch (error) {
    console.error('❌ Seeding contests failed:', error);
  } 
}


export default seedContests;
