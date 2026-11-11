// src/routes/user/userRoutes.js

import express from "express";
import multer from "multer";
import {
  getUserProfile,
  updateUserProfile,
} from "../../controllers/user/userController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { validateUpdateProfile } from "../../middleware/validateUser.js";
import validationResultMiddleware from "../../middleware/validationResult.js";

const router = express.Router();

// configure multer (memory storage is convenient for Cloudinary uploads)
const upload = multer({ storage: multer.memoryStorage() });

// Protected user routes
router.get("/profile", protect, getUserProfile);

// NOTE: upload.single('image') must run before validation/controller so req.body and req.file are populated
router.put(
  "/profile",
  protect,
  upload.single("image"),
  validateUpdateProfile,
  validationResultMiddleware,
  updateUserProfile,
);

export default router;
