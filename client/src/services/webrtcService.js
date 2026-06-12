/**
 * webrtcService.js
 * Place at: client/src/services/webrtcService.js
 *
 * Pure browser JS — no TypeScript, no imports from server.
 * Manages all peer connections for one user in one room.
 */

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export class WebRTCService {
  /**
   * @param {import('socket.io-client').Socket} socket  - your existing socket connection
   * @param {string} roomId                             - the room's joinCode / id
   * @param {string} peerId                             - unique id for this user (use socket.id or user.id)
   * @param {function} onPeersChanged                  - callback(Map<peerId, PeerState>) called on every update
   */
  constructor(socket, roomId, peerId, onPeersChanged) {
    this.socket = socket;
    this.roomId = roomId;
    this.peerId = peerId;
    this.onPeersChanged = onPeersChanged;

    this.localStream = null;        // MediaStream from getUserMedia
    this.screenStream = null;       // MediaStream from getDisplayMedia

    // peerId → RTCPeerConnection
    this._peerConnections = new Map();

    // peerId → { stream, audio, video, screenSharing }
    this._peerStates = new Map();

    this._bindSocketEvents();
  }

  // ─── PUBLIC API ─────────────────────────────────────────────────────────────

  /** Call this when user clicks "Join Video Call". Returns the local MediaStream. */
  async start(video = true, audio = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
    } catch (err) {
      console.warn('[WebRTC] getUserMedia failed, joining without media:', err.message);
      this.localStream = null;
    }
    // Tell the signaling server we're in the mesh for this room
    this.socket.emit('webrtc:join', { roomId: this.roomId, peerId: this.peerId });
    return this.localStream;
  }

  /** Mute / unmute local mic */
  setAudio(enabled) {
    this.localStream?.getAudioTracks().forEach(t => (t.enabled = enabled));
    this.socket.emit('webrtc:media-state', {
      roomId: this.roomId,
      peerId: this.peerId,
      audio: enabled,
      video: this._isVideoEnabled(),
    });
  }

  /** Turn camera on / off */
  setVideo(enabled) {
    this.localStream?.getVideoTracks().forEach(t => (t.enabled = enabled));
    this.socket.emit('webrtc:media-state', {
      roomId: this.roomId,
      peerId: this.peerId,
      audio: this._isAudioEnabled(),
      video: enabled,
    });
  }

  /** Start screen share — replaces the video track in every peer connection */
  async startScreenShare() {
    this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const track = this.screenStream.getVideoTracks()[0];

    for (const pc of this._peerConnections.values()) {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(track);
    }

    // Auto-stop when user closes the browser "stop sharing" bar
    track.onended = () => this.stopScreenShare();

    this.socket.emit('webrtc:screen-share', {
      roomId: this.roomId, peerId: this.peerId, active: true,
    });
  }

  /** Stop screen share — revert to camera */
  async stopScreenShare() {
    this.screenStream?.getTracks().forEach(t => t.stop());
    this.screenStream = null;
    const cameraTrack = this.localStream?.getVideoTracks()[0] ?? null;
    for (const pc of this._peerConnections.values()) {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(cameraTrack);
    }
    this.socket.emit('webrtc:screen-share', {
      roomId: this.roomId, peerId: this.peerId, active: false,
    });
  }

  /** Call this when user clicks "Leave Call" or the room page unmounts */
  destroy() {
    this.socket.emit('webrtc:leave', { roomId: this.roomId, peerId: this.peerId });
    this._unbindSocketEvents();
    for (const pc of this._peerConnections.values()) pc.close();
    this._peerConnections.clear();
    this._peerStates.clear();
    this.localStream?.getTracks().forEach(t => t.stop());
    this.screenStream?.getTracks().forEach(t => t.stop());
    this.localStream = null;
    this.screenStream = null;
    this.onPeersChanged(new Map());
  }

  // ─── INTERNAL: PeerConnection factory ───────────────────────────────────────

  _createPC(targetPeerId, targetSocketId) {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // Add our local tracks to this connection
    if (this.localStream) {
      for (const track of this.localStream.getTracks()) {
        pc.addTrack(track, this.localStream);
      }
    }

    // When remote tracks arrive → store stream and notify React
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const existing = this._peerStates.get(targetPeerId) || {};
      this._peerStates.set(targetPeerId, {
        ...existing,
        socketId: targetSocketId,
        stream: remoteStream,
        audio: existing.audio ?? true,
        video: existing.video ?? true,
        screenSharing: existing.screenSharing ?? false,
      });
      this.onPeersChanged(new Map(this._peerStates));
    };

    // Relay ICE candidates through the server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc:ice-candidate', {
          targetSocketId,
          candidate: event.candidate.toJSON(),
          fromPeerId: this.peerId,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.debug(`[WebRTC] ${this.peerId}→${targetPeerId}: ${state}`);
      if (state === 'failed') pc.restartIce();
      if (state === 'disconnected' || state === 'closed') {
        this._removePeer(targetPeerId);
      }
    };

    this._peerConnections.set(targetPeerId, pc);
    return pc;
  }

  // ─── INTERNAL: Signaling ─────────────────────────────────────────────────────

  async _sendOffer(targetPeerId, targetSocketId) {
    const pc = this._createPC(targetPeerId, targetSocketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.socket.emit('webrtc:offer', {
      targetSocketId,
      offer: { type: offer.type, sdp: offer.sdp },
      fromPeerId: this.peerId,
    });
  }

  async _handleOffer(offer, fromPeerId, fromSocketId) {
    const pc = this._createPC(fromPeerId, fromSocketId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.socket.emit('webrtc:answer', {
      targetSocketId: fromSocketId,
      answer: { type: answer.type, sdp: answer.sdp },
      fromPeerId: this.peerId,
    });
  }

  async _handleAnswer(answer, fromPeerId) {
    const pc = this._peerConnections.get(fromPeerId);
    if (pc && pc.signalingState !== 'stable') {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async _handleIceCandidate(candidate, fromPeerId) {
    const pc = this._peerConnections.get(fromPeerId);
    if (pc) {
      try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); }
      catch (e) { /* candidate arrived before remoteDescription — safe to ignore */ }
    }
  }

  _removePeer(peerId) {
    this._peerConnections.get(peerId)?.close();
    this._peerConnections.delete(peerId);
    this._peerStates.delete(peerId);
    this.onPeersChanged(new Map(this._peerStates));
  }

  // ─── INTERNAL: Socket event handlers (stored as arrows so we can remove them) ──

  _onExistingPeers = ({ peers }) => {
    // We joined — initiate offers to everyone already in the room
    for (const peer of peers) {
      this._sendOffer(peer.peerId, peer.socketId);
    }
  };

  _onPeerJoined = ({ peerId, socketId }) => {
    // Someone else joined — they'll send us an offer, nothing to do here
    console.debug('[WebRTC] peer joined, waiting for their offer:', peerId);
  };

  _onOffer = ({ offer, fromPeerId, fromSocketId }) => {
    this._handleOffer(offer, fromPeerId, fromSocketId);
  };

  _onAnswer = ({ answer, fromPeerId }) => {
    this._handleAnswer(answer, fromPeerId);
  };

  _onIceCandidate = ({ candidate, fromPeerId }) => {
    this._handleIceCandidate(candidate, fromPeerId);
  };

  _onPeerLeft = ({ peerId }) => {
    this._removePeer(peerId);
  };

  _onPeerMediaState = ({ peerId, audio, video }) => {
    const existing = this._peerStates.get(peerId);
    if (existing) {
      this._peerStates.set(peerId, { ...existing, audio, video });
      this.onPeersChanged(new Map(this._peerStates));
    }
  };

  _onPeerScreenShare = ({ peerId, active }) => {
    const existing = this._peerStates.get(peerId);
    if (existing) {
      this._peerStates.set(peerId, { ...existing, screenSharing: active });
      this.onPeersChanged(new Map(this._peerStates));
    }
  };

  _bindSocketEvents() {
    this.socket.on('webrtc:existing-peers',   this._onExistingPeers);
    this.socket.on('webrtc:peer-joined',       this._onPeerJoined);
    this.socket.on('webrtc:offer',             this._onOffer);
    this.socket.on('webrtc:answer',            this._onAnswer);
    this.socket.on('webrtc:ice-candidate',     this._onIceCandidate);
    this.socket.on('webrtc:peer-left',         this._onPeerLeft);
    this.socket.on('webrtc:peer-media-state',  this._onPeerMediaState);
    this.socket.on('webrtc:peer-screen-share', this._onPeerScreenShare);
  }

  _unbindSocketEvents() {
    this.socket.off('webrtc:existing-peers',   this._onExistingPeers);
    this.socket.off('webrtc:peer-joined',       this._onPeerJoined);
    this.socket.off('webrtc:offer',             this._onOffer);
    this.socket.off('webrtc:answer',            this._onAnswer);
    this.socket.off('webrtc:ice-candidate',     this._onIceCandidate);
    this.socket.off('webrtc:peer-left',         this._onPeerLeft);
    this.socket.off('webrtc:peer-media-state',  this._onPeerMediaState);
    this.socket.off('webrtc:peer-screen-share', this._onPeerScreenShare);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _isAudioEnabled() {
    return this.localStream?.getAudioTracks()[0]?.enabled ?? false;
  }
  _isVideoEnabled() {
    return this.localStream?.getVideoTracks()[0]?.enabled ?? false;
  }
}