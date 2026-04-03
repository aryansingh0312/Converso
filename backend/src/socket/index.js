const { verifyToken } = require("../utils/jwt");
const { findUserById, setUserOnline, registerSocket, removeSocket, getAllUsers, getSocketId } = require("../store");
const registerChat = require("./chatHandlers");
const registerWebRTC = require("./webrtcHandlers");

module.exports = function initSocket(io) {

  /* ── Auth middleware for socket connections ── */
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const payload = verifyToken(token);
      const user = await findUserById(payload.id);
      if (!user) return next(new Error("User not found"));
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    console.log(`[Socket] Connected: ${socket.user.name} (${userId})`);

    /* Register socket mapping & set online */
    registerSocket(userId, socket.id);
    await setUserOnline(userId, true);

    /* Broadcast online status to all connected clients */
    socket.broadcast.emit("user_online", { userId });

    /* Send current online users list to this client */
    const allUsers = await getAllUsers();
    const onlineIds = allUsers.filter(u => u.online).map(u => u._id.toString());
    socket.emit("online_users", onlineIds);

    /* Register domain handlers */
    registerChat(io, socket, userId);
    registerWebRTC(io, socket, userId);

    /* ── Disconnect ── */
    socket.on("disconnect", async (reason) => {
      console.log(`[Socket] Disconnected: ${socket.user.name} — ${reason}`);
      removeSocket(userId);
      await setUserOnline(userId, false);
      socket.broadcast.emit("user_offline", { userId });
    });
  });
};

