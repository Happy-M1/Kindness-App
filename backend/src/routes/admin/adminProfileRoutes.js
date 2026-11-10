// backend/src/routes/admin/adminProfileRoutes.js
import express from "express";
import multer from "multer";
import { protect, systemAdmin } from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { validatePasswordUpdate } from "../../middleware/validateAuth.js"; // ✅ Imported from validateAuth.js
import validationResultMiddleware from "../../middleware/validationResult.js";
import {
  uploadAdminAvatar,
  getAdminProfile,
  updateAdminProfile,
  getProfileApprovals,
  handleProfileApprovalAction,
  getEcosystemGraph,
  updateAdminPassword,
} from "../../controllers/admin/adminProfileController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload-avatar",
  protect,
  adminMiddleware,
  upload.single("image"),
  uploadAdminAvatar,
);
router.get("/profile", protect, adminMiddleware, getAdminProfile);
router.put("/profile", protect, adminMiddleware, updateAdminProfile);

// ✅ Secured password update with validation middleware
router.put(
  "/password",
  protect,
  adminMiddleware,
  validatePasswordUpdate,
  validationResultMiddleware,
  updateAdminPassword,
);

// System Admin only routes
router.get(
  "/profile-approvals",
  protect,
  adminMiddleware,
  systemAdmin,
  getProfileApprovals,
);
router.put(
  "/profile-approvals/:id",
  protect,
  adminMiddleware,
  systemAdmin,
  handleProfileApprovalAction,
);

router.get("/ecosystem-graph", protect, adminMiddleware, getEcosystemGraph);

export default router;
