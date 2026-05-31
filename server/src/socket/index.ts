import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { socketAuthMiddleware } from './auth.middleware.js';
import { registerPresenceHandlers } from './handlers/presence.handler.js';
import { registerTimerHandlers } from './handlers/timer.handler.js';
import { registerChatHandlers } from './handlers/chat.handler.js';
import { registerCollaborationHandlers } from './handlers/collaboration.handler.js';

export const initializeSocketServer = (httpServer: HTTPServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  const pubClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  });

  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

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
