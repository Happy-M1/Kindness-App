// src/routes/publicRoutes.js
import express from "express";

import {
  getSiteContent,
  getTestimonials,
  submitContact,
  submitTestimonial,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/site-content", getSiteContent);
router.get("/testimonials", getTestimonials);
router.post("/testimonials", submitTestimonial);
router.post("/contact", submitContact);

export default router;
