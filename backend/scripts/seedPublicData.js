// backend/src/scripts/seedPublicData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import SiteContent from "../src/models/SiteContent.js";
import ContactSubmission from "../src/models/ContactSubmission.js";
import Testimonial from "../src/models/Testimonial.js";
import connectDB from "../src/config/db.js"; // ✅ reuse existing connection

dotenv.config();

const seedData = async () => {
  try {
   // await mongoose.connect(process.env.MONGO_URI);
    //console.log("Connected to DB for seeding...");

    await connectDB(); // ✅ uses same logic as server.js

    // 1. Seed Site Content Keys
    await SiteContent.deleteMany({});
    await SiteContent.insertMany([
      { key: "home.hero", value: { title: "Empowering Kindness", subtitle: "Join the Pro-App ecosystem." } },
      { key: "home.howItWorks", value: { step1: "Sign up", step2: "Perform acts", step3: "Create ripples" } }
    ]);

    // 2. Seed a Sample Contact Submission
    await ContactSubmission.deleteMany({});
    await ContactSubmission.create({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello team, I love the Pro-Admin dashboard!",
      handled: false
    });

    // 3. Seed a Testimonial
    await Testimonial.deleteMany({});
    await Testimonial.create({
      name: "Sarah Jenkins",
      quote: "This platform changed how our community tracks kindness acts. Absolutely stellar!",
      approved: true
    });

    console.log("✅ Public & Admin mock data seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedData();