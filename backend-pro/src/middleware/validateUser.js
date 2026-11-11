// src/middleware/validateUser.js
import { body } from "express-validator";

// Ensure req.body exists (multer will populate it when used)
const ensureBody = (req, res, next) => {
  if (!req.body) req.body = {};
  next();
};

export const validateUpdateProfile = [
  ensureBody,
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/*
🔑 How It Works
Username → must be at least 3 characters if provided.

Email → must be valid if provided.

Password → must be at least 6 characters if provided.

If validation fails → returns 400 with error details.

If validation passes → continues to updateUserProfile.
*/
