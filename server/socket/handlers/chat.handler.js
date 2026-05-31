import pool from '../../config/db.js';

async function persistMessage(roomId, userId, content) {
  await pool.query(
    `INSERT INTO chat_messages (room_id, user_id, content, message_type)
     VALUES ($1, $2, $3, 'text')`,
    [roomId, userId, content]
  );
}

export function registerChatHandlers(io, socket) {
  socket.on('send_message', async ({ roomId, content }) => {
    try {
      const message = {
        roomId,
        userId:    socket.userId,
        content,
        timestamp: Date.now(),
      };

      io.to(roomId).emit('new_message', message);

      await persistMessage(roomId, socket.userId, content);
    } catch (err) {
      socket.emit('error', { event: 'send_message', message: err.message });
    }
  });

  socket.on('typing_start', ({ roomId }) => {
    socket.to(roomId).emit('typing_indicator', { userId: socket.userId });
  });
}
