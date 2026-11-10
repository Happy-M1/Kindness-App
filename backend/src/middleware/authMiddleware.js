// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user/User.js";
import multer from "multer";
import fs from "fs";

// 🔐 Protect middleware: verifies JWT from HttpOnly cookie and attaches user to req
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// 🔐 Admin middleware: allows both standard admins and super admins
export const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "system_admin" || req.user.role === "moderator_admin")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// 🔐 Super Admin middleware: restricts access strictly to superadmin role
export const systemAdmin = (req, res, next) => {
  if (req.user && req.user.role === "system_admin") {
    next();
  } else {
    res.status(403).json({ message: "System Admin access only" });
  }
};

// 📂 Multer setup: temporary storage in "uploads/"
const upload = multer({ dest: "uploads/" });

// Middleware to handle single avatar file upload
export const uploadAvatar = upload.single("avatar");

// Utility to clean up temp files after Cloudinary upload
export const cleanupTempFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to clean up temp file:", err);
  }
};
