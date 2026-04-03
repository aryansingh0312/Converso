// MongoDB data store with Socket.io user mapping
const User = require("./models/User");
const Message = require("./models/Message");

const sockets = new Map(); // userId → socketId (for real-time messaging)

/* ─── User helpers ─── */
async function createUser({ name, email, password }) {
  const user = new User({ name, email, password });
  await user.save();
  return user.toJSON();
}

async function findUserByEmail(email) {
  return await User.findOne({ email }).select("+password");
}

async function findUserById(id) {
  return await User.findById(id);
}

async function setUserOnline(userId, online) {
  return await User.findByIdAndUpdate(
    userId,
    {
      online,
      lastSeen: online ? null : new Date(),
    },
    { returnDocument: 'after' }
  );
}

async function getAllUsers() {
  return await User.find().select("-password");
}

async function getUsersExcept(userId) {
  return await User.find({ _id: { $ne: userId } }).select("-password");
}

/* ─── Message helpers ─── */
function getRoomId(a, b) {
  // Convert ObjectIds to strings and sort for consistency
  const ids = [a.toString(), b.toString()].sort();
  return ids.join("__");
}

async function saveMessage(from, to, text, type = "text", fileMetadata = null) {
  const msg = new Message({
    from,
    to,
    text,
    type,
    fileMetadata,
  });
  await msg.save();
  return await msg.populate("from to", "name email avatar profilePic online status lastSeen");
}

async function getMessages(fromUserId, toUserId, limit = 50) {
  const messages = await Message.find({
    $or: [
      { from: fromUserId, to: toUserId },
      { from: toUserId, to: fromUserId },
    ],
    deletedForAll: { $ne: true },
  })
    .populate("from to", "name email avatar profilePic online status lastSeen")
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();

  // Filter out messages deleted for current user
  return messages.filter(msg => {
    if (!msg.deletedFor || !Array.isArray(msg.deletedFor)) return true;
    return !msg.deletedFor.map(id => id.toString()).includes(fromUserId.toString());
  });
}

async function getConversations(userId) {
  try {
    // Get all messages for this user, excluding deleted-for-all messages
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from to", "name email avatar profilePic online status lastSeen")
      .sort({ createdAt: -1 })
      .lean();

    // Filter messages
    const filteredMessages = messages.filter(msg => {
      // Skip if message is deleted for everyone
      if (msg.deletedForAll === true) return false;
      // Skip if message is deleted for current user
      if (msg.deletedFor && Array.isArray(msg.deletedFor)) {
        if (msg.deletedFor.some(id => id.toString() === userId.toString())) {
          return false;
        }
      }
      return true;
    });

    // Group by conversation partner
    const conversations = new Map();

    for (const msg of filteredMessages) {
      if (!msg.from || !msg.to) continue;

      const fromId = msg.from._id.toString();
      const toId = msg.to._id.toString();
      const userId_str = userId.toString();
      
      const partnerId = fromId === userId_str ? toId : fromId;
      
      if (!conversations.has(partnerId)) {
        const partner = fromId === userId_str ? msg.to : msg.from;
        conversations.set(partnerId, {
          user: partner,
          lastMessage: msg.text || "",
          lastMessageTime: msg.createdAt,
        });
      }
    }

    return Array.from(conversations.values());
  } catch (err) {
    console.error("[getConversations] Error:", err.message);
    throw err;
  }
}

async function markMessagesAsRead(fromUserId, toUserId) {
  return await Message.updateMany(
    { from: fromUserId, to: toUserId, status: { $ne: "seen" } },
    { status: "seen", readAt: new Date() }
  );
}

async function markMessageAsDelivered(messageId) {
  return await Message.findByIdAndUpdate(
    messageId,
    { status: "delivered", deliveredAt: new Date() },
    { returnDocument: "after" }
  );
}

async function deleteMessage(messageId, userId) {
  const message = await Message.findById(messageId);
  if (!message) return null;
  if (message.from.toString() !== userId.toString()) return null; // Only sender can delete
  
  await Message.findByIdAndDelete(messageId);
  return messageId;
}

async function deleteMessageForMe(messageId, userId) {
  const message = await Message.findById(messageId);
  if (!message) return null;
  
  // Initialize deletedFor array if it doesn't exist
  if (!message.deletedFor) {
    message.deletedFor = [];
  }
  
  // Add current user to deletedFor array if not already there
  if (!message.deletedFor.map(id => id.toString()).includes(userId.toString())) {
    message.deletedFor.push(userId);
    await message.save();
  }
  
  return messageId;
}

async function deleteMessageForEveryone(messageId, userId) {
  const message = await Message.findById(messageId);
  if (!message) return null;
  if (message.from.toString() !== userId.toString()) return null; // Only sender can delete for everyone
  
  // Mark as deleted for all users
  message.deletedForAll = true;
  await message.save();
  return messageId;
}

/* ─── Socket mapping ─── */
function registerSocket(userId, socketId) {
  sockets.set(userId.toString(), socketId);
}

function removeSocket(userId) {
  sockets.delete(userId.toString());
}

function getSocketId(userId) {
  return sockets.get(userId.toString());
}

module.exports = {
  sockets,
  createUser,
  findUserByEmail,
  findUserById,
  setUserOnline,
  getAllUsers,
  getUsersExcept,
  getRoomId,
  saveMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
  markMessageAsDelivered,
  deleteMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  registerSocket,
  removeSocket,
  getSocketId,
};
