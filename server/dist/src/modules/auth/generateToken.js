import jwt from 'jsonwebtoken';
const generateToken = (res, userId) => {
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
