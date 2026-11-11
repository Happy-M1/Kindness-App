// backend/src/controllers/admin/adminController.js
import User from "../../models/user/User.js";
import AdminLog from "../../models/admin/AdminLog.js";
import Act from "../../models/KindnessAct.js";

/**
 * Get all users with pagination, search, and role filter
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "", role = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -__v")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Non-fatal logging
    (async () => {
      try {
        await AdminLog.create({
          adminId: req.user?._id || null,
          actionCode: "VIEWED_ALL_USERS",
          actionLabel: "Viewed all users",
          details: `Admin ${req.user?.email || "unknown"} requested user list`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    return res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * Delete a user account with Super Admin protection
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🛡️ Standard admins cannot delete Super Admins
    if (targetUser.role === "superadmin" && req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({
          message: "Forbidden: You cannot delete a Super Admin account.",
        });
    }

    // 🛡️ Prevent deleting self
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own active admin account." });
    }

    await User.findByIdAndDelete(id);

    // Non-fatal Audit Log
    (async () => {
      try {
        await AdminLog.create({
          adminId: req.user?._id || null,
          actionCode: "USER_DELETED",
          actionLabel: "Deleted user",
          details: `Deleted user: ${targetUser.username} (${targetUser.email})`,
        });
      } catch (logErr) {
        console.error("AdminLog error:", logErr);
      }
    })();

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * Update user role with Super Admin security rules
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🛡️ Standard admins cannot modify a Super Admin
    if (targetUser.role === "superadmin" && req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot modify a Super Admin." });
    }

    // 🛡️ Standard admins cannot promote anyone to Super Admin
    if (role === "superadmin" && req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: Only a Super Admin can promote someone to Super Admin.",
        });
    }

    const oldRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    // Non-fatal Audit Log
    (async () => {
      try {
        await AdminLog.create({
          adminId: req.user?._id || null,
          actionCode: "USER_ROLE_UPDATED",
          actionLabel: "Updated user role",
          details: `Changed ${targetUser.email} role from ${oldRole} to ${role}`,
        });
      } catch (logErr) {
        console.error("AdminLog error:", logErr);
      }
    })();

    return res.json({
      message: "User role updated successfully",
      user: targetUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * Get all admin logs (legacy)
 */
export const getLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find().populate("adminId", "username email");
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Fetch paginated audit logs
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", action = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {};

    if (search) {
      query.$or = [
        { details: { $regex: search, $options: "i" } },
        { actionLabel: { $regex: search, $options: "i" } },
        { actionCode: { $regex: search, $options: "i" } },
      ];
    }

    if (action) {
      query.$or = [{ actionCode: action }, { actionLabel: action }];
    }

    const total = await AdminLog.countDocuments(query);
    const logs = await AdminLog.find(query)
      .populate("adminId", "email username")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      logs,
      pagination: {
        total,
        page: pageNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
          name: act.helper.username,
          type: "user",
          avatar: act.helper.imageUrl,
        });
      }

      if (act.receiver) {
        const receiverId = act.receiver._id.toString();
        nodesMap.set(receiverId, {
          id: receiverId,
          name: act.receiver.username,
          type: "user",
          avatar: act.receiver.imageUrl,
        });

        links.push({
          source: helperId,
          target: receiverId,
          actType: act.actType,
          status: act.status,
        });
      }
    });

    res.json({
      nodes: Array.from(nodesMap.values()),
      links,
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
