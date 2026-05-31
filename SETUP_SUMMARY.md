# Study Room Server - Setup Summary

## ✅ Completed Steps

### 1. Dependencies Installed
All Node.js dependencies have been installed via `npm install`. The following key packages are now available:

**Core Framework:**
- `express@5.2.1` - Web framework
- `typescript@6.0.3` - TypeScript compiler

**Database:**
- `@prisma/client@7.8.0` - Prisma ORM client
- `@prisma/adapter-pg@7.8.0` - PostgreSQL adapter for Prisma
- `pg@8.21.0` - PostgreSQL native client

**Authentication & Security:**
- `bcryptjs@2.4.3` - Password hashing
- `jsonwebtoken@9.0.2` - JWT authentication
- `uuid@14.0.0` - UUID generation

**Real-time Communication:**
- `socket.io@4.8.3` - WebSocket server
- `socket.io-client@4.8.3` - WebSocket client

**Utilities:**
- `cors@2.8.6` - CORS middleware
- `dotenv@17.4.2` - Environment configuration

**Dev Dependencies:**
- TypeScript type definitions for all packages
- `nodemon@3.1.14` - Development auto-reload
- `ts-node@10.9.2` - TypeScript execution
- `prisma@7.8.0` - Prisma CLI tools

Total: 277 packages installed (3 moderate security vulnerabilities noted - run `npm audit fix` if needed)

### 2. Environment Configuration
Created `.env` file with database connection settings:
```
DATABASE_URL=postgresql://studyadmin:studypass123@localhost:5432/studyroom_db?schema=public
NODE_ENV=development
PORT=5000
JUDGE0_URL=http://localhost:2358
JUDGE0_AUTH_TOKEN=
```

### 3. TypeScript Build
Successfully compiled all TypeScript source files to JavaScript in the `dist/` directory.

## 📊 Database Schema Overview

The Prisma schema defines 5 main modules:

### Module 1: Authentication & Gamification (BE1)
- `users` - User accounts, profiles, roles, streak tracking
- `oauth_accounts` - OAuth provider integrations
- `subscriptions` - Pro/subscription management
- `badges` - Achievement badges
- `user_badges` - User badge assignments
- `friendships` - User connections and friend requests

### Module 2: Real-time Study Rooms (BE2)
- `study_rooms` - Study room metadata
- `room_members` - Room membership and online status
- `chat_messages` - In-room messaging
- `room_tasks` - Task management in rooms
- `whiteboard_sessions` - Collaborative whiteboarding

### Module 3: Problems, Contests & Discussions (BE3)
- `problems` - Coding problems with test cases
- `submissions` - Code submissions and execution results
- `discussions` - Problem discussion threads
- `study_plans` - Structured learning paths
- `study_plan_problems` - Problems in plans
- `contests` - Coding contests
- `contest_problems` - Problems in contests
- `contest_participants` - Contest participation

### Module 4: Mock Interviews (BE3 Day 5)
- `mock_interviews` - Interview sessions
- `mock_interview_problems` - Problems in interviews
- `mock_interview_results` - Interview results and scores
- `pair_sessions` - Pair programming sessions
- `pair_cursors` - Real-time cursor positions

### Module 5: Analytics & Auditing (BE4)
- `leaderboard_entries` - Leaderboard rankings
- `analytics_events` - Event tracking
- `audit_logs` - Audit trail

## 🚀 Next Steps: Database Setup

### Option A: Docker Setup (Recommended)
```bash
# Start PostgreSQL, Redis (for Judge0), and the API
cd server
docker compose up -d --build

# Start with Judge0 code execution support
docker compose --profile judge0 up -d --build

# Create tables from Prisma schema
docker compose exec api npx prisma db push

# Run smoke tests
docker compose exec api npm run test:db
```

### Option B: Local PostgreSQL Setup
You'll need PostgreSQL 15+ installed locally:

1. **Create the database:**
   ```sql
   CREATE DATABASE studyroom_db;
   CREATE USER studyadmin WITH PASSWORD 'studypass123';
   ALTER USER studyadmin CREATEDB;
   GRANT ALL PRIVILEGES ON DATABASE studyroom_db TO studyadmin;
   ```

2. **Push Prisma schema to create tables:**
   ```bash
   npm run db:push
   ```

3. **Run smoke tests:**
   ```bash
   npm run test:db
   ```

4. **Seed database (optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run start
   # or for development with auto-reload:
   npm run dev
   ```

## 📋 Available npm Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch TypeScript and recompile on changes
- `npm start` - Start the built server
- `npm run docker:start` - Start server in Docker with ts-node
- `npm run db:push` - Sync Prisma schema with database (creates/updates tables)
- `npm run test:db` - Run backend smoke test suite
- `npm run seed` - Run database seed script

## 🔗 API Endpoints

**Health Check:**
- `GET /health`

**Authentication:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

**Practice Problems:**
- `GET /api/problems`
- `GET /api/problems/:id`
- `POST /api/problems`
- `PUT /api/problems/:id`
- `DELETE /api/problems/:id`

**Code Execution:**
- `GET /api/code/languages`
- `POST /api/code/run`

## 📁 Project Structure

```
server/
├── src/
│   ├── server.ts              # Server entry point
│   ├── app.ts                 # Express app setup
│   ├── config/
│   │   └── database.ts        # Prisma client instance
│   ├── middleware/            # Auth, error handling
│   ├── modules/
│   │   ├── auth/              # Authentication routes/controllers
│   │   ├── practice/          # Problem CRUD routes
│   │   ├── codeExecution/     # Judge0 proxy
│   │   └── [other modules]/
│   ├── socket/
│   │   └── socketServer.ts    # WebSocket real-time events
│   └── test-db.ts             # Smoke tests
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── dist/                      # Compiled JavaScript (auto-generated)
├── Dockerfile                 # API container image
├── docker-compose.yml         # Service orchestration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── .env                       # Environment variables
```

## ⚠️ Important Notes

- **Database credentials in .env are for development only.** Change before production.
- **Docker is recommended** for a quick, isolated setup without installing PostgreSQL locally.
- **Judge0 is optional** and only runs when the `judge0` profile is enabled.
- **Prisma migrations** should be used for production deployments (see README.md).
- **TypeScript source files** in `src/` are compiled to `dist/` - don't edit `dist/` directly.

## 🐛 Troubleshooting

- **Module not found errors?** Run `npm install` again
- **Prisma client issues?** Run `npx prisma generate`
- **Database connection failed?** Verify PostgreSQL is running and .env has correct DATABASE_URL
- **Port 5000 already in use?** Change PORT in .env or kill the process using that port

---

For more details, see the `README.md` file in the server directory.
