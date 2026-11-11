// backend/src/controllers/user/userController.js
import { logInfo, logError } from "../../utils/logger.js";
import User from "../../models/user/User.js";
import bcrypt from "bcrypt";
import cloudinary from "../../config/cloudinary.js";

// Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    /*
    // Debugging: log incoming fields
    logInfo(
      `Profile update req.body: ${JSON.stringify(req.body)}`,
      req.requestId,
    );
    logInfo(`Profile update has file: ${!!req.file}`, req.requestId);
    */
    const user = await User.findById(req.user._id);
    if (!user) {
      //  logError("User not found", req.requestId);
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    // If an image file was uploaded, upload to Cloudinary and set imageUrl
    if (req.file) {
      // Upload buffer to Cloudinary using upload_stream
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", public_id: `user_${user._id}_${Date.now()}` },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        user.imageUrl = uploadResult.secure_url;
      }
    }

    const updatedUser = await user.save();
    // logInfo(`User ${req.user._id} updated profile successfully`, req.requestId);

    return res.json({
      message: "Profile updated successfully",
      data: {
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          imageUrl: updatedUser.imageUrl,
        },
      },
      requestId: req.requestId,
    });
  } catch (err) {
    // logError(`Profile update failed: ${err.message}`, req.requestId);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 🔑 How It Works
getProfile → Fetches the logged‑in user’s profile using req.user.id (from JWT). Excludes the password field.

updateProfile → Allows updating username, email, and password. Passwords are re‑hashed before saving.

Security → Only the authenticated user can access their own profile.

🔑 How It Works
getUserProfile → returns the logged-in user’s details (excluding password).

updateUserProfile → allows user to update username, email, and password.

Protected by authMiddleware → only logged-in users can access their profile.

✅ End Result
Your backend now supports:

Users registering and logging in.

Users refreshing tokens and logging out.

Users viewing and updating their own profile.

Admins managing all users with secure role-based access.
 */
