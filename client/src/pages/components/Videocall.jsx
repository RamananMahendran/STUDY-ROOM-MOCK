/**
 * VideoCall.jsx
 * Place at: client/src/pages/components/VideoCall.jsx
 *
 * Drop into Room.jsx like:
 *   import VideoCall from './components/VideoCall';
 *   <VideoCall socket={socket} roomId={roomId} userId={user.id} userName={user.name} />
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebRTCService } from '../../services/webrtcService';

// ─── Single video tile ────────────────────────────────────────────────────────

function VideoTile({ stream, muted = false, label, audioOn, videoOn, isScreen }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={styles.tile}>
      {videoOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          style={styles.video}
        />
      ) : (
        <div style={styles.avatar}>
          <span style={styles.avatarLetter}>
            {label ? label[0].toUpperCase() : '?'}
          </span>
        </div>
      )}

      <div style={styles.tileFooter}>
        {!audioOn && <span style={styles.mutedBadge}>🔇</span>}
        {isScreen && <span style={styles.screenBadge}>Screen</span>}
        <span style={styles.tileLabel}>{label}</span>
      </div>
    </div>
  );
}

// ─── Main VideoCall component ─────────────────────────────────────────────────

export default function VideoCall({ socket, roomId, userId, userName }) {
  const svcRef = useRef(null);

  const [inCall, setInCall] = useState(false);           // has user clicked "Join"
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState(new Map());         // peerId → peerState

  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [error, setError] = useState(null);

  // Stable peerId — use userId if available, else socket.id
  const peerId = userId ? `user-${userId}` : socket?.id;

  // ── Join call ──────────────────────────────────────────────────────────────
  const joinCall = useCallback(async () => {
    if (!socket || !peerId) return;

    const svc = new WebRTCService(socket, roomId, peerId, (updatedPeers) => {
      setPeers(new Map(updatedPeers));
    });
    svcRef.current = svc;

    try {
      const stream = await svc.start(true, true);
      setLocalStream(stream);
      setInCall(true);
      setError(null);
    } catch (err) {
      setError('Could not access camera/microphone. Check browser permissions.');
      console.error('[VideoCall] start failed:', err);
      // Still join — they'll be audio/video-off
      setInCall(true);
    }
  }, [socket, roomId, peerId]);

  // ── Leave call ─────────────────────────────────────────────────────────────
  const leaveCall = useCallback(() => {
    svcRef.current?.destroy();
    svcRef.current = null;
    setLocalStream(null);
    setPeers(new Map());
    setInCall(false);
    setAudioOn(true);
    setVideoOn(true);
    setScreenOn(false);
  }, []);

  // ── Controls ───────────────────────────────────────────────────────────────
  const toggleAudio = useCallback(() => {
    const next = !audioOn;
    svcRef.current?.setAudio(next);
    setAudioOn(next);
  }, [audioOn]);

  const toggleVideo = useCallback(() => {
    const next = !videoOn;
    svcRef.current?.setVideo(next);
    setVideoOn(next);
  }, [videoOn]);

  const toggleScreen = useCallback(async () => {
    if (!screenOn) {
      try {
        await svcRef.current?.startScreenShare();
        setScreenOn(true);
      } catch (e) {
        // user cancelled the picker
      }
    } else {
      await svcRef.current?.stopScreenShare();
      setScreenOn(false);
    }
  }, [screenOn]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      svcRef.current?.destroy();
    };
  }, []);

  // ── Render: pre-join state ─────────────────────────────────────────────────
  if (!inCall) {
    return (
      <div style={styles.lobby}>
        <div style={styles.lobbyInner}>
          <p style={styles.lobbyHeading}>Video call</p>
          <p style={styles.lobbySubtext}>
            {peers.size > 0
              ? `${peers.size} member${peers.size > 1 ? 's' : ''} already in the call`
              : 'No one in the call yet — start one!'}
          </p>
          {error && <p style={styles.errorText}>{error}</p>}
          <button style={styles.joinBtn} onClick={joinCall}>
            📹 Join video call
          </button>
        </div>
      </div>
    );
  }

  // ── Render: in-call grid ───────────────────────────────────────────────────
  const totalTiles = 1 + peers.size;
  const cols = totalTiles <= 1 ? 1 : totalTiles <= 4 ? 2 : 3;

  return (
    <div style={styles.callWrapper}>
      {/* Grid */}
      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {/* Local tile */}
        <VideoTile
          stream={localStream}
          muted              /* prevent echo */
          label={`${userName || 'You'} (you)`}
          audioOn={audioOn}
          videoOn={videoOn && !!localStream}
          isScreen={screenOn}
        />

        {/* Remote peers */}
        {Array.from(peers.values()).map((peer) => (
          <VideoTile
            key={peer.socketId}
            stream={peer.stream}
            label={peer.peerId.replace('user-', '')}
            audioOn={peer.audio}
            videoOn={peer.video}
            isScreen={peer.screenSharing}
          />
        ))}
      </div>

      {/* Control bar */}
      <div style={styles.controlBar}>
        <CtrlBtn
          onClick={toggleAudio}
          active={audioOn}
          activeLabel="Mute"
          inactiveLabel="Unmute"
          activeIcon="🎙️"
          inactiveIcon="🔇"
        />
        <CtrlBtn
          onClick={toggleVideo}
          active={videoOn}
          activeLabel="Stop cam"
          inactiveLabel="Start cam"
          activeIcon="📹"
          inactiveIcon="📷"
        />
        <CtrlBtn
          onClick={toggleScreen}
          active={screenOn}
          activeLabel="Stop share"
          inactiveLabel="Share screen"
          activeIcon="🖥️"
          inactiveIcon="🖥️"
          accent="#1D9E75"
        />
        <button style={styles.leaveBtn} onClick={leaveCall}>
          📵 Leave
        </button>
      </div>
    </div>
  );
}

