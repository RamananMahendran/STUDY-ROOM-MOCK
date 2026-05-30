# Real-Time Engine Quick Reference

## Installation (One Command)

```bash
# Windows
install-realtime.bat

# Manual
npm install ioredis @socket.io/redis-adapter yjs y-protocols
```

## Start Redis

```bash
docker-compose -f docker-compose.redis.yml up -d
```

## Configure & Run

```bash
copy .env.example .env
# Edit .env
npm run build
npm start
```

## WebSocket Events Reference

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `roomId: string` | Join a room |
| `leave_room` | `roomId: string` | Leave a room |
| `toggle_media` | `{ roomId, type: 'mic'\|'cam', enabled }` | Toggle media |
| `timer_start` | `{ roomId, duration, mode: 'FOCUS'\|'BREAK' }` | Start timer |
| `timer_pause` | `{ roomId }` | Pause timer |
| `timer_reset` | `{ roomId }` | Reset timer |
| `send_message` | `{ roomId, message }` | Send chat message |
| `typing_start` | `{ roomId }` | Start typing |
| `typing_stop` | `{ roomId }` | Stop typing |
| `cursor_move` | `{ roomId, line, column, color? }` | Move cursor |
| `yjs_sync_step_1` | `{ roomId, stateVector }` | Yjs sync init |
| `yjs_sync_step_2` | `{ roomId, update }` | Yjs sync response |
| `yjs_update` | `{ roomId, update }` | Yjs doc update |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `room_state` | `{ roomId, state, users }` | Current room state |
| `user_joined` | `{ userId, socketId }` | User joined |
| `user_left` | `{ userId, socketId }` | User left |
| `media_state_changed` | `{ userId, type, enabled }` | Media toggled |
| `timer_sync` | `{ state, endTime?, duration?, remainingTime? }` | Timer state |
| `new_message` | `{ userId, message, timestamp }` | New message |
| `typing_indicator` | `{ userId, isTyping }` | Typing status |
| `cursor_update` | `{ userId, line, column, color }` | Cursor moved |
| `yjs_sync_step_1` | `{ stateVector, from }` | Yjs sync request |
| `yjs_sync_step_2` | `{ update, from }` | Yjs sync response |
| `yjs_update` | `{ update, from }` | Yjs doc update |
| `error` | `{ message }` | Error occurred |

## REST API Reference

### GET `/api/rooms`
List active public rooms

**Response:**
```json
{
  "rooms": [
    {
      "roomId": "uuid",
      "mode": "solo",
      "participantCount": 3,
      "status": "FOCUS",
      "joinCode": "ABC123"
    }
  ]
}
```

### POST `/api/rooms`
Create new room (requires auth)

**Request:**
```json
{
  "mode": "solo",
  "isPublic": true
}
```

**Response:**
```json
{
  "roomId": "uuid",
  "joinCode": "ABC123",
  "mode": "solo",
  "isPublic": true
}
```

## Redis Keys

| Key Pattern | Type | Description |
|-------------|------|-------------|
| `room:{roomId}` | Hash | Room state |
| `room:{roomId}:users` | Set | Room users |
| `socket:{socketId}` | String | Socket→User map (TTL: 1h) |

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
CLIENT_URL=http://localhost:5173
```

## Client Connection Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  socket.emit('join_room', 'room-id');
});

socket.on('room_state', (data) => {
  console.log('Room:', data);
});
```

## File Structure

```
server/
├── server.ts                    # Entry point
├── src/
│   ├── app.ts                   # Express app
│   ├── services/
│   │   └── redis.service.ts     # Redis ops
│   ├── socket/
│   │   ├── index.ts             # Socket.io setup
│   │   ├── auth.middleware.ts   # JWT auth
│   │   └── handlers/
│   │       ├── presence.handler.ts
│   │       ├── timer.handler.ts
│   │       ├── chat.handler.ts
│   │       └── collaboration.handler.ts
│   └── modules/
│       └── rooms/
│           ├── roomRoutes.ts
│           └── roomController.ts
```

## Common Commands

```bash
# Build
npm run build

# Start
npm start

# Development watch
npm run dev

# Database push
npm run db:push

# Seed database
npm run seed

# Redis CLI
redis-cli ping

# Check health
curl http://localhost:3000/health
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Redis connection failed | `docker-compose -f docker-compose.redis.yml up -d` |
| Auth failed | Check JWT_SECRET matches auth service |
| Port in use | Change PORT in .env or kill process |
| TypeScript errors | `npm install --save-dev @types/node` |

## Documentation Files

- `SETUP_GUIDE.md` - Detailed setup instructions
- `REALTIME_ENGINE.md` - Complete technical documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `examples/socket-client-example.ts` - Test client

## Architecture

```
Client ←→ HTTP/WS ←→ server.ts ←→ Socket.io + Express
                                      ↓         ↓
                                   Redis   PostgreSQL
```

## Key Features

✅ JWT authentication
✅ Redis adapter for scaling
✅ Modular event handlers
✅ Pomodoro timer sync
✅ Real-time chat
✅ Cursor tracking
✅ Yjs CRDT sync
✅ Room management API
✅ Clean, DRY code
✅ Full TypeScript

## Production Checklist

- [ ] Strong JWT_SECRET
- [ ] Redis password set
- [ ] CORS restricted
- [ ] HTTPS/WSS enabled
- [ ] Rate limiting added
- [ ] Monitoring setup
- [ ] Load testing done
- [ ] Backups configured
