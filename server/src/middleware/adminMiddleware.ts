import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

/**
 * Admin-only middleware.
 * Must be used AFTER the `protect` middleware so that `req.user` is populated.
 * Returns 403 if the authenticated user does not have role === "admin".
 */
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — authentication required');
    }

    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Forbidden — admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
