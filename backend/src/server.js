// backend/src/server.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/**
 Purpose:

Entry point of the backend.

Loads environment variables.

Connects to MongoDB.

Starts the Express server.
 */

/**
 🔑 Why These Files Are Important
  server.js → Handles startup logic (env vars, DB connection, server listen). Keeps entry point separate from app logic.
 */
