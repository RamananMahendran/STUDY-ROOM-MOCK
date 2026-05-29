import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import pairModel from '../modules/pair/pairModel.js';

interface CursorData {
  lineNumber: number;
  columnNumber: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  color: string;
}

// Store io instance for access from other modules
let ioInstance: SocketServer | null = null;

export function setupSocketServer(server: HttpServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  ioInstance = io;

  // Store active room connections
  const activeRooms = new Map<string, Set<string>>();

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a pair coding room
    socket.on('join-pair-room', async (data: { roomCode: string; userId: number; userName: string; userAvatar?: string }) => {
      const { roomCode, userId, userName, userAvatar } = data;
      const roomName = `pair:${roomCode}`;

      socket.join(roomName);

      if (!activeRooms.has(roomName)) {
        activeRooms.set(roomName, new Set());
      }
      activeRooms.get(roomName)?.add(socket.id);

      // Get existing cursors
      const session = await pairModel.findByRoomCode(roomCode);
      if (session) {
        const cursors = await pairModel.getCursors(session.id);
        const cursorData = cursors.map(c => ({
          userId: c.userId,
          userName: c.user.name,
          userAvatar: c.user.avatarUrl,
          lineNumber: c.lineNumber,
          columnNumber: c.columnNumber,
          color: c.color,
        }));
        socket.emit('cursors-initial', cursorData);
      }

      console.log(`👥 User ${userName} joined room: ${roomCode}`);
      socket.to(roomName).emit('user-joined', { userId, userName, userAvatar });
    });

    // Handle cursor movement
    socket.on('cursor-move', async (data: {
      roomCode: string;
      userId: number;
      userName: string;
      userAvatar?: string;
      lineNumber: number;
      columnNumber: number;
      color?: string;
    }) => {
      const { roomCode, userId, userName, userAvatar, lineNumber, columnNumber, color } = data;
      const roomName = `pair:${roomCode}`;

      // Update cursor in database
      const session = await pairModel.findByRoomCode(roomCode);
      if (session) {
        await pairModel.updateCursor(session.id, userId, lineNumber, columnNumber, color || '#7F77DD');
      }

      // Broadcast to other users in the room
      socket.to(roomName).emit('cursor-move', {
        userId,
        userName,
        userAvatar,
        lineNumber,
        columnNumber,
        color: color || '#7F77DD',
      });
    });

    // Handle code changes (for shared editor)
    socket.on('code-change', async (data: { roomCode: string; code: string }) => {
      const { roomCode, code } = data;
      const roomName = `pair:${roomCode}`;

      // Save to database
      await pairModel.updateCodeByRoomCode(roomCode, code);

      // Broadcast to others
      socket.to(roomName).emit('code-change', { code });
    });

    // 👇 NEW: Handle submission result (BE3 will emit this, we just forward/confirm)
    socket.on('submission:result', (data: any) => {
      const { roomCode } = data;
      const roomName = `pair:${roomCode}`;
      // Broadcast to all users in the room
      io.to(roomName).emit('submission:result', data);
      console.log(`📡 Broadcast submission result to room: ${roomName}`);
    });

    // Handle leaving room
    socket.on('leave-pair-room', async (data: { roomCode: string; userId: number; userName: string }) => {
      const { roomCode, userId, userName } = data;
      const roomName = `pair:${roomCode}`;

      socket.leave(roomName);
      activeRooms.get(roomName)?.delete(socket.id);

      // Remove cursor from database
      const session = await pairModel.findByRoomCode(roomCode);
      if (session) {
        await pairModel.deleteCursor(session.id, userId);
      }

      socket.to(roomName).emit('user-left', { userId, userName });
      console.log(`👋 User ${userName} left room: ${roomCode}`);
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.id}`);

      // Remove from active rooms and clean up cursors
      for (const [roomName, sockets] of activeRooms.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);

          // Try to get roomCode from roomName
          const roomCode = roomName.replace('pair:', '');
          const session = await pairModel.findByRoomCode(roomCode);
          if (session) {
            // We don't know which user, so just log
            console.log(`User from room ${roomCode} disconnected`);
          }

          socket.to(roomName).emit('user-left', { socketId: socket.id });

          if (sockets.size === 0) {
            activeRooms.delete(roomName);
          }
          break;
        }
      }
    });
  });

  return io;
}

// 👇 EXPORT this function to get io instance from other modules (like submission worker)
export function getIO(): SocketServer | null {
  return ioInstance;
}