import jwt from 'jsonwebtoken';
import User from '../modules/auth/User.js';
export const protect = async (req, // Explicit type instead of implicit 'any'
res, // Explicit type instead of implicit 'any'
next) => {
    let token;
    // Check if token exists in Authorization header and starts with Bearer
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];
            // Verify token securely
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            // Get user from the token structure
            req.user = await User.findById(decoded.userId);
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            return next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};
