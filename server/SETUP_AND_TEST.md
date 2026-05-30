# Real-Time Engine Setup & Testing Guide

## Prerequisites

- Node.js 18+
- Redis server
- PostgreSQL database

## 1. Install Dependencies

```bash
cd server
npm install ioredis @socket.io/redis-adapter yjs y-protocols
```

## 2. Start Redis

### Option A: Docker
```bash
docker-compose -f docker-compose.redis.yml up -d
```

### Option B: Local
```bash
redis-server
```

Verify:
```bash
redis-cli ping
```

## 3. Configure Environment

```bash
copy .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/studyroom
JWT_SECRET=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
CLIENT_URL=http://localhost:5173
```

## 4. Database Setup

```bash
npm run db:push
```

## 5. Build & Run

```bash
npm run build
npm start
```

## 6. Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Room
```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"solo\",\"isPublic\":true,\"maxCapacity\":5}"
```

### List Rooms
```bash
curl http://localhost:3000/api/rooms
curl "http://localhost:3000/api/rooms?mode=solo"
```

### WebSocket Test

Create `test-client.js`:
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  
  socket.emit('join_room', 'test-room-id');
});

socket.on('room_state', (data) => {
  console.log('Room state:', data);
});

socket.on('room_error', (data) => {
  console.log('Room error:', data);
});

socket.on('timer_complete', (data) => {
  console.log('Timer completed:', data);
});

socket.on('active_problem_sync', (data) => {
  console.log('Problem changed:', data);
});

socket.on('ping', () => {
  socket.emit('pong');
});

setTimeout(() => {
  socket.emit('timer_start', {
    roomId: 'test-room-id',
    duration: 5000,
    type: 'FOCUS'
  });
}, 2000);
```

Run:
```bash
node test-client.js
```

## Features Implemented

### Phase 1: Server Infrastructure ✅
- Custom HTTP + Socket.io server
- Redis adapter for scaling
- JWT authentication
- Ping/pong heartbeat

### Phase 2: Redis Service ✅
- Room state with all fields (status, mode, timerEndTime, activeProblemId, maxCapacity)
- User presence tracking
- Room capacity enforcement
- Media state tracking
- Typing users with TTL

### Phase 3: Socket Handlers ✅

**Presence:**
- join_room with capacity check
- leave_room
- disconnect cleanup
- toggle_media with state persistence

**Timer:**
- timer_start with server-side completion
- timer_pause
- timer_reset
- timer_complete event
- Analytics stub (recordSessionToDatabase)

**Collaboration:**
- problem_changed with sync
- cursor_move (volatile)
- Yjs sync (step 1, 2, update)

**Chat:**
- send_message with persistence stub
- typing_start with 3s TTL
- typing_stop

### Phase 4: REST API ✅
- GET /api/rooms with ?mode filter
- POST /api/rooms with all modes and maxCapacity

## Event Reference

### Client → Server
- `join_room(roomId)`
- `leave_room(roomId)`
- `toggle_media({ roomId, type, enabled })`
- `timer_start({ roomId, duration, type })`
- `timer_pause({ roomId })`
- `timer_reset({ roomId })`
- `problem_changed({ roomId, problemId })`
- `cursor_move({ roomId, line, column })`
- `send_message({ roomId, message })`
- `typing_start({ roomId })`
- `ping()`

### Server → Client
- `room_state({ roomId, state, users })`
- `room_error({ message })`
- `user_joined({ userId, socketId })`
- `user_left({ userId, socketId })`
- `media_state_changed({ userId, micOn, camOn })`
- `timer_sync({ state, endTime, duration, remainingTime })`
- `timer_complete({ type, duration })`
- `active_problem_sync({ problemId, changedBy })`
- `cursor_update({ userId, line, column, color })`
- `new_message({ userId, message, timestamp })`
- `typing_indicator({ userId, isTyping })`
- `pong()`

## Troubleshooting

### Redis Connection Error
```
Error: connect ECONNREFUSED
```
**Fix:** Start Redis server

### Auth Error
```
Authentication error: Invalid token
```
**Fix:** Check JWT_SECRET matches auth service

### Room Full Error
```
room_error: Room is full
```
**Expected:** maxCapacity enforced

### Timer Not Completing
**Check:** Server logs for setTimeout execution
**Verify:** timer_complete event emitted after duration

## Production Checklist

- [ ] Strong JWT_SECRET
- [ ] Redis password set
- [ ] CORS restricted
- [ ] Rate limiting added
- [ ] Monitoring setup
- [ ] Load testing done
- [ ] Database backups configured