// ─── Small control button ─────────────────────────────────────────────────────

function CtrlBtn({ onClick, active, activeLabel, inactiveLabel, activeIcon, inactiveIcon, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.ctrlBtn,
        background: active ? (accent || '#3a3a4a') : '#c0392b',
      }}
    >
      <span style={{ fontSize: 18 }}>{active ? activeIcon : inactiveIcon}</span>
      <span style={{ fontSize: 11 }}>{active ? activeLabel : inactiveLabel}</span>
    </button>
  );
}

// ─── Styles (inline so there are zero extra CSS files needed) ─────────────────

const styles = {
  lobby: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
  },
  lobbyInner: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  lobbyHeading: {
    margin: 0,
    fontWeight: 600,
    fontSize: 16,
  },
  lobbySubtext: {
    margin: 0,
    fontSize: 13,
    opacity: 0.6,
  },
  joinBtn: {
    marginTop: 8,
    padding: '10px 24px',
    background: '#1D9E75',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  callWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  grid: {
    display: 'grid',
    gap: 6,
  },
  tile: {
    position: 'relative',
    background: '#1a1a2e',
    borderRadius: 10,
    overflow: 'hidden',
    aspectRatio: '16/9',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  avatar: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2d2d44',
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: 700,
    color: '#8888bb',
  },
  tileFooter: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  mutedBadge: {
    background: 'rgba(194,57,33,0.85)',
    borderRadius: 4,
    padding: '1px 5px',
    fontSize: 11,
  },
  screenBadge: {
    background: 'rgba(29,158,117,0.85)',
    borderRadius: 4,
    padding: '1px 5px',
    fontSize: 11,
    color: '#fff',
  },
  tileLabel: {
    marginLeft: 'auto',
    background: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    padding: '1px 6px',
    fontSize: 11,
    color: '#fff',
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  controlBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  ctrlBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    cursor: 'pointer',
    color: '#fff',
    minWidth: 68,
  },
  leaveBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    background: '#8B0000',
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
    fontSize: 12,
    minWidth: 68,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    margin: 0,
  },
};