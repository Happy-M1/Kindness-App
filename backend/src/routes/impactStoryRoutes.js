// routes/impactStoryRoutes.js
import express from "express";
import multer from "multer";
import {
  createStory,
  getPublicStories,
  deleteStory,
} from "../controllers/impactStoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer with memory storage so req.file / req.files buffers are populated
const upload = multer({ storage: multer.memoryStorage() });

router.get("/public", getPublicStories);

// ✅ Crucial order: protect -> upload.fields -> createStory
router.post(
  "/",
  protect,
  upload.fields([
    { name: "beginning", maxCount: 1 },
    { name: "progress", maxCount: 1 },
    { name: "ending", maxCount: 1 },
  ]),
  createStory,
);

router.delete("/:id", protect, deleteStory);

export default router;
