// src/routes/admin/siteContentRoutes.js
import express from "express";
import {
  getAllSiteContent,
  upsertSiteContent,
} from "../../controllers/admin/SiteContentController.js";
import { protect, admin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getAllSiteContent);
router.put("/:key", protect, admin, upsertSiteContent);

export default router;
