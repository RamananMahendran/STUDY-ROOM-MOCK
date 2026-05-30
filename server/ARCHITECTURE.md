# Real-Time Engine Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React UI   │  │  Socket.io   │  │  HTTP Client │         │
│  │              │  │    Client    │  │   (Axios)    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          │ WebSocket       │ WebSocket        │ HTTP/REST
          │ Events          │ Events           │ API Calls
          │                 │                  │
┌─────────▼─────────────────▼──────────────────▼──────────────────┐
│                      SERVER LAYER                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      server.ts                           │  │
│  │              (HTTP Server + Socket.io)                   │  │
│  └────────────────┬─────────────────────┬───────────────────┘  │
│                   │                     │                       │
│         ┌─────────▼─────────┐  ┌────────▼────────┐             │
│         │   Express App     │  │  Socket.io      │             │
│         │    (app.ts)       │  │   Server        │             │
│         └─────────┬─────────┘  └────────┬────────┘             │
│                   │                     │                       │
│         ┌─────────▼─────────┐  ┌────────▼────────┐             │
│         │   REST Routes     │  │  Auth Middleware│             │
│         │  /api/rooms       │  │  (JWT Verify)   │             │
│         └─────────┬─────────┘  └────────┬────────┘             │
│                   │                     │                       │
│         ┌─────────▼─────────┐  ┌────────▼────────────────────┐ │
│         │ Room Controller   │  │   Event Handlers            │ │
│         │  - getRooms()     │  │  ┌──────────────────────┐  │ │
│         │  - createRoom()   │  │  │ presence.handler.ts  │  │ │
│         └─────────┬─────────┘  │  │ timer.handler.ts     │  │ │
│                   │             │  │ chat.handler.ts      │  │ │
│                   │             │  │ collaboration.handler│  │ │
│                   │             │  └──────────────────────┘  │ │
│                   │             └────────┬───────────────────┘ │
│                   │                      │                     │
│         ┌─────────▼──────────────────────▼───────────────────┐ │
│         │          Redis Service Layer                       │ │
│         │           (redis.service.ts)                       │ │
│         │  - setRoomState()    - getRoomUsers()             │ │
│         │  - getRoomState()    - mapSocketToUser()          │ │
│         │  - addUserToRoom()   - getUserIdBySocket()        │ │
│         └────────────────────┬───────────────────────────────┘ │
│                              │                                 │
└──────────────────────────────┼─────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
       ┌────────▼────────┐          ┌────────▼────────┐
       │     Redis       │          │   PostgreSQL    │
       │   (ioredis)     │          │    (Prisma)     │
       └─────────────────┘          └─────────────────┘
       │                            │
       │ Real-time State            │ Persistent Data
       │ - Room state               │ - Users
       │ - Active users             │ - Rooms
       │ - Socket mappings          │ - Messages
       │ - Pub/Sub                  │ - Problems
```

## Data Flow Diagrams

### 1. User Joins Room

```
┌────────┐         ┌────────┐         ┌───────┐         ┌──────────┐
│ Client │         │ Server │         │ Redis │         │   Room   │
└───┬────┘         └───┬────┘         └───┬───┘         └────┬─────┘
    │                  │                  │                   │
    │ join_room(id)    │                  │                   │
    ├─────────────────>│                  │                   │
    │                  │                  │                   │
    │                  │ socket.join(id)  │                   │
    │                  ├──────────────────┼──────────────────>│
    │                  │                  │                   │
    │                  │ addUserToRoom()  │                   │
    │                  ├─────────────────>│                   │
    │                  │                  │                   │
    │                  │ getRoomState()   │                   │
    │                  ├─────────────────>│                   │
    │                  │<─────────────────┤                   │
    │                  │                  │                   │
    │                  │ getRoomUsers()   │                   │
    │                  ├─────────────────>│                   │
    │                  │<─────────────────┤                   │
    │                  │                  │                   │
    │ room_state       │                  │                   │
    │<─────────────────┤                  │                   │
    │                  │                  │                   │
    │                  │ user_joined (broadcast)              │
    │                  ├──────────────────┼──────────────────>│
    │<─────────────────┼──────────────────┼───────────────────┤
    │                  │                  │                   │
```

### 2. Timer Start Flow

```
┌────────┐         ┌────────┐         ┌───────┐         ┌──────────┐
│ Client │         │ Server │         │ Redis │         │   Room   │
└───┬────┘         └───┬────┘         └───┬───┘         └────┬─────┘
    │                  │                  │                   │
    │ timer_start      │                  │                   │
    │ {duration,mode}  │                  │                   │
    ├─────────────────>│                  │                   │
    │                  │                  │                   │
    │                  │ Calculate        │                   │
    │                  │ endTime =        │                   │
    │                  │ now + duration   │                   │
    │                  │                  │                   │
    │                  │ setRoomState()   │                   │
    │                  │ {status,endTime} │                   │
    │                  ├─────────────────>│                   │
    │                  │                  │                   │
    │                  │ timer_sync (broadcast to room)       │
    │                  ├──────────────────┼──────────────────>│
    │<─────────────────┼──────────────────┼───────────────────┤
    │ {state,endTime}  │                  │                   │
    │                  │                  │                   │
