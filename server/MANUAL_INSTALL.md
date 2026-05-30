# Manual Installation Guide

## Issue: NPM Certificate Error

If you encounter certificate errors, try these solutions:

### Solution 1: Disable SSL Verification (Temporary)
```bash
npm config set strict-ssl false
npm install ioredis yjs y-protocols
npm install @socket.io/redis-adapter
npm config set strict-ssl true
```

### Solution 2: Use System CA
```bash
npm config set cafile "C:\path\to\your\ca-bundle.crt"
```

### Solution 3: Update NPM
```bash
npm install -g npm@latest
```

### Solution 4: Clear NPM Cache
```bash
npm cache clean --force
npm install ioredis yjs y-protocols
npm install @socket.io/redis-adapter
```

## Required Dependencies

Add these to your `package.json` dependencies:

```json
{
  "dependencies": {
    "ioredis": "^5.3.2",
    "@socket.io/redis-adapter": "^8.2.1",
    "yjs": "^13.6.10",
    "y-protocols": "^1.0.6"
  }
}
```

Then run:
```bash
npm install
```

## Alternative: Yarn

If npm continues to fail:

```bash
npm install -g yarn
yarn add ioredis @socket.io/redis-adapter yjs y-protocols
```

## Verify Installation

```bash
npm list ioredis
npm list @socket.io/redis-adapter
npm list yjs
npm list y-protocols
```

## After Installation

1. **Start Redis:**
   ```bash
   docker-compose -f docker-compose.redis.yml up -d
   ```

2. **Configure .env:**
   ```bash
   copy .env.example .env
   ```
   Edit with your values.

3. **Build:**
   ```bash
   npm run build
   ```

4. **Run:**
   ```bash
   npm start
   ```

## Test Installation

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 0.123,
  "environment": "development"
}
```
