import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { socketAuthMiddleware } from './auth.middleware.js';
import { registerPresenceHandlers } from './handlers/presence.handler.js';
import { registerTimerHandlers } from './handlers/timer.handler.js';
import { registerChatHandlers } from './handlers/chat.handler.js';
import { registerCollaborationHandlers } from './handlers/collaboration.handler.js';

let ioInstance: Server | null = null;

export const initializeSocketServer = (httpServer: HTTPServer): Server => {
  // 🛡️ SINGLETON GUARD: If an instance already exists, do not attach listeners again!
  if (ioInstance) {
    console.log('⚠️ Socket.io instance already exists. Returning active instance to prevent crash.');
    return ioInstance;
  }

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  ioInstance = io;

  // Only setup Redis if available, otherwise run without it
  try {
    const pubClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      lazyConnect: true,
    });
    
    const subClient = pubClient.duplicate();
    
    pubClient.connect().catch(() => console.log('Redis not available, running without adapter'));
    subClient.connect().catch(() => console.log('Redis not available, running without adapter'));
    
    io.adapter(createAdapter(pubClient, subClient));
  } catch (error) {
    console.log('⚠️ Redis not configured, running Socket.io without Redis adapter');
  }

  io.use(socketAuthMiddleware);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}, User: ${socket.data.userId}`);

    socket.on('ping', () => {
      socket.emit('pong');
    });

    registerPresenceHandlers(io, socket);
    registerTimerHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerCollaborationHandlers(io, socket);
  });

  return io;
};

// Export getIO function to get io instance from other modules
export const getIO = (): Server | null => {
  return ioInstance;
};