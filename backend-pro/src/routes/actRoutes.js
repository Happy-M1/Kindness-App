// src/routes/actRoutes.js
import express from "express";
import KindnessAct from "../models/KindnessAct.js";
import Ripple from "../models/Ripple.js";
import User from "../models/user/User.js";
import Invite from "../models/Invite.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new act
router.post("/", protect, async (req, res) => {
  try {
    const { receiverEmail, receiverName, description, actType, value, place } =
      req.body;
    const helperId = req.user._id;

    let actData = {
      helper: helperId,
      description,
      actType: actType || "general",
      value: value || 0,
      place,
      status: "pending",
    };

    const cleanEmail = receiverEmail ? receiverEmail.toLowerCase().trim() : "";
    if (cleanEmail) {
      const receiverUser = await User.findOne({ email: cleanEmail });
      if (receiverUser) {
        actData.receiver = receiverUser._id;
      }
      actData.receiverEmail = cleanEmail;
    }
    if (receiverName) actData.receiverName = receiverName;

    const act = await KindnessAct.create(actData);

    // Create helper ripple
    await Ripple.create({
      act: act._id,
      user: helperId,
      status: "pending",
      place: place || "global",
      parent: null,
    });

    // Create receiver ripple if email exists
    if (cleanEmail) {
      const receiverUser = await User.findOne({ email: cleanEmail });
      await Ripple.create({
        act: act._id,
        user: receiverUser ? receiverUser._id : null,
        status: "pending",
        place: place || "global",
        parent: helperId,
      });
    }

    res.json({ success: true, act });
  } catch (err) {
    console.error("Error creating act:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get acts for the logged-in user (Helper, Receiver, or Targeted by Email/Invite)
router.get("/my", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email ? req.user.email.toLowerCase().trim() : "";

    // 1. Find pending invites addressed to this user's email
    const pendingInvites = userEmail
      ? await Invite.find({
          receiverEmail: { $regex: new RegExp(`^${userEmail}$`, "i") },
          status: "pending",
        })
      : [];
    const pendingActIds = pendingInvites.map((inv) => inv.act);

    // 2. Find ripples associated with this user
    const userRipples = await Ripple.find({ user: userId });
    const rippleActIds = userRipples.map((r) => r.act);

    // 3. Query all relevant acts
    const acts = await KindnessAct.find({
      $or: [
        { helper: userId },
        { receiver: userId },
        { receiverEmail: { $regex: new RegExp(`^${userEmail}$`, "i") } },
        { _id: { $in: pendingActIds } },
        { _id: { $in: rippleActIds } },
      ],
    })
      .populate("helper", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: -1 });

    // 4. Attach invite codes for pending acts so receivers can accept/deny
    const actsWithInvites = await Promise.all(
      acts.map(async (act) => {
        let inviteCode = null;
        if (act.status === "pending") {
          const invite = await Invite.findOne({ act: act._id });
          if (invite) inviteCode = invite.code;
        }
        return {
          ...act.toObject(),
          inviteCode,
        };
      }),
    );

    res.json({ success: true, acts: actsWithInvites });
  } catch (err) {
    console.error("Error fetching acts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch acts" });
  }
});

export default router;
