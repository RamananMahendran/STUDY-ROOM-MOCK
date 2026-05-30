import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redis.on('error', (err: Error) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Connected'));

interface RoomState {
  status: 'IDLE' | 'FOCUS' | 'BREAK' | 'PAUSED' | 'MOCK_INTERVIEW';
  mode: 'solo' | 'pair' | 'study' | 'mock_interview';
  timerEndTime?: number;
  remainingTime?: number;
  activeProblemId?: string;
  maxCapacity: number;
  isPublic: boolean;
  joinCode: string;
  createdAt: number;
}

export const setRoomState = async (roomId: string, state: Partial<RoomState>): Promise<void> => {
  await redis.hmset(`room:${roomId}`, state as any);
};

export const getRoomState = async (roomId: string): Promise<RoomState | null> => {
  const data = await redis.hgetall(`room:${roomId}`);
  if (!data || Object.keys(data).length === 0) return null;
  
  return {
    status: data.status as RoomState['status'],
    mode: data.mode as RoomState['mode'],
    timerEndTime: data.timerEndTime ? parseInt(data.timerEndTime) : undefined,
    remainingTime: data.remainingTime ? parseInt(data.remainingTime) : undefined,
    activeProblemId: data.activeProblemId,
    maxCapacity: parseInt(data.maxCapacity || '10'),
    isPublic: data.isPublic === 'true',
    joinCode: data.joinCode,
    createdAt: parseInt(data.createdAt),
  };
};

export const addUserToRoom = async (roomId: string, userId: string): Promise<void> => {
  await redis.sadd(`room:${roomId}:users`, userId);
};

export const removeUserFromRoom = async (roomId: string, userId: string): Promise<void> => {
  await redis.srem(`room:${roomId}:users`, userId);
};

export const getRoomUsers = async (roomId: string): Promise<string[]> => {
  return await redis.smembers(`room:${roomId}:users`);
};

export const mapSocketToUser = async (socketId: string, userId: string): Promise<void> => {
  await redis.setex(`socket:${socketId}`, 3600, userId);
};

export const getUserIdBySocket = async (socketId: string): Promise<string | null> => {
  return await redis.get(`socket:${socketId}`);
};

export const deleteSocketMapping = async (socketId: string): Promise<void> => {
  await redis.del(`socket:${socketId}`);
};

export const getAllActiveRooms = async (): Promise<string[]> => {
  const keys = await redis.keys('room:*:users');
  return keys.map((key: string) => key.split(':')[1]);
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  await redis.del(`room:${roomId}`, `room:${roomId}:users`);
};

export const enforceRoomCapacity = async (roomId: string): Promise<boolean> => {
  const state = await getRoomState(roomId);
  if (!state) return false;
  
  const users = await getRoomUsers(roomId);
  return users.length < state.maxCapacity;
};

export const setUserMediaState = async (roomId: string, userId: string, micOn: boolean, camOn: boolean): Promise<void> => {
  await redis.hset(`room:${roomId}:media:${userId}`, { micOn: micOn.toString(), camOn: camOn.toString() });
};

export const getUserMediaState = async (roomId: string, userId: string): Promise<{ micOn: boolean; camOn: boolean } | null> => {
  const data = await redis.hgetall(`room:${roomId}:media:${userId}`);
  if (!data || Object.keys(data).length === 0) return null;
  
  return {
    micOn: data.micOn === 'true',
    camOn: data.camOn === 'true',
  };
};

export const addTypingUser = async (roomId: string, userId: string): Promise<void> => {
  await redis.setex(`room:${roomId}:typing:${userId}`, 3, '1');
};

export const getTypingUsers = async (roomId: string): Promise<string[]> => {
  const keys = await redis.keys(`room:${roomId}:typing:*`);
  return keys.map((key: string) => key.split(':')[3]);
};

export default redis;
