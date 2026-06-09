import { Request, Response } from 'express';
import prisma from '../../config/database.js';
import {
  setRoomState,
  getAllActiveRooms,
  getRoomUsers,
  getRoomState,
} from '../../services/redis.service.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mode } = req.query;
    const activeRoomIds = await getAllActiveRooms();
    const rooms = [];

    for (const roomId of activeRoomIds) {
      const state = await getRoomState(roomId);
      
      if (state && state.isPublic) {
        if (mode && state.mode !== mode) continue;
        
        const users = await getRoomUsers(roomId);
        rooms.push({
          roomId,
          mode: state.mode,
          participantCount: users.length,
          maxCapacity: state.maxCapacity,
          status: state.status,
          joinCode: state.joinCode,
          activeProblemId: state.activeProblemId,
        });
      }
    }

    res.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const createRoom = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { mode, isPublic, maxCapacity, name, focusMin, breakMin } = req.body;
    const userId = req.user?.id; // Optional

    if (!mode || !['solo', 'pair', 'study', 'mock_interview'].includes(mode)) {
      res.status(400).json({ error: 'Invalid mode. Must be "solo", "pair", "study", or "mock_interview"' });
      return;
    }

    const capacity = maxCapacity || (mode === 'solo' ? 1 : mode === 'pair' ? 2 : 10);
    const joinCode = generateJoinCode();
    const defaultName = `${mode.charAt(0).toUpperCase() + mode.slice(1)} Room`;
    const roomName = name || defaultName;
    
    // Use joinCode as the actual ID everywhere
    let roomId = joinCode;
    
    if (userId) {
      const room = await prisma.studyRoom.create({
        data: {
          id: roomId,
          name: roomName,
          slug: `${mode}-${joinCode.toLowerCase()}`,
          ownerId: userId,
          isPrivate: !isPublic,
          roomType: mode === 'mock_interview' ? 'mock_interview' : 'study',
        },
      });
    }

    await setRoomState(roomId, {
      status: 'IDLE',
      mode: mode as 'solo' | 'pair' | 'study' | 'mock_interview',
      maxCapacity: capacity,
      isPublic: isPublic || false,
      joinCode,
      createdAt: Date.now(),
      name: roomName,
      focusMin: focusMin || 50,
      breakMin: breakMin || 10,
    });

    res.status(201).json({
      roomId,
      joinCode,
      mode,
      maxCapacity: capacity,
      isPublic: isPublic || false,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const state = await getRoomState(id as string);
    if (!state) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.status(200).json({ room: state });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};
