// backend/src/routes/inviteRoutes.js

import express from "express";
//import cookieParser from "cookie-parser";

import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createInvite,
  redeemInvite,
  denyInvite,
  expireInvite, // ✅ use controller version
} from "../controllers/inviteController.js";
import Invite from "../models/Invite.js";

//app.use(cookieParser());
const router = express.Router();

// Create a new invite (creates act + ripples)
router.post("/", protect, createInvite);

// Redeem an invite (confirm act + ripples)
router.post("/accept", protect, redeemInvite);

// Deny an invite (deny act + ripples)
router.post("/deny", protect, denyInvite);

// Expire invite manually (admin action, also updates act + ripples)
router.post("/expire", protect, admin, expireInvite);

// List all invites (admin view)
router.get("/", protect, admin, async (req, res) => {
  try {
    const invites = await Invite.find()
      .populate("inviter", "username email")
      .populate("act", "description status denialReason");

    const formatted = invites.map((inv) => ({
      code: inv.code,
      receiverEmail: inv.receiverEmail,
      status: inv.status,
      expiresAt: inv.expiresAt,
      redeemedAt: inv.redeemedAt,
      inviter: inv.inviter,
      act: inv.act,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching invites:", err);
    res.status(500).json({ error: "Failed to fetch invites" });
  }
});

export default router;