```

### 3. Chat Message Flow

```
┌────────┐    ┌────────┐    ┌───────┐    ┌──────────┐    ┌──────────┐
│ Client │    │ Server │    │ Redis │    │   Room   │    │PostgreSQL│
└───┬────┘    └───┬────┘    └───┬───┘    └────┬─────┘    └────┬─────┘
    │             │             │              │               │
    │send_message │             │              │               │
    │{roomId,msg} │             │              │               │
    ├────────────>│             │              │               │
    │             │             │              │               │
    │             │ Add server  │              │               │
    │             │ timestamp   │              │               │
    │             │             │              │               │
    │             │ new_message (broadcast)    │               │
    │             ├─────────────┼─────────────>│               │
    │<────────────┼─────────────┼──────────────┤               │
    │             │             │              │               │
    │             │ persistMessage()            │               │
    │             ├─────────────┼──────────────┼──────────────>│
    │             │             │              │               │
    │             │             │              │  INSERT INTO  │
    │             │             │              │  chat_messages│
    │             │             │              │               │
```

### 4. Cursor Collaboration Flow

```
┌─────────┐      ┌────────┐      ┌──────────┐      ┌─────────┐
│Client A │      │ Server │      │  Room    │      │Client B │
└────┬────┘      └───┬────┘      └────┬─────┘      └────┬────┘
     │               │                │                  │
     │cursor_move    │                │                  │
     │{line,column}  │                │                  │
     ├──────────────>│                │                  │
     │               │                │                  │
     │               │ volatile.emit  │                  │
     │               │ cursor_update  │                  │
     │               ├───────────────>│                  │
     │               │                │ cursor_update    │
     │               │                ├─────────────────>│
     │               │                │                  │
     │               │                │  (High frequency,│
     │               │                │   unqueued)      │
```

## Component Interaction Matrix

| Component | Interacts With | Purpose |
|-----------|----------------|---------|
| `server.ts` | HTTP Server, Socket.io, Express | Entry point, server initialization |
| `app.ts` | Express routes, middleware | REST API setup |
| `socket/index.ts` | Socket.io, Redis, Handlers | WebSocket server setup |
| `auth.middleware.ts` | JWT, Socket.io | Authentication |
| `presence.handler.ts` | Socket.io, Redis Service | Join/leave/media events |
| `timer.handler.ts` | Socket.io, Redis Service | Timer synchronization |
| `chat.handler.ts` | Socket.io, Redis, Prisma | Chat messaging |
| `collaboration.handler.ts` | Socket.io | Cursor & Yjs sync |
| `redis.service.ts` | ioredis | Redis operations |
| `roomController.ts` | Prisma, Redis Service | Room CRUD |

## Redis Data Model

```
Redis Database
│
├── room:{uuid}                    [Hash]
│   ├── status: "IDLE|FOCUS|BREAK|PAUSED"
│   ├── mode: "solo|pair"
│   ├── timerEndTime: timestamp
│   ├── remainingTime: milliseconds
│   ├── isPublic: "true|false"
│   ├── joinCode: "ABC123"
│   └── createdAt: timestamp
│
├── room:{uuid}:users              [Set]
│   ├── "userId1"
│   ├── "userId2"
│   └── "userId3"
│
└── socket:{socketId}              [String, TTL: 3600s]
    └── "userId"
```

## PostgreSQL Data Model (Relevant Tables)

```
PostgreSQL Database
│
├── users
│   ├── id (PK)
│   ├── email
│   ├── name
│   └── ...
│
├── study_rooms
│   ├── id (PK)
│   ├── name
│   ├── slug
│   ├── owner_id (FK → users)
│   ├── is_private
│   └── room_type
│
├── room_members
│   ├── id (PK)
│   ├── room_id (FK → study_rooms)
│   ├── user_id (FK → users)
│   ├── is_online
│   └── socket_id
│
└── chat_messages
    ├── id (PK)
    ├── room_id (FK → study_rooms)
    ├── user_id (FK → users)
    ├── message
    └── created_at
