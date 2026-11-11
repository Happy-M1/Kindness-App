// src/scripts/seedSuperAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/user/User.js";
import connectDB from "../src/config/db.js"; // ✅ reuse existing connection


dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    //await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/pay-it-forward");
    //console.log("📦 Connected to MongoDB for Super Admin seeding...");

    await connectDB(); // ✅ uses same logic as server.js

    // 2. Define Super Admin credentials (or load from .env)
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@proapp.com";
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdminSecure123!";
    const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || "SuperAdmin";

    // 3. Check if Super Admin already exists
    const existingUser = await User.findOne({ email: superAdminEmail });

    if (existingUser) {
      if (existingUser.role !== "superadmin") {
        existingUser.role = "superadmin";
        await existingUser.save();
        console.log(`✅ Existing user ${superAdminEmail} promoted to Super Admin successfully.`);
      } else {
        console.log(`ℹ️ Super Admin account (${superAdminEmail}) already exists.`);
      }
      process.exit(0);
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

    // 5. Create Super Admin user
    await User.create({
      username: superAdminUsername,
      email: superAdminEmail,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log(`🚀 Super Admin created successfully!`);
    console.log(`📧 Email: ${superAdminEmail}`);
    console.log(`🔑 Password: ${superAdminPassword}`);
    console.log(`⚠️ Please change this password after your first login.`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Super Admin failed:", err);
    process.exit(1);
  }
};

seedSuperAdmin();