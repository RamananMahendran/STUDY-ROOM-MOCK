import { setRoomState } from '../../services/redis.service.js';
export const registerCollaborationHandlers = (io, socket) => {
    const handleProblemChanged = async (data) => {
        try {
            await setRoomState(data.roomId, {
                activeProblemId: data.problemId,
            });
            socket.to(data.roomId).emit('active_problem_sync', {
                problemId: data.problemId,
                changedBy: socket.data.userId,
            });
            console.log(`Problem changed in room ${data.roomId} to ${data.problemId}`);
        }
        catch (error) {
            console.error('Error changing problem:', error);
        }
    };
    const handleCursorMove = (data) => {
        try {
            const userId = socket.data.userId;
            socket.volatile.to(data.roomId).emit('cursor_update', {
                userId,
                line: data.line,
                column: data.column,
                color: data.color || '#7F77DD',
            });
        }
        catch (error) {
            console.error('Error handling cursor move:', error);
        }
    };
    const handleYjsSyncStep1 = (data) => {
        try {
            socket.to(data.roomId).emit('yjs_sync_step_1', {
                stateVector: data.stateVector,
                from: socket.id,
            });
        }
        catch (error) {
            console.error('Error handling Yjs sync step 1:', error);
        }
    };
    const handleYjsSyncStep2 = (data) => {
        try {
            socket.to(data.roomId).emit('yjs_sync_step_2', {
                update: data.update,
                from: socket.id,
            });
        }
        catch (error) {
            console.error('Error handling Yjs sync step 2:', error);
        }
    };
    const handleYjsUpdate = (data) => {
        try {
            socket.to(data.roomId).emit('yjs_update', {
                update: data.update,
                from: socket.id,
            });
        }
        catch (error) {
            console.error('Error handling Yjs update:', error);
        }
    };
    socket.on('problem_changed', handleProblemChanged);
    socket.on('cursor_move', handleCursorMove);
    socket.on('yjs_sync_step_1', handleYjsSyncStep1);
    socket.on('yjs_sync_step_2', handleYjsSyncStep2);
    socket.on('yjs_update', handleYjsUpdate);
};
