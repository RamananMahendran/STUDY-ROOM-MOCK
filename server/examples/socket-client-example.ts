import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';
const JWT_TOKEN = 'your-jwt-token-here';

const socket: Socket = io(SERVER_URL, {
  auth: { token: JWT_TOKEN },
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
  
  socket.emit('join_room', 'test-room-id');
});

socket.on('room_state', (data) => {
  console.log('📊 Room State:', data);
});

socket.on('user_joined', (data) => {
  console.log('👋 User Joined:', data);
});

socket.on('user_left', (data) => {
  console.log('👋 User Left:', data);
});

socket.on('timer_sync', (data) => {
  console.log('⏱️  Timer Sync:', data);
});

socket.on('new_message', (data) => {
  console.log('💬 New Message:', data);
});

socket.on('cursor_update', (data) => {
  console.log('🖱️  Cursor Update:', data);
});

socket.on('error', (data) => {
  console.error('❌ Error:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

setTimeout(() => {
  console.log('📤 Sending test message...');
  socket.emit('send_message', {
    roomId: 'test-room-id',
    message: 'Hello from test client!',
  });
}, 2000);

setTimeout(() => {
  console.log('⏱️  Starting timer...');
  socket.emit('timer_start', {
    roomId: 'test-room-id',
    duration: 25 * 60 * 1000,
    mode: 'FOCUS',
  });
}, 4000);

setTimeout(() => {
  console.log('👋 Leaving room...');
  socket.emit('leave_room', 'test-room-id');
  socket.disconnect();
}, 10000);
