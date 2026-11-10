// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit process if DB fails
  }
};

export default connectDB;

/**
 🔑 Why This File Is Important
Centralized DB logic → keeps connection setup separate from server.js.

Error handling → if MongoDB fails, the app exits gracefully instead of hanging.

Reusability → you can import connectDB() anywhere (tests, scripts, etc.).
 */
