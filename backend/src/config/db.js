const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/converso";
    
    const conn = await mongoose.connect(mongoUri);

    console.log(`\n✅  MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`\n❌  MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
