// routes/adminImpactRoutes.js (or src/routes/admin/adminImpactRoutes.js)
import express from "express";
import {
  getAdminStories,
  updateStoryStatus,
  deleteStory,
} from "../controllers/impactStoryController.js"; // Adjust relative path to controllers
import { protect } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Apply protect and adminMiddleware to all routes in this file
router.use(protect, adminMiddleware);

router.get("/", getAdminStories);
router.put("/:id/status", updateStoryStatus);
router.delete("/:id", deleteStory);

export default router;