// backend/scripts/seedSiteContent.js
// scripts/seedSiteContent.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import SiteContent from "../src/models/SiteContent.js";
import connectDB from "../src/config/db.js";

dotenv.config();

async function seed() {
  try {
    await connectDB(); // ✅ reuse existing DB connection logic
    console.log("Connected to MongoDB");

    await SiteContent.create([
      { key: "heroTitle", value: "Welcome to PayItForward" },
      { key: "aboutText", value: "This is a platform to spread kindness." },
      { key: "footerNote", value: "© 2026 PayItForward. All rights reserved." },
    ]);

    console.log("Seeded site content");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
