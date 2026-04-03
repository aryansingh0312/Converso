const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't return password by default
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/9.x/avataaars/svg?seed=${this.name}`;
    },
  },
  profilePic: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "Hey there, I'm using Converso!",
    maxlength: 100,
  },
  online: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to return user without password
userSchema.methods.toJSON = function() {
  const { password, ...rest } = this.toObject();
  return rest;
};

module.exports = mongoose.model("User", userSchema);
