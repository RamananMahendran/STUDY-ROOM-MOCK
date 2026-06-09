import { Server, Socket } from 'socket.io';
import {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
  getRoomState,
  mapSocketToUser,
  deleteSocketMapping,
  enforceRoomCapacity,
  setUserMediaState,
} from '../../services/redis.service.js';
import prisma from '../../config/database.js';

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
  const handleJoinRoom = async (roomId: string) => {
    try {
      const userId = socket.data.userId.toString();
      
      const canJoin = await enforceRoomCapacity(roomId);
      if (!canJoin) {
        return socket.emit('room_error', { message: 'Room is full' });
      }

      // Ensure room exists in PostgreSQL to satisfy foreign key constraints
      try {
        await prisma.studyRoom.upsert({
          where: { id: roomId },
          update: {},
          create: {
            id: roomId,
            name: `Room ${roomId}`,
            slug: `room-${roomId}`,
            ownerId: parseInt(userId, 10),
            isPrivate: false,
            roomType: 'study',
          }
        });
        console.log(`[DB] Room ${roomId} upserted successfully`);
      } catch (upsertErr: any) {
        console.error(`[DB] Failed to upsert room ${roomId}:`, upsertErr.message);
        // If upsert fails due to slug conflict, try just checking if it exists
        const existingRoom = await prisma.studyRoom.findUnique({ where: { id: roomId } });
        if (!existingRoom) {
          // Try with a timestamp suffix on slug to avoid conflicts
          await prisma.studyRoom.create({
            data: {
              id: roomId,
              name: `Room ${roomId}`,
              slug: `room-${roomId}-${Date.now()}`,
              ownerId: parseInt(userId, 10),
              isPrivate: false,
              roomType: 'study',
            }
          });
          console.log(`[DB] Room ${roomId} created with fallback slug`);
        } else {
          console.log(`[DB] Room ${roomId} already exists, skipping create`);
        }
      }

      await socket.join(roomId);
      await addUserToRoom(roomId, userId);
      await mapSocketToUser(socket.id, userId);
      await setUserMediaState(roomId, userId, false, false);

      const roomState = await getRoomState(roomId);
      const userIds = await getRoomUsers(roomId);

      const userDb = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
      const userName = userDb?.name || `User ${userId}`;
      socket.data.userName = userName;

      // Fetch names for all users currently in the room
      const allUsersDb = await prisma.user.findMany({
        where: { id: { in: userIds.map(id => parseInt(id, 10)) } },
        select: { id: true, name: true, email: true }
      });
      const users = allUsersDb.map(u => ({ userId: u.id, userName: u.name, email: u.email, isOnline: true }));

      // Fetch the actual room owner
      const roomDb = await prisma.studyRoom.findUnique({ where: { id: roomId } });
      const ownerId = roomDb?.ownerId;

      socket.emit('room_state', { roomId, state: roomState, users, ownerId });
      socket.to(roomId).emit('user_joined', { userId, userName, socketId: socket.id });

      // Friend Requests
      socket.on('send_friend_request', async ({ targetUserId }) => {
        try {
          const fromId = parseInt(userId, 10);
          const targetId = parseInt(targetUserId, 10);
          
          // Check if relationship already exists
          const existing = await prisma.friendship.findFirst({
            where: {
              OR: [
                { userAId: fromId, userBId: targetId },
                { userAId: targetId, userBId: fromId }
              ]
            }
          });
          
          if (!existing) {
            await prisma.friendship.create({
              data: {
                userAId: fromId,
                userBId: targetId,
                status: 'pending'
              }
            });
            console.log(`[DB] Created pending friendship from ${fromId} to ${targetId}`);
          }

          // Send back to room (so the target user receives it)
          // Client will check if they are the target
          socket.to(roomId).emit('friend_request_received', {
            fromUserId: fromId,
            targetUserId: targetId
          });
        } catch (error) {
          console.error("Error sending friend request:", error);
        }
      });

      socket.on('accept_friend_request', async ({ fromUserId }) => {
        try {
          const fromId = parseInt(fromUserId, 10);
          const targetId = parseInt(userId, 10); // current user is target accepting it

          // Update DB to accepted
          const existing = await prisma.friendship.findFirst({
            where: {
              userAId: fromId,
              userBId: targetId,
              status: 'pending'
            }
          });
          
          if (existing) {
            await prisma.friendship.update({
              where: { id: existing.id },
              data: { status: 'accepted' }
            });
            console.log(`[DB] Accepted friendship between ${fromId} and ${targetId}`);
          } else {
            const reverseExisting = await prisma.friendship.findFirst({
              where: {
                userAId: targetId,
                userBId: fromId,
                status: 'pending'
              }
            });
            if (reverseExisting) {
              await prisma.friendship.update({
                where: { id: reverseExisting.id },
                data: { status: 'accepted' }
              });
              console.log(`[DB] Accepted reverse friendship between ${targetId} and ${fromId}`);
            }
          }

          socket.to(roomId).emit('friend_request_accepted', {
            fromUserId: fromId,
            targetUserId: targetId
          });
        } catch (error) {
          console.error("Error accepting friend request:", error);
        }
      });

      // Fetch and emit chat history with isMine flag
      const recentMessages = await prisma.chatMessage.findMany({
        where: { roomId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: { name: true } } }
      });
      const myUserId = parseInt(userId, 10);
      socket.emit('chat_history', recentMessages.reverse().map(m => ({
        id: m.id,
        userId: m.userId,
        message: m.message,
        createdAt: m.createdAt,
        isMine: m.userId === myUserId,
        userName: m.user?.name || `User ${m.userId}`,
      })));

      console.log(`User ${userId} joined room ${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    try {
      const userId = socket.data.userId.toString();
      
      await socket.leave(roomId);
      await removeUserFromRoom(roomId, userId);
      await deleteSocketMapping(socket.id);

      const userName = socket.data.userName;
      socket.to(roomId).emit('user_left', { userId, userName, socketId: socket.id });

      console.log(`User ${userId} left room ${roomId}`);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const userId = socket.data.userId.toString();
      const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);

      const userName = socket.data.userName;
      for (const roomId of rooms) {
        await removeUserFromRoom(roomId, userId);
        socket.to(roomId).emit('user_left', { userId, userName, socketId: socket.id });
      }

      await deleteSocketMapping(socket.id);
      console.log(`User ${userId} disconnected`);
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  };

  const handleToggleMedia = async (data: { roomId: string; type: 'mic' | 'cam'; enabled: boolean }) => {
    try {
      const userId = socket.data.userId.toString();
      
      const currentState = { micOn: false, camOn: false };
      if (data.type === 'mic') {
        currentState.micOn = data.enabled;
      } else {
        currentState.camOn = data.enabled;
      }
      
      await setUserMediaState(data.roomId, userId, currentState.micOn, currentState.camOn);
      
      socket.to(data.roomId).emit('media_state_changed', {
        userId,
        micOn: currentState.micOn,
        camOn: currentState.camOn,
      });
    } catch (error) {
      console.error('Error toggling media:', error);
    }
  };

  socket.on('join_room', handleJoinRoom);
  socket.on('leave_room', handleLeaveRoom);
  socket.on('disconnect', handleDisconnect);
  socket.on('toggle_media', handleToggleMedia);
};
