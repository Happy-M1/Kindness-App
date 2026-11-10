// backend/src/controllers/rippleController.js
import Act from "../models/Act.js";

/**
 * GET /api/ripple/global
 * Returns global ripple metrics and network nodes/links for admins
 */
// backend/src/controllers/rippleController.js

export const getGlobalRippleData = async (req, res) => {
  try {
    const acts = await Act.find()
      .populate("helper receiver", "username email imageUrl")
      .lean();

    const nodesMap = new Map();
    const links = [];

    acts.forEach((act) => {
      const helperId = act.helper?._id?.toString() || act.helper;

      if (helperId && act.helper) {
        nodesMap.set(helperId, {
          id: helperId,
          username: act.helper.username,
          name: act.helper.username,
          email: act.helper.email,
          imageUrl:
            act.helper.imageUrl ||
            "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg",
          type: "user",
        });
      }

      if (act.receiver) {
        const receiverId = act.receiver._id.toString();
        nodesMap.set(receiverId, {
          id: receiverId,
          username: act.receiver.username,
          name: act.receiver.username,
          email: act.receiver.email,
          imageUrl:
            act.receiver.imageUrl ||
            "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg",
          type: "user",
        });

        // ✅ Add the `id` property so frontend linkCurvature can distinguish sibling edges!
        links.push({
          id: act._id.toString(),
          source: helperId,
          target: receiverId,
          actType: act.actType || "general",
          status: act.status || "pending",
        });
      }
    });

    res.json({
      nodes: Array.from(nodesMap.values()),
      edges: links, // Make sure your frontend reads `edges` or map `links` to `edges`
      stats: {
        totalActs: acts.length,
        totalChained: links.length,
        impactScore: acts.length * 10,
      },
    });
  } catch (err) {
    console.error("Global ripple error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /api/ripple/user/:userId
 * Returns personal ripple tree for a specific user
 */
export const getUserRippleTree = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const userActs = await Act.find({
      $or: [{ helper: userId }, { receiver: userId }],
    })
      .populate("helper receiver", "username email imageUrl")
      .lean();

    res.json({ success: true, acts: userActs });
  } catch (err) {
    console.error("User ripple error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
