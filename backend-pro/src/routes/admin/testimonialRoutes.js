// src/routes/admin/testimonialRoutes.js
import express from "express";
import {
  getTestimonialsAdmin,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial,
} from "../../controllers/admin/testimonialController.js";
import { protect, admin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getTestimonialsAdmin);
router.post("/", protect, admin, createTestimonial);
router.put("/:id/approve", protect, admin, approveTestimonial);
router.delete("/:id", protect, admin, deleteTestimonial);

export default router;
