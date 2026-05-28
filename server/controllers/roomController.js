import pool from '../config/db.js';
import {
  getActiveRoomIds,
  getRoomState,
  getRoomUsers,
  setRoomState,
} from '../services/redis.service.js';

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function getActiveRooms(req, res, next) {
  try {
    const roomIds = await getActiveRoomIds();

    if (!roomIds.length) {
      return res.json([]);
    }

    const rooms = await Promise.all(
      roomIds.map(async (roomId) => {
        const [state, users] = await Promise.all([
          getRoomState(roomId),
          getRoomUsers(roomId),
        ]);

        return {
          roomId,
          mode:         state?.mode        || 'solo',
          isPublic:     state?.isPublic    === 'true',
          participantCount: users.length,
        };
      })
    );

    const publicRooms = rooms.filter((r) => r.isPublic);
    res.json(publicRooms);
  } catch (err) {
    next(err);
  }
}

export async function createRoom(req, res, next) {
  try {
    const { mode = 'solo', isPublic = true } = req.body;

    if (!['solo', 'pair'].includes(mode)) {
      res.status(400);
      throw new Error('mode must be "solo" or "pair"');
    }

    const joinCode = generateJoinCode();

    const { rows } = await pool.query(
      `INSERT INTO study_rooms (name, slug, owner_id, is_private, invite_code)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        `Room ${joinCode}`,
        joinCode.toLowerCase(),
        req.user.id,
        !isPublic,
        joinCode,
      ]
    );

    const roomId = rows[0].id;

    await setRoomState(roomId, {
      mode,
      isPublic:    String(isPublic),
      timerStatus: 'IDLE',
    });

    res.status(201).json({ roomId, joinCode });
  } catch (err) {
    next(err);
  }
}
