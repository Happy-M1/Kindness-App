// backend/src/models/user/User.js

// src/models/user/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "moderator_admin", "system_admin"],
      default: "user",
    }, // 👈 Added "superadmin"
    imageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
