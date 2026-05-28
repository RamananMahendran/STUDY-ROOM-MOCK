import {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
  getRoomState,
  mapSocketToUser,
  removeSocketMapping,
} from '../../services/redis.service.js';

export function registerPresenceHandlers(io, socket) {
  socket.on('join_room', async ({ roomId }) => {
    try {
      await socket.join(roomId);
      await addUserToRoom(roomId, socket.userId);
      await mapSocketToUser(socket.id, socket.userId);

      socket.currentRoomId = roomId;

      const [users, state] = await Promise.all([
        getRoomUsers(roomId),
        getRoomState(roomId),
      ]);

      socket.to(roomId).emit('user_joined', { userId: socket.userId, users });
      socket.emit('room_state', { state, users });
    } catch (err) {
      socket.emit('error', { event: 'join_room', message: err.message });
    }
  });

  socket.on('leave_room', async ({ roomId }) => {
    await handleLeave(io, socket, roomId);
  });

  socket.on('toggle_media', ({ roomId, mic, cam }) => {
    socket.to(roomId).emit('media_state_changed', {
      userId: socket.userId,
      mic,
      cam,
    });
  });

  socket.on('disconnecting', async () => {
    const roomId = socket.currentRoomId;
    if (roomId) {
      await handleLeave(io, socket, roomId);
    }
  });

  socket.on('disconnect', async () => {
    await removeSocketMapping(socket.id);
  });
}

async function handleLeave(io, socket, roomId) {
  try {
    await removeUserFromRoom(roomId, socket.userId);

    const users = await getRoomUsers(roomId);
    io.to(roomId).emit('user_left', { userId: socket.userId, users });

    socket.currentRoomId = null;
  } catch (err) {
    console.error('[Presence] handleLeave error:', err.message);
  }
}
