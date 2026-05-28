# Study Room Server

Express, TypeScript, PostgreSQL, Prisma 7, and Judge0 power the backend for Study Room. The server exposes auth, practice problem, and browser code execution APIs.

## Quick Start

Run the API and PostgreSQL:

```bash
docker compose up -d --build
```

Run the API, PostgreSQL, and Judge0 code runner:

```bash
docker compose --profile judge0 up -d --build
```

Run the backend smoke suite inside Docker:

```bash
docker compose exec api node dist/test-db.js
```

Run locally against a local PostgreSQL database:

```bash
npm install
npm run build
npm run db:push
npm run test:db
```

## Project Structure

```text
server/
  Dockerfile                  # API image build
  docker-compose.yml          # API, app DB, and optional Judge0 stack
  judge0.conf                 # Judge0 database and Redis config
  prisma/
    schema.prisma             # Prisma models and table mappings
    seed.ts                   # Optional seed entry
  src/
    app.ts                    # Express app and route mounting
    server.ts                 # Server bootstrap
    config/database.ts        # Prisma client with pg adapter
    middleware/               # Auth and error middleware
    modules/
      auth/                   # Register, login, profile routes
      practice/               # Problems CRUD routes
      codeExecution/          # Judge0 proxy routes
    test-db.ts                # Backend smoke suite
```

Generated files in `dist/` are ignored by git. Build them with `npm run build`.

## Existing APIs

Health:

```http
GET /health
```

Auth:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

Practice problems:

```http
GET    /api/problems
GET    /api/problems/:id
POST   /api/problems
PUT    /api/problems/:id
DELETE /api/problems/:id
```

Code execution:

```http
GET  /api/code/languages
POST /api/code/run
```

Example `POST /api/code/run` body:

```json
{
  "sourceCode": "console.log('Hello World')",
  "languageId": 63,
  "stdin": ""
}
```

## Add A New Feature API

Create one folder per feature inside `src/modules`.

```text
src/modules/example/
  exampleRoutes.ts
  exampleController.ts
  exampleModel.ts
```

1. Add data access in `exampleModel.ts`. Import the shared Prisma client from `../../config/database.js`.
2. Add request handlers in `exampleController.ts`. Validate required fields and return JSON responses.
3. Add routes in `exampleRoutes.ts` with an Express router.
4. Mount the router in `src/app.ts`.
5. If the feature needs tables, update `prisma/schema.prisma`.
6. Run `npm run build` and `npm run test:db`.

Minimal route example:

```ts
import express from 'express';
import { getExamples } from './exampleController.js';

const router = express.Router();

router.get('/', getExamples);

export default router;
```

Mount it in `src/app.ts`:

```ts
import exampleRoutes from './modules/example/exampleRoutes.js';

app.use('/api/examples', exampleRoutes);
```

## Database Workflow

For the current development Docker workflow, schema sync happens automatically when the API container starts:

```bash
npm run db:push
```

When the schema changes locally:

```bash
npm run db:push
npm run build
```

Use migrations before production deployment:

```bash
npx prisma migrate dev --name your_change_name
```

## Judge0 Notes

Judge0 runs only when the `judge0` Compose profile is enabled. The API talks to Judge0 through:

```text
JUDGE0_URL=http://judge0-server:2358
```

The frontend should call this server API instead of calling Judge0 directly:

```http
POST /api/code/run
```

For JavaScript on Judge0, use `languageId: 63`.

## Git Workflow

Commit your feature branch:

```bash
git status
git add .
git commit -m "Add backend database and code execution APIs"
git push origin feature/database-setup
```

Merge to main through GitHub:

1. Push the feature branch.
2. Open a pull request from `feature/database-setup` into `main`.
3. Wait for checks and review.
4. Merge the pull request.

Merge locally if your team allows direct pushes:

```bash
git fetch originsudo docker compose exec api node dist/test-db.js
git checkout main
git pull origin main
git merge feature/database-setup
git push origin main
```
