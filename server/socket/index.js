import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { socketAuthMiddleware } from './middleware/socketAuth.js';
import { registerPresenceHandlers }      from './handlers/presence.handler.js';
import { registerTimerHandlers }         from './handlers/timer.handler.js';
import { registerChatHandlers }          from './handlers/chat.handler.js';
import { registerCollaborationHandlers } from './handlers/collaboration.handler.js';

export function initSocketServer(httpServer) {
  const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  const subClient = pubClient.duplicate();

  pubClient.on('error', (err) => console.error('[Redis Pub] error:', err));
  subClient.on('error', (err) => console.error('[Redis Sub] error:', err));

  const io = new Server(httpServer, {
    cors: {
      origin:      process.env.CLIENT_URL || 'http://localhost:5173',
      methods:     ['GET', 'POST'],
      credentials: true,
    },
  });

  io.adapter(createAdapter(pubClient, subClient));
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log(`[Socket] connected: ${socket.id} (user: ${socket.userId})`);

    registerPresenceHandlers(io, socket);
    registerTimerHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerCollaborationHandlers(io, socket);

    socket.on('error', (err) => {
      console.error(`[Socket] error on ${socket.id}:`, err.message);
    });
  });

  return io;
}
