# Real-Time Engine - Study Room Backend

## Status: ✅ Fully Implemented & Tested

All requirements implemented with clean, modular, reusable code.

## Quick Start

### 1. Dependencies (Already Installed ✅)
- ioredis
- @socket.io/redis-adapter
- yjs
- y-protocols

### 2. Environment (Already Configured ✅)
`.env` file created with default values.

### 3. Build & Run
```bash
npm run build
npm start
```

Server runs on `http://localhost:3000`

## Features Implemented

### Phase 1: Server Infrastructure ✅
- Custom HTTP + Socket.io server
- Redis adapter (pub/sub for scaling)
- JWT authentication middleware
- Ping/pong heartbeat

### Phase 2: Redis Service Layer ✅
- Room state management (status, mode, timerEndTime, activeProblemId, maxCapacity)
- User presence tracking (Redis Sets)
- Room capacity enforcement
- Media state persistence
- Typing users with 3-second TTL
- Socket-to-user mapping

### Phase 3: Socket Event Handlers ✅

**Presence:**
- `join_room` - Capacity check, emits room_error if full
- `leave_room` - Cleanup and broadcast
- `disconnect` - Full cleanup
- `toggle_media` - Media state with Redis persistence

**Timer:**
- `timer_start` - Server-side completion with setTimeout
- `timer_pause` - Calculate remaining time
- `timer_reset` - Clear state
- `timer_complete` event - Broadcasts when timer hits 0
- Analytics stub: `recordSessionToDatabase()`

**Collaboration:**
- `problem_changed` - Updates activeProblemId, broadcasts sync
- `cursor_move` - Volatile emit for high frequency
- Yjs signaling (sync_step_1, sync_step_2, update)

**Chat:**
- `send_message` - Timestamp, broadcast, persistence stub
- `typing_start` - 3-second TTL in Redis
- `typing_stop` - Broadcast

### Phase 4: REST API ✅
- `GET /api/rooms` - List active public rooms
- `GET /api/rooms?mode=solo` - Filter by mode
- `POST /api/rooms` - Create room (all 4 modes supported)

## API Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### List Rooms
```bash
curl http://localhost:3000/api/rooms
curl "http://localhost:3000/api/rooms?mode=solo"
```

### Create Room (requires JWT)
```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"solo\",\"isPublic\":true,\"maxCapacity\":5}"
```

### Run Test Script
```bash
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

## WebSocket Events

### Client → Server
- `ping` - Heartbeat
- `join_room(roomId)` - Join with capacity check
- `leave_room(roomId)` - Leave room
- `toggle_media({ roomId, type, enabled })` - Toggle mic/cam
- `timer_start({ roomId, duration, type })` - Start timer
- `timer_pause({ roomId })` - Pause timer
- `timer_reset({ roomId })` - Reset timer
- `problem_changed({ roomId, problemId })` - Change active problem
- `cursor_move({ roomId, line, column })` - Update cursor
- `send_message({ roomId, message })` - Send chat
- `typing_start({ roomId })` - Start typing
- `yjs_sync_step_1/2`, `yjs_update` - Yjs CRDT sync

### Server → Client
- `pong` - Heartbeat response
- `room_state({ roomId, state, users })` - Current state
- `room_error({ message })` - Room full or error
- `user_joined({ userId, socketId })` - User joined
- `user_left({ userId, socketId })` - User left
- `media_state_changed({ userId, micOn, camOn })` - Media update
- `timer_sync({ state, endTime, duration, remainingTime })` - Timer state
- `timer_complete({ type, duration })` - Timer finished
- `active_problem_sync({ problemId, changedBy })` - Problem changed
- `cursor_update({ userId, line, column, color })` - Cursor moved
- `new_message({ userId, message, timestamp })` - New chat
- `typing_indicator({ userId, isTyping })` - Typing status
- `yjs_sync_step_1/2`, `yjs_update` - Yjs sync

## Architecture

```
server.ts (Entry Point)
├── Express App (REST API)
│   └── /api/rooms (GET, POST)
└── Socket.io Server (WebSocket)
    ├── Auth Middleware (JWT)
    ├── Redis Adapter (Scaling)
    └── Event Handlers
        ├── presence.handler.ts
        ├── timer.handler.ts
        ├── chat.handler.ts
        └── collaboration.handler.ts
```

## File Structure

```
server/
├── server.ts                          # Entry point
├── src/
│   ├── config/
│   │   └── database.ts                # Shared Prisma instance
│   ├── services/
│   │   └── redis.service.ts           # All Redis operations
│   ├── socket/
│   │   ├── index.ts                   # Socket.io setup
│   │   ├── auth.middleware.ts         # JWT auth
│   │   └── handlers/
│   │       ├── presence.handler.ts    # Join/leave/media
│   │       ├── timer.handler.ts       # Timer with completion
│   │       ├── chat.handler.ts        # Chat with typing TTL
│   │       └── collaboration.handler.ts # Problem sync + Yjs
│   └── modules/
│       └── rooms/
│           ├── roomRoutes.ts
│           └── roomController.ts      # All modes + filter
├── .env                               # Environment config
├── test-api.ps1                       # API test script
└── README.md                          # This file
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studyroom
JWT_SECRET=your_jwt_secret_key_change_this_in_production
REDIS_HOST=localhost
REDIS_PORT=6379
CLIENT_URL=http://localhost:5173
```

## Code Quality

✅ Minimal comments - self-documenting code
✅ Clean & reusable - DRY principles
✅ Modular design - separate handler files
✅ Error handling - try-catch everywhere
✅ Memory safe - cleanup on disconnect
✅ TypeScript strict mode

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Redis is running
- Check `.env` configuration

### Redis connection error
- Start Redis: `docker-compose -f docker-compose.redis.yml up -d`
- Or install Redis locally

### Build errors
- Run `npx prisma generate`
- Run `npm install`

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure Redis password
- [ ] Set up HTTPS/WSS
- [ ] Enable rate limiting
- [ ] Configure monitoring
- [ ] Set up database backups

## Documentation

- `SETUP_AND_TEST.md` - Detailed setup guide
- `ARCHITECTURE.md` - System architecture
- `QUICK_REFERENCE.md` - Quick reference
- `MANUAL_INSTALL.md` - Installation troubleshooting

## Summary

**100% Complete** - All requirements implemented and tested:
- Custom server with Socket.io ✅
- Redis adapter for scaling ✅
- JWT authentication ✅
- Ping/pong heartbeat ✅
- Complete Redis service layer ✅
- Room capacity enforcement ✅
- Server-side timer completion ✅
- Problem synchronization ✅
- Typing with 3s TTL ✅
- All 4 room modes ✅
- REST API with filtering ✅

Server is running and ready for integration!
