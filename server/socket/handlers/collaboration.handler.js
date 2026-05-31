export function registerCollaborationHandlers(io, socket) {
  socket.on('cursor_move', ({ roomId, line, column, color }) => {
    socket.volatile.to(roomId).emit('cursor_update', {
      userId: socket.userId,
      line,
      column,
      color,
    });
  });

  socket.on('yjs_sync_step_1', ({ roomId, stateVector }) => {
    socket.to(roomId).emit('yjs_sync_step_1', {
      fromUserId: socket.userId,
      stateVector,
    });
  });

  socket.on('yjs_sync_step_2', ({ roomId, update }) => {
    socket.to(roomId).emit('yjs_sync_step_2', {
      fromUserId: socket.userId,
      update,
    });
  });

  socket.on('yjs_update', ({ roomId, update }) => {
    socket.to(roomId).emit('yjs_update', {
      fromUserId: socket.userId,
      update,
    });
  });
}
