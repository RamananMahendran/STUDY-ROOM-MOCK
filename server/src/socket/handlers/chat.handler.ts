import { Server, Socket } from 'socket.io';
import prisma from '../../config/database.js';
import { addTypingUser } from '../../services/redis.service.js';

const persistChatMessage = async (roomId: string, userId: number, text: string, timestamp: Date): Promise<void> => {
  try {
    console.log(`[Chat] Persisting message: roomId=${roomId} userId=${userId}`);
    await prisma.chatMessage.create({
      data: {
        roomId,
        userId,
        message: text,
        createdAt: timestamp,
      },
    });
    console.log(`[Chat] Message persisted successfully`);
  } catch (err: any) {
    console.error('[Chat] Failed to persist chat message:', err.message, err.code);
  }
};

export const registerChatHandlers = (io: Server, socket: Socket) => {
  const handleSendMessage = async (data: { roomId: string; message: string }) => {
    try {
      const userId = socket.data.userId;
      const userName = socket.data.userName;
      const timestamp = new Date();

      const messagePayload = {
        userId,
        userName,
        message: data.message,
        timestamp: timestamp.toISOString(),
      };

      io.to(data.roomId).emit('new_message', messagePayload);

      await persistChatMessage(data.roomId, userId, data.message, timestamp);

      console.log(`Message sent in room ${data.roomId} by user ${userId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  };

  const handleTypingStart = async (data: { roomId: string }) => {
    try {
      const userId = socket.data.userId.toString();
      
      await addTypingUser(data.roomId, userId);
      
      socket.to(data.roomId).emit('typing_indicator', {
        userId,
        isTyping: true,
      });
    } catch (error) {
      console.error('Error handling typing indicator:', error);
    }
  };

  const handleTypingStop = (data: { roomId: string }) => {
    try {
      const userId = socket.data.userId;
      
      socket.to(data.roomId).emit('typing_indicator', {
        userId,
        isTyping: false,
      });
    } catch (error) {
      console.error('Error handling typing indicator:', error);
    }
  };

  socket.on('send_message', handleSendMessage);
  socket.on('typing_start', handleTypingStart);
  socket.on('typing_stop', handleTypingStop);
};