```

## Event Handler Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                    Event Handlers                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ presence.handler.ts                                  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • join_room      → Add to room, broadcast join       │  │
│  │ • leave_room     → Remove from room, broadcast leave │  │
│  │ • disconnect     → Cleanup all rooms                 │  │
│  │ • toggle_media   → Broadcast media state             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ timer.handler.ts                                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • timer_start    → Calculate end, broadcast sync     │  │
│  │ • timer_pause    → Calculate remaining, broadcast    │  │
│  │ • timer_reset    → Clear state, broadcast idle       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ chat.handler.ts                                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • send_message   → Timestamp, broadcast, persist     │  │
│  │ • typing_start   → Broadcast typing indicator        │  │
│  │ • typing_stop    → Broadcast stop typing             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ collaboration.handler.ts                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • cursor_move    → Volatile broadcast cursor         │  │
│  │ • yjs_sync_step_1→ Forward state vector              │  │
│  │ • yjs_sync_step_2→ Forward update                    │  │
│  │ • yjs_update     → Forward document update           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Scaling Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
│                    (Optional Sticky)                         │
└────────┬─────────────────┬─────────────────┬─────────────────┘
         │                 │                 │
    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
    │Server 1 │       │Server 2 │       │Server 3 │
    │Socket.io│       │Socket.io│       │Socket.io│
    └────┬────┘       └────┬────┘       └────┬────┘
         │                 │                 │
         └─────────┬───────┴─────────┬───────┘
                   │                 │
              ┌────▼────┐       ┌────▼────┐
              │  Redis  │       │PostgreSQL│
              │ Pub/Sub │       │          │
              └─────────┘       └──────────┘
```

**Key Points:**
- Redis adapter synchronizes events across all server instances
- Each server can handle different clients in the same room
- Shared state via Redis ensures consistency
- No sticky sessions required (but can optimize)

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Connection Authentication                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • JWT token verification on connect                   │ │
│  │ • Token from auth.token or Authorization header       │ │
│  │ • Reject invalid/expired tokens                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Layer 2: CORS Protection                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • Restrict origin to CLIENT_URL                       │ │
│  │ • Credentials: true for cookies                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Layer 3: Event Authorization                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • socket.data.userId attached after auth              │ │
│  │ • All events use authenticated userId                 │ │
│  │ • No client-provided userId accepted                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Layer 4: Input Validation                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • Try-catch blocks in all handlers                    │ │
│  │ • Error messages don't leak sensitive data            │ │
│  │ • Payload validation (future: add Zod)                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| Volatile Events | `socket.volatile.emit()` for cursors | Drops old cursor updates if client slow |
| Redis Sets | O(1) user lookups | Fast presence checks |
| Redis Hashes | Single key for room state | Atomic state updates |
| Connection Pooling | Prisma connection pool | Efficient DB access |
| Event Batching | Client-side debouncing | Reduce event frequency |
| Binary Protocol | Yjs uses Uint8Array | Efficient CRDT sync |

## Monitoring Points

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Metrics                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Server Metrics                                             │
│  • Active WebSocket connections                             │
│  • Connections per second                                   │
│  • CPU and memory usage                                     │
│  • Event loop lag                                           │
│                                                             │
│  Redis Metrics                                              │
│  • Memory usage                                             │
│  • Key count by pattern                                     │
│  • Pub/sub message rate                                     │
│  • Connection count                                         │
│                                                             │
│  Application Metrics                                        │
│  • Events per second by type                                │
│  • Room count (active/total)                                │
│  • Users per room distribution                              │
│  • Message latency (p50, p95, p99)                          │
│  • Error rate by event type                                 │
│                                                             │
│  Database Metrics                                           │
│  • Query latency                                            │
│  • Connection pool usage                                    │
│  • Failed queries                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │   Clients    │                                           │
│  └──────┬───────┘                                           │
│         │ HTTPS/WSS                                         │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │              Nginx / ALB                             │  │
│  │         (SSL Termination, Load Balancing)            │  │
│  └──────┬───────────────────────────────────────────────┘  │
│         │                                                   │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │         Node.js Instances (PM2/Docker)               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Server 1 │  │ Server 2 │  │ Server 3 │           │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘           │  │
│  └───────┼─────────────┼─────────────┼──────────────────┘  │
│          │             │             │                     │
│  ┌───────▼─────────────▼─────────────▼──────────────────┐  │
│  │              Redis Cluster                           │  │
│  │         (Master-Replica, Sentinel)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL (Primary + Replicas)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    Monitoring (Prometheus + Grafana)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime | Node.js 18+ | JavaScript runtime |
| Framework | Express 5 | REST API |
| WebSocket | Socket.io 4 | Real-time bidirectional communication |
| Cache/State | Redis (ioredis) | Real-time state, pub/sub |
| Database | PostgreSQL (Prisma) | Persistent data |
| CRDT | Yjs | Collaborative editing |
| Auth | JWT (jsonwebtoken) | Authentication |
| Language | TypeScript | Type safety |
| Scaling | @socket.io/redis-adapter | Multi-instance sync |

## Code Organization Principles

1. **Separation of Concerns**: Each handler file manages one feature domain
2. **Service Layer**: Redis operations centralized in service file
3. **DRY**: No code duplication, reusable functions
4. **Type Safety**: Full TypeScript with strict mode
5. **Error Handling**: Try-catch in all async operations
6. **Clean Code**: Self-documenting names, minimal comments
7. **Modularity**: Easy to add new event handlers
8. **Testability**: Pure functions, dependency injection ready
