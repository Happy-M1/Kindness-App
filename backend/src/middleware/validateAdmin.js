// backend/src/middleware/validateAdmin.js
import { body, param } from "express-validator";

export const validateUpdateUserRole = [
  param("id").isMongoId().withMessage("Valid user ID is required"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["user", "admin", "superadmin", "system_admin", "moderator_admin"])
    .withMessage("Invalid user role specified"),
];

export const validateDeleteUser = [
  param("id").isMongoId().withMessage("Valid user ID is required"),
];

/*
🔑 How It Works
Delete user → validates id is a proper MongoDB ObjectId.

Update user role → validates id and ensures role is either "user" or "admin".

If validation fails → returns 400 with error details.

If validation passes → continues to controller logic.
*/
