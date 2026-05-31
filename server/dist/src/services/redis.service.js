import { Redis } from 'ioredis';
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => Math.min(times * 50, 2000),
});
redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Connected'));
export const setRoomState = async (roomId, state) => {
    await redis.hmset(`room:${roomId}`, state);
};
export const getRoomState = async (roomId) => {
    const data = await redis.hgetall(`room:${roomId}`);
    if (!data || Object.keys(data).length === 0)
        return null;
    return {
        status: data.status,
        mode: data.mode,
        timerEndTime: data.timerEndTime ? parseInt(data.timerEndTime) : undefined,
        remainingTime: data.remainingTime ? parseInt(data.remainingTime) : undefined,
        activeProblemId: data.activeProblemId,
        maxCapacity: parseInt(data.maxCapacity || '10'),
        isPublic: data.isPublic === 'true',
        joinCode: data.joinCode,
        createdAt: parseInt(data.createdAt),
    };
};
export const addUserToRoom = async (roomId, userId) => {
    await redis.sadd(`room:${roomId}:users`, userId);
};
export const removeUserFromRoom = async (roomId, userId) => {
    await redis.srem(`room:${roomId}:users`, userId);
};
export const getRoomUsers = async (roomId) => {
    return await redis.smembers(`room:${roomId}:users`);
};
export const mapSocketToUser = async (socketId, userId) => {
    await redis.setex(`socket:${socketId}`, 3600, userId);
};
export const getUserIdBySocket = async (socketId) => {
    return await redis.get(`socket:${socketId}`);
};
export const deleteSocketMapping = async (socketId) => {
    await redis.del(`socket:${socketId}`);
};
export const getAllActiveRooms = async () => {
    const keys = await redis.keys('room:*:users');
    return keys.map((key) => key.split(':')[1]);
};
export const deleteRoom = async (roomId) => {
    await redis.del(`room:${roomId}`, `room:${roomId}:users`);
};
export const enforceRoomCapacity = async (roomId) => {
    const state = await getRoomState(roomId);
    if (!state)
        return false;
    const users = await getRoomUsers(roomId);
    return users.length < state.maxCapacity;
};
export const setUserMediaState = async (roomId, userId, micOn, camOn) => {
    await redis.hset(`room:${roomId}:media:${userId}`, { micOn: micOn.toString(), camOn: camOn.toString() });
};
export const getUserMediaState = async (roomId, userId) => {
    const data = await redis.hgetall(`room:${roomId}:media:${userId}`);
    if (!data || Object.keys(data).length === 0)
        return null;
    return {
        micOn: data.micOn === 'true',
        camOn: data.camOn === 'true',
    };
};
export const addTypingUser = async (roomId, userId) => {
    await redis.setex(`room:${roomId}:typing:${userId}`, 3, '1');
};
export const getTypingUsers = async (roomId) => {
    const keys = await redis.keys(`room:${roomId}:typing:*`);
    return keys.map((key) => key.split(':')[3]);
};
export default redis;
