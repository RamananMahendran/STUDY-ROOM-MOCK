import jwt from 'jsonwebtoken';
export const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        socket.data.userId = decoded.userId;
        socket.data.email = decoded.email;
        next();
    }
    catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};
