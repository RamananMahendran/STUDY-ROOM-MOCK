import { Server, Socket } from 'socket.io';
import { setRoomState, getRoomState, getRoomUsers } from '../../services/redis.service.js';

const activeTimers = new Map<string, NodeJS.Timeout>();

const recordSessionToDatabase = async (userIds: string[], duration: number): Promise<void> => {
  console.log(`[STUB] Recording session for users: ${userIds.join(', ')}, duration: ${duration}ms`);
};

export const registerTimerHandlers = (io: Server, socket: Socket) => {
  const handleTimerStart = async (data: { roomId: string; duration: number; type: 'FOCUS' | 'BREAK' | 'MOCK_INTERVIEW' }) => {
    try {
      const endTime = Date.now() + data.duration;
      
      if (activeTimers.has(data.roomId)) {
        clearTimeout(activeTimers.get(data.roomId)!);
      }

      await setRoomState(data.roomId, {
        status: data.type,
        timerEndTime: endTime,
        remainingTime: undefined,
      });

      io.to(data.roomId).emit('timer_sync', {
        state: data.type,
        endTime,
        duration: data.duration,
      });

      const timeout = setTimeout(async () => {
        try {
          await setRoomState(data.roomId, {
            status: 'IDLE',
            timerEndTime: undefined,
          });

          io.to(data.roomId).emit('timer_complete', {
            type: data.type,
            duration: data.duration,
          });

          if (data.type === 'FOCUS') {
            const users = await getRoomUsers(data.roomId);
            await recordSessionToDatabase(users, data.duration);
          }

          activeTimers.delete(data.roomId);
        } catch (error) {
          console.error('Error completing timer:', error);
        }
      }, data.duration);

      activeTimers.set(data.roomId, timeout);

      console.log(`Timer started in room ${data.roomId}: ${data.type} for ${data.duration}ms`);
    } catch (error) {
      console.error('Error starting timer:', error);
      socket.emit('error', { message: 'Failed to start timer' });
    }
  };

  const handleTimerPause = async (data: { roomId: string }) => {
    try {
      const roomState = await getRoomState(data.roomId);
      
      if (!roomState || !roomState.timerEndTime) {
        return socket.emit('error', { message: 'No active timer to pause' });
      }

      if (activeTimers.has(data.roomId)) {
        clearTimeout(activeTimers.get(data.roomId)!);
        activeTimers.delete(data.roomId);
      }

      const remainingTime = Math.max(0, roomState.timerEndTime - Date.now());
      
      await setRoomState(data.roomId, {
        status: 'PAUSED',
        remainingTime,
        timerEndTime: undefined,
      });

      io.to(data.roomId).emit('timer_sync', {
        state: 'PAUSED',
        remainingTime,
      });

      console.log(`Timer paused in room ${data.roomId}`);
    } catch (error) {
      console.error('Error pausing timer:', error);
      socket.emit('error', { message: 'Failed to pause timer' });
    }
  };

  const handleTimerReset = async (data: { roomId: string }) => {
    try {
      if (activeTimers.has(data.roomId)) {
        clearTimeout(activeTimers.get(data.roomId)!);
        activeTimers.delete(data.roomId);
      }

      await setRoomState(data.roomId, {
        status: 'IDLE',
        timerEndTime: undefined,
        remainingTime: undefined,
      });

      io.to(data.roomId).emit('timer_sync', {
        state: 'IDLE',
      });

      console.log(`Timer reset in room ${data.roomId}`);
    } catch (error) {
      console.error('Error resetting timer:', error);
      socket.emit('error', { message: 'Failed to reset timer' });
    }
  };

  socket.on('timer_start', handleTimerStart);
  socket.on('timer_pause', handleTimerPause);
  socket.on('timer_reset', handleTimerReset);
};
