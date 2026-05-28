import { Response } from 'express'; // Import Express Response type
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: string | number): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing.');
  }

  // Generate secure cookie token signature tracking key
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });

  return token;
};

export default generateToken;