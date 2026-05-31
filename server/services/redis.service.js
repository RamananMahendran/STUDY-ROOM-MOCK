import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => console.error('[Redis] Client error:', err));

const ROOM_STATE_KEY   = (roomId) => `room:${roomId}:state`;
const ROOM_USERS_KEY   = (roomId) => `room:${roomId}:users`;
const SOCKET_USER_KEY  = (socketId) => `socket:${socketId}:userId`;

async function setRoomState(roomId, state) {
  await redisClient.hset(ROOM_STATE_KEY(roomId), state);
}

async function getRoomState(roomId) {
  return redisClient.hgetall(ROOM_STATE_KEY(roomId));
}

async function deleteRoomState(roomId) {
  await redisClient.del(ROOM_STATE_KEY(roomId));
}

async function addUserToRoom(roomId, userId) {
  await redisClient.sadd(ROOM_USERS_KEY(roomId), userId);
}

async function removeUserFromRoom(roomId, userId) {
  await redisClient.srem(ROOM_USERS_KEY(roomId), userId);
}

async function getRoomUsers(roomId) {
  return redisClient.smembers(ROOM_USERS_KEY(roomId));
}

async function mapSocketToUser(socketId, userId) {
  await redisClient.set(SOCKET_USER_KEY(socketId), userId, 'EX', 86400);
}

async function getUserIdBySocket(socketId) {
  return redisClient.get(SOCKET_USER_KEY(socketId));
}

async function removeSocketMapping(socketId) {
  await redisClient.del(SOCKET_USER_KEY(socketId));
}

async function getActiveRoomIds() {
  const roomIds = [];
  let cursor = '0';

  do {
    const [nextCursor, keys] = await redisClient.scan(
      cursor,
      'MATCH', 'room:*:state',
      'COUNT', 100
    );
    cursor = nextCursor;
    keys.forEach((k) => roomIds.push(k.split(':')[1]));
  } while (cursor !== '0');

  return roomIds;
}

export default redisClient;

export {
  setRoomState,
  getRoomState,
  deleteRoomState,
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
  mapSocketToUser,
  getUserIdBySocket,
  removeSocketMapping,
  getActiveRoomIds,
};
