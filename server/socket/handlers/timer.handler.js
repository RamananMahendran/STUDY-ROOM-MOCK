import {
  setRoomState,
  getRoomState,
} from '../../services/redis.service.js';

const TimerStatus = {
  IDLE:   'IDLE',
  FOCUS:  'FOCUS',
  PAUSED: 'PAUSED',
};

export function registerTimerHandlers(io, socket) {
  socket.on('timer_start', async ({ roomId, durationMs }) => {
    try {
      const endTime = Date.now() + durationMs;

      await setRoomState(roomId, {
        timerStatus:  TimerStatus.FOCUS,
        timerEndTime: String(endTime),
        timerDuration: String(durationMs),
      });

      io.to(roomId).emit('timer_sync', {
        status:  TimerStatus.FOCUS,
        endTime,
      });
    } catch (err) {
      socket.emit('error', { event: 'timer_start', message: err.message });
    }
  });

  socket.on('timer_pause', async ({ roomId }) => {
    try {
      const state = await getRoomState(roomId);
      if (!state?.timerEndTime) return;

      const remaining = Math.max(0, Number(state.timerEndTime) - Date.now());

      await setRoomState(roomId, {
        timerStatus:    TimerStatus.PAUSED,
        timerRemaining: String(remaining),
        timerEndTime:   '',
      });

      io.to(roomId).emit('timer_sync', {
        status:    TimerStatus.PAUSED,
        remaining,
      });
    } catch (err) {
      socket.emit('error', { event: 'timer_pause', message: err.message });
    }
  });

  socket.on('timer_reset', async ({ roomId }) => {
    try {
      await setRoomState(roomId, {
        timerStatus:    TimerStatus.IDLE,
        timerEndTime:   '',
        timerRemaining: '',
        timerDuration:  '',
      });

      io.to(roomId).emit('timer_sync', { status: TimerStatus.IDLE });
    } catch (err) {
      socket.emit('error', { event: 'timer_reset', message: err.message });
    }
  });
}
