import { addTypingUser } from '../../services/redis.service.js';
const persistChatMessage = async (roomId, userId, text, timestamp) => {
    console.log(`[STUB] Persisting message: roomId=${roomId}, userId=${userId}, text=${text}`);
};
export const registerChatHandlers = (io, socket) => {
    const handleSendMessage = async (data) => {
        try {
            const userId = socket.data.userId;
            const timestamp = new Date();
            const messagePayload = {
                userId,
                message: data.message,
                timestamp: timestamp.toISOString(),
            };
            io.to(data.roomId).emit('new_message', messagePayload);
            await persistChatMessage(data.roomId, userId, data.message, timestamp);
            console.log(`Message sent in room ${data.roomId} by user ${userId}`);
        }
        catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    };
    const handleTypingStart = async (data) => {
        try {
            const userId = socket.data.userId.toString();
            await addTypingUser(data.roomId, userId);
            socket.to(data.roomId).emit('typing_indicator', {
                userId,
                isTyping: true,
            });
        }
        catch (error) {
            console.error('Error handling typing indicator:', error);
        }
    };
    const handleTypingStop = (data) => {
        try {
            const userId = socket.data.userId;
            socket.to(data.roomId).emit('typing_indicator', {
                userId,
                isTyping: false,
            });
        }
        catch (error) {
            console.error('Error handling typing indicator:', error);
        }
    };
    socket.on('send_message', handleSendMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);
};
