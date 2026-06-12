import { Server, Socket } from 'socket.io';
import { getRoomUsers } from '../../services/redis.service.js';

// Track which socket owns which peerId within a room
// Key: `${roomId}:${peerId}` → socketId
const peerSocketMap = new Map<string, string>();

export function registerWebRTCHandlers(io: Server, socket: Socket) {

  // ─── Join the WebRTC mesh for a room ────────────────────────────────────────
  // Client emits this after joining the room normally.
  // We tell the joining peer about every existing peer, and tell
  // existing peers about the newcomer. Each pair then negotiates.
  socket.on('webrtc:join', async ({ roomId, peerId }: { roomId: string; peerId: string }) => {
    const roomKey = `${roomId}:${peerId}`;
    peerSocketMap.set(roomKey, socket.id);

    // Attach roomId/peerId to socket for cleanup on disconnect
    (socket as any)._webrtcRoomId = roomId;
    (socket as any)._webrtcPeerId = peerId;

    // Get all OTHER sockets currently in this Socket.io room
    const socketsInRoom = await io.in(`room:${roomId}`).fetchSockets();
    const existingPeers: { peerId: string; socketId: string }[] = [];

    for (const s of socketsInRoom) {
      if (s.id === socket.id) continue;
      const existingPeerId = (s as any)._webrtcPeerId;
      if (existingPeerId) {
        existingPeers.push({ peerId: existingPeerId, socketId: s.id });
      }
    }

    // Tell the newcomer: "here are everyone already in the room; YOU initiate offers to them"
    socket.emit('webrtc:existing-peers', { peers: existingPeers });

    // Tell each existing peer: "someone new joined; THEY will send you an offer"
    for (const peer of existingPeers) {
      io.to(peer.socketId).emit('webrtc:peer-joined', {
        peerId,
        socketId: socket.id,
      });
    }
  });

  // ─── Relay: SDP Offer ────────────────────────────────────────────────────────
  // Newcomer → existing peer: "here's my offer, please answer"
  socket.on(
    'webrtc:offer',
    ({ targetSocketId, offer, fromPeerId }: {
      targetSocketId: string;
      offer: RTCSessionDescriptionInit;
      fromPeerId: string;
    }) => {
      io.to(targetSocketId).emit('webrtc:offer', {
        offer,
        fromPeerId,
        fromSocketId: socket.id,
      });
    }
  );

  // ─── Relay: SDP Answer ───────────────────────────────────────────────────────
  socket.on(
    'webrtc:answer',
    ({ targetSocketId, answer, fromPeerId }: {
      targetSocketId: string;
      answer: RTCSessionDescriptionInit;
      fromPeerId: string;
    }) => {
      io.to(targetSocketId).emit('webrtc:answer', {
        answer,
        fromPeerId,
        fromSocketId: socket.id,
      });
    }
  );

  // ─── Relay: ICE Candidate ────────────────────────────────────────────────────
  socket.on(
    'webrtc:ice-candidate',
    ({ targetSocketId, candidate, fromPeerId }: {
      targetSocketId: string;
      candidate: RTCIceCandidateInit;
      fromPeerId: string;
    }) => {
      io.to(targetSocketId).emit('webrtc:ice-candidate', {
        candidate,
        fromPeerId,
        fromSocketId: socket.id,
      });
    }
  );

  // ─── Media state broadcasts (mute/cam toggle) ────────────────────────────────
  // No relay needed — just broadcast to the room so UI updates immediately
  // without waiting for a renegotiation.
  socket.on(
    'webrtc:media-state',
    ({ roomId, peerId, audio, video }: {
      roomId: string;
      peerId: string;
      audio: boolean;
      video: boolean;
    }) => {
      socket.to(`room:${roomId}`).emit('webrtc:peer-media-state', {
        peerId,
        audio,
        video,
      });
    }
  );

  // ─── Screen share started / stopped ─────────────────────────────────────────
  socket.on(
    'webrtc:screen-share',
    ({ roomId, peerId, active }: { roomId: string; peerId: string; active: boolean }) => {
      socket.to(`room:${roomId}`).emit('webrtc:peer-screen-share', { peerId, active });
    }
  );

  // ─── Peer leaving ────────────────────────────────────────────────────────────
  socket.on('webrtc:leave', ({ roomId, peerId }: { roomId: string; peerId: string }) => {
    const roomKey = `${roomId}:${peerId}`;
    peerSocketMap.delete(roomKey);
    socket.to(`room:${roomId}`).emit('webrtc:peer-left', { peerId });
  });

  // ─── Cleanup on disconnect ───────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const roomId = (socket as any)._webrtcRoomId;
    const peerId = (socket as any)._webrtcPeerId;
    if (roomId && peerId) {
      peerSocketMap.delete(`${roomId}:${peerId}`);
      socket.to(`room:${roomId}`).emit('webrtc:peer-left', { peerId });
    }
  });
}