// src/routes/admin/contactRoutes.js
import express from "express";
import {
  getContactsAdmin,
  handleContact,
} from "../../controllers/admin/contactController.js";
import { protect, admin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getContactsAdmin);
router.put("/:id/handle", protect, admin, handleContact);

export default router;
