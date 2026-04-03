const router = require("express").Router();
const auth   = require("../middleware/auth");
const { getUsersExcept, findUserById, getMessages, getConversations, deleteMessage } = require("../store");

/* GET /api/users  — list all users (protected) */
router.get("/", auth, async (req, res) => {
  try {
    const users = await getUsersExcept(req.user._id);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/* GET /api/users/me */
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

/* GET /api/users/:id */
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/* GET /api/users/:id/messages — conversation history */
router.get("/:id/messages", auth, async (req, res) => {
  try {
    const msgs = await getMessages(req.user._id, req.params.id);
    res.json(msgs.reverse()); // Return in chronological order
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/* GET /api/users/conversations — list all conversations for user */
router.get("/conversations/list", auth, async (req, res) => {
  try {
    const conversations = await getConversations(req.user._id);
    res.json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err.message, err.stack);
    res.status(500).json({ error: err.message || "Failed to fetch conversations" });
  }
});

/* PUT /api/users/me — update current user profile */
router.put("/me", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const User = require("../models/User");

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(email && { email }),
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.toJSON());
  } catch (err) {
    console.error("Error updating user:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* DELETE /api/users/messages/:messageId — delete a message */
router.delete("/messages/:messageId", auth, async (req, res) => {
  try {
    const result = await deleteMessage(req.params.messageId, req.user._id);
    if (!result) return res.status(403).json({ error: "Unauthorized or message not found" });
    res.json({ success: true, messageId: result });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
