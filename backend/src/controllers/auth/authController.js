// src/controllers/auth/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user/User.js";
import Token from "../../models/auth/Token.js";

// Cookie security options helper
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// Register Controller
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // default role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      requestId: req.requestId,
    });
    console.log(`New user registered: ${user.email}`);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  try {
    // ✅ Debug log
    //  console.log("Incoming login:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // ✅ Debug log
    // console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const refreshTokenVal = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await Token.create({
      userId: user._id,
      refreshToken: refreshTokenVal,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ✅ Set tokens as secure HttpOnly cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshTokenVal, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ include user object in JSON response (no raw tokens exposed)
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Refresh Token Controller
export const refreshToken = async (req, res) => {
  try {
    const tokenCookie = req.cookies?.refreshToken;

    if (!tokenCookie) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // Find token in DB
    const storedToken = await Token.findOne({ refreshToken: tokenCookie });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      return res.status(403).json({ message: "Refresh token expired" });
    }

    // Verify token
    const decoded = jwt.verify(tokenCookie, process.env.JWT_REFRESH_SECRET);

    // Issue new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired refresh token",
      error: err.message,
    });
  }
};

// Logout Controller
export const logoutUser = async (req, res) => {
  try {
    const tokenCookie = req.cookies?.refreshToken;

    if (tokenCookie) {
      // 🧹 Remove token from DB
      await Token.findOneAndDelete({ refreshToken: tokenCookie });
    } else if (req.user) {
      // Fallback: remove all tokens for this user if refreshToken cookie isn't present
      await Token.deleteMany({ userId: req.user._id });
    }

    // Clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

/**
 🔑 How It Works
Register → creates a new user with hashed password.

Login → issues access + refresh tokens.

Refresh → issues new access token using refresh token.

Logout → deletes refresh token from DB, ending the session.
 */
/**
 * 🔑 Why This Is Important
Access token → expires quickly (1h), used for normal requests.

Refresh token → lasts longer (7d), stored in DB, used to get new access tokens.

Security → you can revoke refresh tokens by deleting them from the Token collection.
 
▶️ Flow After Update
Login → returns both accessToken and refreshToken.

Refresh → client sends refreshToken to /api/auth/refresh, backend verifies it, issues new accessToken.

Logout → you can delete the refresh token from DB to invalidate it.
 */
