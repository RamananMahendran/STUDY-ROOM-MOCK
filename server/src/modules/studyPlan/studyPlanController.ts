import { Request, Response } from 'express';
import studyPlanModel from './studyPlanModel.js';
import weeklyChallengeModel from './weeklyChallengeModel.js';

// Helper to safely get string from params
const getParamString = (param: string | string[] | undefined): string => {
  if (!param) return '';
  return Array.isArray(param) ? param[0] : param;
};

// GET /api/study-plans - Get all study plans
export const getAllPlans = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || null;
    const plans = await studyPlanModel.getAllPlans(userId);
    
    return res.json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    console.error('Error fetching study plans:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/study-plans/:slug - Get plan details
export const getPlanBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const slug = getParamString(req.params.slug);
    const userId = (req as any).user?.id || null;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Plan slug is required',
      });
    }
    
    const plan = await studyPlanModel.getPlanBySlug(slug, userId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Study plan not found',
      });
    }
    
    return res.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    console.error('Error fetching study plan:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/study-plans/:slug/start - Start a study plan
export const startPlan = async (req: Request, res: Response): Promise<any> => {
  try {
    const slug = getParamString(req.params.slug);
    const userId = (req as any).user?.id || 1;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Plan slug is required',
      });
    }
    
    const plan = await studyPlanModel.getPlanBySlug(slug);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Study plan not found',
      });
    }
    
    const progress = await studyPlanModel.startPlan(userId, plan.id);
    
    return res.json({
      success: true,
      data: progress,
      message: 'Study plan started successfully!',
    });
  } catch (error: any) {
    console.error('Error starting study plan:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/study-plans/:slug/complete-day - Mark a day as completed
export const completeDay = async (req: Request, res: Response): Promise<any> => {
  try {
    const slug = getParamString(req.params.slug);
    const { dayNumber } = req.body;
    const userId = (req as any).user?.id || 1;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Plan slug is required',
      });
    }
    
    if (!dayNumber) {
      return res.status(400).json({
        success: false,
        error: 'Day number is required',
      });
    }
    
    const plan = await studyPlanModel.getPlanBySlug(slug);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Study plan not found',
      });
    }
    
    const progress = await studyPlanModel.completeDay(userId, plan.id, dayNumber);
    
    return res.json({
      success: true,
      data: progress,
      message: `Day ${dayNumber} completed!`,
    });
  } catch (error: any) {
    console.error('Error completing day:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/study-plans/weekly/current - Get current weekly challenge
export const getCurrentWeeklyChallenge = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || null;
    const challenge = await weeklyChallengeModel.getOrCreateCurrentWeek();
    
    let userProgress = null;
    if (userId) {
      userProgress = await weeklyChallengeModel.getUserProgress(userId, challenge.id);
    }
    
    return res.json({
      success: true,
      data: {
        ...challenge,
        userProgress,
        progress: userProgress ? {
          completedDays: userProgress.completedDays,
          completedCount: userProgress.completedDays.length,
          isCompleted: !!userProgress.completedAt,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('Error fetching weekly challenge:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/study-plans/weekly/start - Start weekly challenge
export const startWeeklyChallenge = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || 1;
    const challenge = await weeklyChallengeModel.getOrCreateCurrentWeek();
    const progress = await weeklyChallengeModel.startChallenge(userId, challenge.id);
    
    return res.json({
      success: true,
      data: progress,
      message: 'Weekly challenge started!',
    });
  } catch (error: any) {
    console.error('Error starting weekly challenge:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/study-plans/weekly/complete-day - Complete a day in weekly challenge
export const completeWeeklyDay = async (req: Request, res: Response): Promise<any> => {
  try {
    const { dayNumber } = req.body;
    const userId = (req as any).user?.id || 1;
    
    if (!dayNumber) {
      return res.status(400).json({
        success: false,
        error: 'Day number is required',
      });
    }
    
    const challenge = await weeklyChallengeModel.getOrCreateCurrentWeek();
    const progress = await weeklyChallengeModel.completeDay(userId, challenge.id, dayNumber);
    
    return res.json({
      success: true,
      data: progress,
      message: `Day ${dayNumber} completed!`,
    });
  } catch (error: any) {
    console.error('Error completing weekly day:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/study-plans/:slug/unenroll - Unenroll a study plan
export const unenrollPlan = async (req: Request, res: Response): Promise<any> => {
  try {
    const slug = getParamString(req.params.slug);
    const userId = (req as any).user?.id || 1;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Plan slug is required',
      });
    }

    const plan = await studyPlanModel.getPlanBySlug(slug);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Study plan not found',
      });
    }

    await studyPlanModel.unenrollPlan(userId, plan.id);

    return res.json({
      success: true,
      message: 'Unenrolled from study plan successfully!',
    });
  } catch (error: any) {
    console.error('Error unenrolling from study plan:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: Seed predefined plans
export const seedPlans = async (req: Request, res: Response): Promise<any> => {
  try {
    await studyPlanModel.seedPredefinedPlans();
    return res.json({
      success: true,
      message: 'Study plans seeded successfully!',
    });
  } catch (error: any) {
    console.error('Error seeding plans:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};