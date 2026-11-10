// src/routes/rippleRoutes.js
import express from "express";
import KindnessAct from "../models/KindnessAct.js";
import buildRippleGraph from "../utils/buildRippleGraph.js";
import { protect } from "../middleware/authMiddleware.js";
import { getEcosystemGraph } from "../controllers/admin/adminProfileController.js";

const router = express.Router();

// Global ripple graph for users
router.get("/global", async (req, res) => {
  try {
    const acts = await KindnessAct.find({})
      .populate("helper", "username name email imageUrl createdAt")
      .populate("receiver", "username name email imageUrl createdAt")
      .lean();

    const graph = buildRippleGraph(acts);
    res.json(graph);
  } catch (err) {
    console.error("Global ripple error:", err);
    res
      .status(500)
      .json({ message: "Failed to build ripple graph", error: err.message });
  }
});

// Personal ripple graph for logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email ? req.user.email.toLowerCase().trim() : "";

    const acts = await KindnessAct.find({
      $or: [
        { helper: userId },
        { receiver: userId },
        { receiverEmail: { $regex: new RegExp(`^${userEmail}$`, "i") } },
      ],
    })
      .populate("helper", "username name email imageUrl createdAt")
      .populate("receiver", "username name email imageUrl createdAt")
      .lean();

    const graph = buildRippleGraph(acts);
    res.json(graph);
  } catch (err) {
    console.error("Personal ripple error:", err);
    res.status(500).json({
      message: "Failed to build personal ripple graph",
      error: err.message,
    });
  }
});

router.get("/ecosystem", protect, getEcosystemGraph);

export default router;
