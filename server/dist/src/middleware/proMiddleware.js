import prisma from '../config/database.js';
export const requirePro = async (req, res, next) => {
    try {
        const userId = req.user?.id || 1;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        if (!user || user.role !== 'pro') {
            return res.status(403).json({
                success: false,
                error: 'This feature is only available for Pro members.',
                upgradeRequired: true,
                upgradeUrl: '/api/subscriptions/upgrade',
                message: '🔒 Upgrade to Pro to unlock mock interviews, detailed analytics, and more!'
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
