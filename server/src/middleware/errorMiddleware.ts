import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handling middleware intercepts thrown errors uniformly
export const errorHandler = (
  err: any, // Typings here can be set to 'any' or a custom app error interface to parse runtime properties safely
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If status is 200 but an unhandled exception occurred, automatically defaults to a 500 Server Error
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Legacy tracking logic cleanup for matching database bad ObjectIds
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};