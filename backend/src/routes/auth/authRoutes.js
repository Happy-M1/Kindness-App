// src/routes/auth/authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../../controllers/auth/authController.js";
import { protect } from "../../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
} from "../../middleware/validateAuth.js";
import validationResultMiddleware from "../../middleware/validationResult.js";

const router = express.Router();

// Register new user
router.post(
  "/register",
  validateRegister,
  validationResultMiddleware,
  registerUser,
);

// Login user
router.post("/login", validateLogin, validationResultMiddleware, loginUser);

// Logout user (protected)
router.post("/logout", protect, logoutUser);

// Refresh token
router.post("/refresh", refreshToken);

// ✅ Get current user profile
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
