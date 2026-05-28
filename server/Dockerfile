#FROM node:20-alpine AS builder
#WORKDIR /usr/src/app
#COPY package*.json ./
#COPY prisma ./prisma/
#RUN npm ci
#RUN npx prisma generate
#COPY . .
#RUN npm run build
#
#FROM node:20-alpine AS runner
#WORKDIR /usr/src/app
#ENV NODE_ENV=production
##COPY package*.json ./
##RUN npm ci --only=production
##COPY --from=builder /usr/src/app/dist ./dist
##COPY --from=builder /usr/src/app/prisma ./prisma
##COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
##COPY --from=builder /usr/src/app/prisma.config.ts ./
##
##EXPOSE 5000
##
##CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
##CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
##CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/server.js"]
#
## 1. Copy package configs
#COPY package*.json ./
#
## 2. Copy the ENTIRE compiled node_modules from the builder (Fixes the browser bug!)
#COPY --from=builder /usr/src/app/node_modules ./node_modules
#
## 3. Copy our compiled code and config files
#COPY --from=builder /usr/src/app/dist ./dist
#COPY --from=builder /usr/src/app/prisma ./prisma
#COPY --from=builder /usr/src/app/prisma.config.ts ./
#
#EXPOSE 5000
#
#CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# ⚡ COPY EVERYTHING FIRST
COPY . .

# ⚡ THEN GENERATE PRISMA (This prevents your local files from overwriting the Linux binaries!)
RUN npx prisma generate

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# 1. Copy package configs
COPY package*.json ./

# 2. Copy the ENTIRE compiled node_modules from the builder
COPY --from=builder /usr/src/app/node_modules ./node_modules

# 3. Copy our compiled code and config files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./

EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/server.js"]
