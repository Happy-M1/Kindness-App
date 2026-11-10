// backend/src/controllers/admin/rippleController.js
import KindnessAct from "../../models/KindnessAct.js";
import buildRippleGraph from "../../utils/buildRippleGraph.js";

/**
 * GET /api/admin/ripple/global
 */
export const getAdminGlobalGraph = async (req, res) => {
  try {
    const acts = await KindnessAct.find({})
      .populate("helper", "username name email imageUrl createdAt")
      .populate("receiver", "username name email imageUrl createdAt")
      .lean();

    const graphData = buildRippleGraph(acts);

    res.json({
      success: true,
      nodes: graphData.nodes,
      edges: graphData.edges,
      stats: {
        totalActs: acts.length,
        totalNodes: graphData.nodes.length,
        totalConnections: graphData.edges.length,
      },
    });
  } catch (err) {
    console.error("Admin global graph error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /api/admin/ripple/user/:userId
 */
export const getAdminUserGraph = async (req, res) => {
  try {
    const { userId } = req.params;
    const acts = await KindnessAct.find({
      $or: [{ helper: userId }, { receiver: userId }],
    })
      .populate("helper", "username name email imageUrl createdAt")
      .populate("receiver", "username name email imageUrl createdAt")
      .lean();

    const graphData = buildRippleGraph(acts);
    res.json({ success: true, nodes: graphData.nodes, edges: graphData.edges });
  } catch (err) {
    console.error("Admin user graph error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
