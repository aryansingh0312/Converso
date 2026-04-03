/**
 * Socket.io — Chat Handlers
 * Events handled:
 *   send_message    → broadcast to recipient + save
 *   typing_start    → notify recipient
 *   typing_stop     → notify recipient
 *   message_read    → notify sender
 */

const { saveMessage, markMessagesAsRead, markMessageAsDelivered, deleteMessage, deleteMessageForMe, deleteMessageForEveryone, getSocketId } = require("../store");

module.exports = function registerChatHandlers(io, socket, userId) {

  /* ── Send a direct message ── */
  socket.on("send_message", async ({ to, text, type = "text", fileMetadata = null }) => {
    if (!to || !text?.trim()) return;

    try {
      const message = await saveMessage(userId, to, text.trim(), type, fileMetadata);

      const msgData = {
        _id: message._id,
        from: message.from,
        to: message.to,
        text: message.text,
        type: message.type,
        fileMetadata: message.fileMetadata,
        status: message.status,
        deliveredAt: message.deliveredAt,
        readAt: message.readAt,
        createdAt: message.createdAt,
      };

      // Echo back to sender (so their UI updates)
      socket.emit("new_message", msgData);

      // Deliver to recipient if online
      const recipientSocket = getSocketId(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("new_message", msgData);
        
        // Mark as delivered immediately if recipient is online
        const deliveredMsg = await markMessageAsDelivered(message._id);
        socket.emit("message_delivered", { 
          messageId: message._id, 
          status: "delivered",
          deliveredAt: deliveredMsg.deliveredAt
        });
        io.to(recipientSocket).emit("message_delivered", { 
          messageId: message._id, 
          status: "delivered",
          deliveredAt: deliveredMsg.deliveredAt
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  /* ── Typing indicators ── */
  socket.on("typing_start", ({ to }) => {
    const recipientSocket = getSocketId(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("user_typing", { from: userId });
    }
  });

  socket.on("typing_stop", ({ to }) => {
    const recipientSocket = getSocketId(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("user_stop_typing", { from: userId });
    }
  });

  /* ── Read receipts ── */
  socket.on("message_read", async ({ from }) => {
    try {
      await markMessagesAsRead(from, userId);
      const senderSocket = getSocketId(from);
      if (senderSocket) {
        io.to(senderSocket).emit("messages_seen", { by: userId, from });
      }
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  });

  /* ── Delete message ── */
  socket.on("delete_message", async ({ messageId, to }) => {
    try {
      const result = await deleteMessage(messageId, userId);
      if (!result) return;

      // Notify both sender and recipient
      socket.emit("message_deleted", { messageId });
      
      const recipientSocket = getSocketId(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("message_deleted", { messageId });
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      socket.emit("delete_error", { error: "Failed to delete message" });
    }
  });

  /* ── Delete message for me ── */
  socket.on("delete_message_for_me", async ({ messageId }) => {
    try {
      const result = await deleteMessageForMe(messageId, userId);
      if (!result) return;

      // Only notify current user
      socket.emit("message_deleted_for_me", { messageId });
    } catch (err) {
      console.error("Error deleting message for me:", err);
      socket.emit("delete_error", { error: "Failed to delete message" });
    }
  });

  /* ── Delete message for everyone ── */
  socket.on("delete_message_for_everyone", async ({ messageId, to }) => {
    try {
      const result = await deleteMessageForEveryone(messageId, userId);
      if (!result) return;

      // Notify both sender and recipient
      socket.emit("message_deleted_for_everyone", { messageId });
      
      const recipientSocket = getSocketId(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("message_deleted_for_everyone", { messageId });
      }
    } catch (err) {
      console.error("Error deleting message for everyone:", err);
      socket.emit("delete_error", { error: "Failed to delete message" });
    }
  });

  /* ── Profile updated ── */
  socket.on("profile_updated", ({ profilePic, name, avatar }) => {
    // Broadcast user profile update to all connected clients
    io.emit("user_profile_updated", { 
      userId,
      profilePic,
      name,
      avatar
    });
  });
};


