const router = require("express").Router();
const auth = require("../middleware/auth");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/upload");
const User = require("../models/User");

/* POST /api/upload/profile-pic — upload profile picture */
router.post("/profile-pic", auth, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      return res.status(400).json({ error: "File size must be less than 5MB" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Profile picture must be an image" });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.data, file.name, "converso/profile-pics");

    // Delete old profile pic if exists
    const user = await User.findById(req.user._id);
    if (user.profilePic && user.profilePic.includes("cloudinary")) {
      try {
        const publicId = user.profilePic.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`converso/profile-pics/${publicId}`);
      } catch (err) {
        console.error("Error deleting old profile pic:", err);
      }
    }

    // Update user profile pic
    user.profilePic = result.secure_url;
    await user.save();

    res.json({ 
      success: true, 
      profilePic: result.secure_url,
      message: "Profile picture updated successfully"
    });
  } catch (err) {
    console.error("Error uploading profile pic:", err);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
});

/* POST /api/upload/media — upload media file for chat */
router.post("/media", auth, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const maxSize = 50 * 1024 * 1024; // 50MB for media

    if (file.size > maxSize) {
      return res.status(400).json({ error: "File size must be less than 50MB" });
    }

    // Determine if it's an image or file
    const isImage = file.mimetype.startsWith("image/");
    const messageType = isImage ? "image" : "file";

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.data, file.name, "converso/chat-media");

    res.json({ 
      success: true, 
      url: result.secure_url,
      name: file.name,
      type: messageType,
      mimeType: file.mimetype,
      size: file.size
    });
  } catch (err) {
    console.error("Error uploading media:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
