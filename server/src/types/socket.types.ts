export interface ServerToClientEvents {
  room_state: (data: { roomId: string; state: any; users: string[] }) => void;
  user_joined: (data: { userId: string; socketId: string }) => void;
  user_left: (data: { userId: string; socketId: string }) => void;
  media_state_changed: (data: { userId: string; type: 'mic' | 'cam'; enabled: boolean }) => void;
  timer_sync: (data: { state: string; endTime?: number; duration?: number; remainingTime?: number }) => void;
  new_message: (data: { userId: number; message: string; timestamp: string }) => void;
  typing_indicator: (data: { userId: number; isTyping: boolean }) => void;
  cursor_update: (data: { userId: number; line: number; column: number; color: string }) => void;
  yjs_sync_step_1: (data: { stateVector: Uint8Array; from: string }) => void;
  yjs_sync_step_2: (data: { update: Uint8Array; from: string }) => void;
  yjs_update: (data: { update: Uint8Array; from: string }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  toggle_media: (data: { roomId: string; type: 'mic' | 'cam'; enabled: boolean }) => void;
  timer_start: (data: { roomId: string; duration: number; mode: 'FOCUS' | 'BREAK' }) => void;
  timer_pause: (data: { roomId: string }) => void;
  timer_reset: (data: { roomId: string }) => void;
  send_message: (data: { roomId: string; message: string }) => void;
  typing_start: (data: { roomId: string }) => void;
  typing_stop: (data: { roomId: string }) => void;
  cursor_move: (data: { roomId: string; line: number; column: number; color?: string }) => void;
  yjs_sync_step_1: (data: { roomId: string; stateVector: Uint8Array }) => void;
  yjs_sync_step_2: (data: { roomId: string; update: Uint8Array }) => void;
  yjs_update: (data: { roomId: string; update: Uint8Array }) => void;
}

export interface SocketData {
  userId: number;
  email: string;
}
