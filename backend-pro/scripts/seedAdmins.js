
// backend/scripts/seedAdmins.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/user/User.js";
import connectDB from "../src/config/db.js";

dotenv.config();

const seedAdmins = async () => {
  try {
    await connectDB();
    console.log("📦 Connected to MongoDB for Admin seeding...");

    // 1. System Admin Credentials (Super Authority)
    const sysEmail = process.env.SYSTEM_ADMIN_EMAIL || "systemadmin@proadmin.com";
    const sysPassword = process.env.SYSTEM_ADMIN_PASSWORD || "SystemAdminSecure123!";
    const sysUsername = process.env.SYSTEM_ADMIN_USERNAME || "SystemAdmin";

    // 2. Moderator Admin Credentials (Junior / Approval Triggered)
    const modEmail = process.env.MODERATOR_ADMIN_EMAIL || "moderatoradmin@proadmin.com";
    const modPassword = process.env.MODERATOR_ADMIN_PASSWORD || "ModeratorSecure123!";
    const modUsername = process.env.MODERATOR_ADMIN_USERNAME || "ModeratorAdmin";

    const salt = await bcrypt.genSalt(10);

    // --- Seed System Admin ---
    const existingSys = await User.findOne({ email: sysEmail });
    if (existingSys) {
      existingSys.role = "system_admin";
      await existingSys.save();
      console.log(`ℹ️ System Admin (${sysEmail}) updated/verified as 'system_admin'.`);
    } else {
      const hashedSysPassword = await bcrypt.hash(sysPassword, salt);
      await User.create({
        username: sysUsername,
        email: sysEmail,
        password: hashedSysPassword,
        role: "system_admin",
      });
      console.log(`🚀 System Admin created successfully! Email: ${sysEmail}`);
    }

    // --- Seed Moderator Admin ---
    const existingMod = await User.findOne({ email: modEmail });
    if (existingMod) {
      existingMod.role = "moderator_admin";
      await existingMod.save();
      console.log(`ℹ️ Moderator Admin (${modEmail}) updated/verified as 'moderator_admin'.`);
    } else {
      const hashedModPassword = await bcrypt.hash(modPassword, salt);
      await User.create({
        username: modUsername,
        email: modEmail,
        password: hashedModPassword,
        role: "moderator_admin",
      });
      console.log(`🚀 Moderator Admin created successfully! Email: ${modEmail}`);
    }

    console.log("✅ All admin accounts seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding admins failed:", err);
    process.exit(1);
  }
};

seedAdmins();
