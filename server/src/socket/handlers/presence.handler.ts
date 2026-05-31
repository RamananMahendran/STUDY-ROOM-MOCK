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

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
  const handleJoinRoom = async (roomId: string) => {
    try {
      const userId = socket.data.userId.toString();
      
      const canJoin = await enforceRoomCapacity(roomId);
      if (!canJoin) {
        return socket.emit('room_error', { message: 'Room is full' });
      }

      await socket.join(roomId);
      await addUserToRoom(roomId, userId);
      await mapSocketToUser(socket.id, userId);
      await setUserMediaState(roomId, userId, false, false);

      const roomState = await getRoomState(roomId);
      const users = await getRoomUsers(roomId);

      socket.emit('room_state', { roomId, state: roomState, users });
      socket.to(roomId).emit('user_joined', { userId, socketId: socket.id });

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

      socket.to(roomId).emit('user_left', { userId, socketId: socket.id });

      console.log(`User ${userId} left room ${roomId}`);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const userId = socket.data.userId.toString();
      const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);

      for (const roomId of rooms) {
        await removeUserFromRoom(roomId, userId);
        socket.to(roomId).emit('user_left', { userId, socketId: socket.id });
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
