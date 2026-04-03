const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  status: {
    type: String,
    enum: ["sending", "delivered", "seen"],
    default: "sending",
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  readAt: {
    type: Date,
    default: null,
  },
  fileUrl: {
    type: String,
    default: null,
  },
  fileMetadata: {
    fileName: String,
    fileType: String,
    fileSize: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  deletedForAll: {
    type: Boolean,
    default: false,
  },
});

// Index for faster queries on roomId (from + to sorted)
messageSchema.index({ from: 1, to: 1 });
messageSchema.index({ to: 1, from: 1 });

module.exports = mongoose.model("Message", messageSchema);
