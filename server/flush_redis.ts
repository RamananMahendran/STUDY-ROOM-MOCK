import { Redis } from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

async function main() {
  console.log('Flushing all data from Redis...');
  await redis.flushall();
  console.log('Redis flushed successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
