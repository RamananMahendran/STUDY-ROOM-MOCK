import studyPlanModel from './modules/studyPlan/studyPlanModel.js';
import prisma from './config/database.js';

async function seedStudyPlans() {
  console.log('🌱 Seeding study plans...');
  
  // First, seed the plans
  await studyPlanModel.seedPredefinedPlans();
  
  // Get the plans
  const placementPlan = await prisma.studyPlan.findUnique({
    where: { slug: 'placement-sprint-30' },
  });
  
  const faangPlan = await prisma.studyPlan.findUnique({
    where: { slug: 'faang-prep-45' },
  });
  
  const arraysPlan = await prisma.studyPlan.findUnique({
    where: { slug: 'arrays-mastery-14' },
  });
  
  // Get problems for each difficulty
  const easyProblems = await prisma.problem.findMany({
    where: { difficulty: 'easy' },
    take: 30,
  });
  
  const mediumProblems = await prisma.problem.findMany({
    where: { difficulty: 'medium' },
    take: 50,
  });
  
  const hardProblems = await prisma.problem.findMany({
    where: { difficulty: 'hard' },
    take: 20,
  });
  
  // Assign problems to placement plan (30 days, mix of easy/medium)
  if (placementPlan && easyProblems.length > 0) {
    for (let day = 1; day <= 30; day++) {
      const problemIndex = (day - 1) % easyProblems.length;
      await prisma.studyPlanProblem.upsert({
        where: {
          planId_dayNumber_problemId: {
            planId: placementPlan.id,
            dayNumber: day,
            problemId: easyProblems[problemIndex].id,
          },
        },
        update: {},
        create: {
          planId: placementPlan.id,
          problemId: easyProblems[problemIndex].id,
          dayNumber: day,
          orderIndex: day,
        },
      });
    }
    console.log(`✅ Added ${30} problems to Placement Sprint plan`);
  }
  
  // Assign problems to FAANG plan (45 days, mix of medium/hard)
  if (faangPlan && mediumProblems.length > 0) {
    for (let day = 1; day <= 45; day++) {
      const problemIndex = (day - 1) % mediumProblems.length;
      await prisma.studyPlanProblem.upsert({
        where: {
          planId_dayNumber_problemId: {
            planId: faangPlan.id,
            dayNumber: day,
            problemId: mediumProblems[problemIndex].id,
          },
        },
        update: {},
        create: {
          planId: faangPlan.id,
          problemId: mediumProblems[problemIndex].id,
          dayNumber: day,
          orderIndex: day,
        },
      });
    }
    console.log(`✅ Added ${45} problems to FAANG Prep plan`);
  }
  
  // Assign problems to Arrays plan (14 days, array problems)
  if (arraysPlan && easyProblems.length > 0) {
    for (let day = 1; day <= 14; day++) {
      const problemIndex = (day - 1) % easyProblems.length;
      await prisma.studyPlanProblem.upsert({
        where: {
          planId_dayNumber_problemId: {
            planId: arraysPlan.id,
            dayNumber: day,
            problemId: easyProblems[problemIndex].id,
          },
        },
        update: {},
        create: {
          planId: arraysPlan.id,
          problemId: easyProblems[problemIndex].id,
          dayNumber: day,
          orderIndex: day,
        },
      });
    }
    console.log(`✅ Added ${14} problems to Arrays Mastery plan`);
  }
  
  console.log('🎉 Study plans seeded successfully!');
}

seedStudyPlans()
  .catch(console.error)
  .finally(() => process.exit(0));