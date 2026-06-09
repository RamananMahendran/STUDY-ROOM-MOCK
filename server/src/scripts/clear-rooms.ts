import prisma from '../config/database.js';
import redis from '../services/redis.service.js';

async function main() {
  try {
    const targetEmails = ['gksmh20@gmail.com', 'mayur2310574@ssn.edu.in'];

    console.log(`Finding rooms for users: ${targetEmails.join(', ')}`);

    // Find users
    const users = await prisma.user.findMany({
      where: {
        email: { in: targetEmails }
      },
      select: {
        id: true,
        email: true
      }
    });

    const userIds = users.map(u => u.id);
    console.log(`Found user IDs: ${userIds.join(', ')}`);

    if (userIds.length === 0) {
      console.log('No matching users found in DB.');
      return;
    }

    // Find rooms owned by these users
    const rooms = await prisma.studyRoom.findMany({
      where: {
        ownerId: { in: userIds }
      },
      select: {
        id: true,
        name: true
      }
    });

    console.log(`Found ${rooms.length} rooms to delete:`);
    rooms.forEach(r => console.log(` - ID: ${r.id}, Name: ${r.name}`));

    const roomIds = rooms.map(r => r.id);

    // Delete rooms from PostgreSQL
    if (roomIds.length > 0) {
      const deletedRooms = await prisma.studyRoom.deleteMany({
        where: {
          id: { in: roomIds }
        }
      });
      console.log(`Deleted ${deletedRooms.count} rooms from PostgreSQL.`);
    } else {
      console.log('No rooms found in PostgreSQL.');
    }

    // Deleting from Redis
    console.log('Cleaning up Redis keys...');
    const allRedisKeys = await redis.keys('room:*');
    
    for (const key of allRedisKeys) {
      const parts = key.split(':');
      const roomId = parts[1];
      if (!roomId) continue;

      let shouldDelete = roomIds.includes(roomId);
      if (!shouldDelete && parts.length === 2) {
        // If key is exactly 'room:roomId', check the hash data
        const state = await redis.hgetall(key);
        if (state && state.ownerId) {
          const ownerId = parseInt(state.ownerId, 10);
          if (userIds.includes(ownerId)) {
            shouldDelete = true;
          }
        }
      }

      if (shouldDelete) {
        console.log(`Deleting Redis key: ${key}`);
        await redis.del(key);
      }
    }

    console.log('Clean up completed successfully.');

  } catch (error: any) {
    console.error('Error clearing rooms:', error);
  } finally {
    await prisma.$disconnect();
    redis.disconnect();
  }
}

main();
