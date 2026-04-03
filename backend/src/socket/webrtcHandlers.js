/**
 * Socket.io — WebRTC Signaling Handlers
 *
 * This acts as a relay only — media never touches the server.
 * The actual audio/video streams flow peer-to-peer via WebRTC.
 *
 * Events handled:
 *   call_user        → rings recipient, sends offer
 *   call_accepted    → relays answer back to caller
 *   call_rejected    → notifies caller
 *   call_ended       → notifies the other peer
 *   ice_candidate    → relays ICE candidates between peers
 */

const { getSocketId, findUserById } = require("../store");

module.exports = function registerWebRTCHandlers(io, socket, userId) {

  /* ── Initiate a call ── */
  socket.on("call_user", ({ to, offer, callType = "audio" }) => {
    const recipientSocket = getSocketId(to);
    if (!recipientSocket) {
      // Recipient offline — notify caller
      return socket.emit("call_unavailable", { to });
    }

    const caller = findUserById(userId);
    io.to(recipientSocket).emit("incoming_call", {
      from:     userId,
      caller:   caller ? { id: caller.id, name: caller.name, avatar: caller.avatar } : { id: userId },
      offer,
      callType, // "audio" | "video"
    });
  });

  /* ── Recipient accepts ── */
  socket.on("call_accepted", ({ to, answer }) => {
    const callerSocket = getSocketId(to);
    if (callerSocket) {
      io.to(callerSocket).emit("call_accepted", { from: userId, answer });
    }
  });

  /* ── Recipient rejects ── */
  socket.on("call_rejected", ({ to }) => {
    const callerSocket = getSocketId(to);
    if (callerSocket) {
      io.to(callerSocket).emit("call_rejected", { from: userId });
    }
  });

  /* ── Either peer ends the call ── */
  socket.on("call_ended", ({ to }) => {
    const peerSocket = getSocketId(to);
    if (peerSocket) {
      io.to(peerSocket).emit("call_ended", { from: userId });
    }
  });

  /* ── ICE candidate relay ── */
  socket.on("ice_candidate", ({ to, candidate }) => {
    const peerSocket = getSocketId(to);
    if (peerSocket) {
      io.to(peerSocket).emit("ice_candidate", { from: userId, candidate });
    }
  });
};
