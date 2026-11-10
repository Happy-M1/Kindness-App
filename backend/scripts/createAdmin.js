// backend/scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/user/User.js";
import connectDB from "../src/config/db.js"; // ✅ reuse existing connection

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB(); // ✅ uses same logic as server.js

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "AdminPassword123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      return;
    }

    const admin = new User({
      username: "superadmin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created:", admin.email);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
