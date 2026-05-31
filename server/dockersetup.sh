# 1. Ensure the directory structure exists
mkdir -p prisma src/config src/middleware src/modules/auth src/modules/billing src/modules/rooms/services src/modules/practice src/modules/contests src/modules/interviews src/modules/infra/services

# 2. Initialize the .dockerignore structure
cat << 'EOF' > .dockerignore
node_modules
dist
.env
.git
npm-debug.log
EOF

# 3. Initialize the production multi-stage Dockerfile
cat << 'EOF' > Dockerfile
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
EOF

# 4. Initialize the Docker Compose local cluster manifest
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - PORT=5000
      - DATABASE_URL=postgresql://studyadmin:studypass123@postgres_db:5432/studyroom_db?schema=public
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      postgres_db:
        condition: service_healthy

  postgres_db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: studyadmin
      POSTGRES_PASSWORD: studypass123
      POSTGRES_DB: studyroom_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U studyadmin -d studyroom_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
EOF

# 5. Build base environment structure
touch .env src/app.ts src/server.ts src/config/database.ts