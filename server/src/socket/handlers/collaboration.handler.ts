import { Server, Socket } from 'socket.io';
import { setRoomState } from '../../services/redis.service.js';
import pairModel from '../../modules/pair/pairModel.js';

export const registerCollaborationHandlers = (io: Server, socket: Socket) => {
  
  // ============================================================
  // Existing Handlers
  // ============================================================
  
  const handleProblemChanged = async (data: { roomId: string; problemId: string }) => {
    try {
      await setRoomState(data.roomId, {
        activeProblemId: data.problemId,
      });

      socket.to(data.roomId).emit('active_problem_sync', {
        problemId: data.problemId,
        changedBy: socket.data.userId,
      });

      console.log(`Problem changed in room ${data.roomId} to ${data.problemId}`);
    } catch (error) {
      console.error('Error changing problem:', error);
    }
  };

  const handleCursorMove = (data: { roomId: string; line: number; column: number; color?: string }) => {
    try {
      const userId = socket.data.userId;
      
      socket.volatile.to(data.roomId).emit('cursor_update', {
        userId,
        line: data.line,
        column: data.column,
        color: data.color || '#7F77DD',
      });
    } catch (error) {
      console.error('Error handling cursor move:', error);
    }
  };

  const handleYjsSyncStep1 = (data: { roomId: string; stateVector: Uint8Array }) => {
    try {
      socket.to(data.roomId).emit('yjs_sync_step_1', {
        stateVector: data.stateVector,
        from: socket.id,
      });
    } catch (error) {
      console.error('Error handling Yjs sync step 1:', error);
    }
  };

  const handleYjsSyncStep2 = (data: { roomId: string; update: Uint8Array }) => {
    try {
      socket.to(data.roomId).emit('yjs_sync_step_2', {
        update: data.update,
        from: socket.id,
      });
    } catch (error) {
      console.error('Error handling Yjs sync step 2:', error);
    }
  };

  const handleYjsUpdate = (data: { roomId: string; update: Uint8Array }) => {
    try {
      socket.to(data.roomId).emit('yjs_update', {
        update: data.update,
        from: socket.id,
      });
    } catch (error) {
      console.error('Error handling Yjs update:', error);
    }
  };

  // ============================================================
  // Pair Coding Handlers
  // ============================================================

  // Join a pair coding room
  const handleJoinPairRoom = async (data: { 
    roomCode: string; 
    userId: number; 
    userName: string; 
    userAvatar?: string 
  }) => {
    try {
      const { roomCode, userId, userName, userAvatar } = data;
      const roomName = `pair:${roomCode}`;
      
      // Store user data on the socket for later retrieval
      socket.data.userId = userId;
      socket.data.userName = userName;
      socket.data.userAvatar = userAvatar;
      socket.data.roomCode = roomCode;
      
      // Leave previous pair rooms
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room !== socket.id && room.startsWith('pair:')) {
          socket.leave(room);
        }
      });
      
      socket.join(roomName);
      console.log(`👥 User ${userName} (${userId}) joined pair room: ${roomCode}`);
      
      // Get existing cursors from database
      const session = await pairModel.findByRoomCode(roomCode);
      if (session) {
        const cursors = await pairModel.getCursors(session.id);
        const cursorData = cursors.map(c => ({
          userId: c.userId,
          userName: c.user.name,
          userAvatar: c.user.avatarUrl,
          lineNumber: c.lineNumber,
          columnNumber: c.columnNumber,
          color: c.color,
        }));
        socket.emit('cursors-initial', cursorData);
        
        // Send current code if exists
        if (session.currentCode) {
          socket.emit('code-sync', { code: session.currentCode });
        }
      }
      
      // Tell EXISTING users that someone new joined
      socket.to(roomName).emit('user-joined', { userId, userName, userAvatar });
      
      // Tell the NEW USER about everyone already in the room
      const room = io.sockets.adapter.rooms.get(roomName);
      if (room) {
        const existingUsers: { userId: number; userName: string; userAvatar?: string }[] = [];
        for (const socketId of room) {
          if (socketId !== socket.id) {
            const s = io.sockets.sockets.get(socketId);
            if (s?.data?.userName) {
              existingUsers.push({
                userId: s.data.userId,
                userName: s.data.userName,
                userAvatar: s.data.userAvatar,
              });
            }
          }
        }
        if (existingUsers.length > 0) {
          socket.emit('room-users', existingUsers);
          console.log(`📡 Sent existing users to ${userName}: ${existingUsers.map(u => u.userName).join(', ')}`);
        }
      }
      
    } catch (error) {
      console.error('Error joining pair room:', error);
    }
  };

  // Handle cursor movement in pair coding
  const handlePairCursorMove = async (data: {
    roomCode: string;
    userId: number;
    userName: string;
    userAvatar?: string;
    lineNumber: number;
    columnNumber: number;
    color?: string;
  }) => {
    try {
      const { roomCode, userId, userName, userAvatar, lineNumber, columnNumber, color } = data;
      const roomName = `pair:${roomCode}`;
      
      // Update cursor in database
      const session = await pairModel.findByRoomCode(roomCode);
      if (session) {
        await pairModel.updateCursor(session.id, userId, lineNumber, columnNumber, color || '#7F77DD');
      }
      
      // Broadcast to other users in the room
      socket.to(roomName).emit('cursor-move', {
        userId,
        userName,
        userAvatar,
        lineNumber,
        columnNumber,
        color: color || '#7F77DD',
      });
      console.log(`📡 Cursor broadcast: ${userName} at L${lineNumber}:C${columnNumber}`);
    } catch (error) {
      console.error('Error handling pair cursor move:', error);
    }
  };

  // Handle code changes in pair coding
  const handlePairCodeChange = async (data: { 
    roomCode: string; 
    code: string 
  }) => {
    try {
      const { roomCode, code } = data;
      const roomName = `pair:${roomCode}`;
      
      // Save to database
      await pairModel.updateCodeByRoomCode(roomCode, code);
      
      // Broadcast to others
      socket.to(roomName).emit('code-change', { code });
      console.log(`📝 Code change broadcast to room: ${roomCode}`);
    } catch (error) {
      console.error('Error handling pair code change:', error);
    }
  };

  // 👇 NEW: Handle code execution results (for run button)
  const handleCodeExecutionResult = (data: {
    roomCode: string;
    output: string;
    userName: string;
  }) => {
    const { roomCode, output, userName } = data;
    const roomName = `pair:${roomCode}`;
    socket.to(roomName).emit('code-execution-result', {
      output,
      userName,
      timestamp: new Date().toISOString(),
    });
    console.log(`📡 Execution result broadcast from ${userName} to room: ${roomCode}`);
  };

  // Leave pair coding room
  const handleLeavePairRoom = async (data: { 
    roomCode: string; 
    userId: number; 
    userName: string 
  }) => {
    try {
      const { roomCode, userId, userName } = data;
      const roomName = `pair:${roomCode}`;
      
      socket.leave(roomName);
      
      // Remove cursor from database
      const session = await pairModel.findByRoomCode(roomCode);
      if (session) {
        await pairModel.deleteCursor(session.id, userId);
      }
      
      socket.to(roomName).emit('user-left', { userId, userName });
      console.log(`👋 User ${userName} left pair room: ${roomCode}`);
    } catch (error) {
      console.error('Error leaving pair room:', error);
    }
  };

  // Handle submission result in pair coding
  const handleSubmissionResult = (data: {
    roomCode: string;
    submission_id: string;
    status: string;
    runtime_ms: number;
    memory_kb: number;
    submitted_by: number;
    submitted_by_name: string;
  }) => {
    const { roomCode } = data;
    const roomName = `pair:${roomCode}`;
    io.to(roomName).emit('submission:result', data);
    console.log(`📡 Broadcast submission result to room: ${roomName}`);
  };

  // ============================================================
  // Study Room Collaboration Handlers
  // ============================================================
  const handleNotesChange = (data: { roomId: string; text: string }) => {
    socket.to(data.roomId).emit('notes_update', data.text);
  };

  const handleFileShared = (data: { roomId: string; file: any }) => {
    socket.to(data.roomId).emit('file_shared', data.file);
  };

  // ============================================================
  // Register all event listeners
  // ============================================================

  // Existing listeners
  socket.on('problem_changed', handleProblemChanged);
  socket.on('cursor_move', handleCursorMove);
  socket.on('yjs_sync_step_1', handleYjsSyncStep1);
  socket.on('yjs_sync_step_2', handleYjsSyncStep2);
  socket.on('yjs_update', handleYjsUpdate);
  
  // Pair coding listeners
  socket.on('join-pair-room', handleJoinPairRoom);
  socket.on('cursor-move', handlePairCursorMove);
  socket.on('code-change', handlePairCodeChange);
  socket.on('code-execution-result', handleCodeExecutionResult);
  socket.on('leave-pair-room', handleLeavePairRoom);
  socket.on('submission:result', handleSubmissionResult);

  // Study room collaboration listeners
  socket.on('notes_change', handleNotesChange);
  socket.on('file_shared', handleFileShared);
};