// backend/src/controllers/admin/actAdminController.js
import KindnessAct from "../../models/KindnessAct.js";
import Invite from "../../models/Invite.js";
import Ripple from "../../models/Ripple.js";
import AdminLog from "../../models/admin/AdminLog.js";

/**
 * GET /admin/acts?page=1&limit=10&search=&status=&actType=
 */
export const getAllActsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      actType = "",
    } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const query = {};

    if (status) query.status = status;
    if (actType) query.actType = actType;

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { actDescription: { $regex: search, $options: "i" } },
        { place: { $regex: search, $options: "i" } },
        { receiverEmail: { $regex: search, $options: "i" } },
      ];
    }

    const total = await KindnessAct.countDocuments(query);
    const acts = await KindnessAct.find(query)
      .populate("helper", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const now = new Date();

    // Attach invite codes, check expiration, and auto-expire in DB using updateOne
    const actsWithInvites = await Promise.all(
      acts.map(async (act) => {
        let inviteCode = null;
        let expiresAt = null;
        let effectiveStatus = act.status;

        const invite = await Invite.findOne({ act: act._id });
        if (invite) {
          inviteCode = invite.code;
          expiresAt = invite.expiresAt;

          const isTimeExpired =
            invite.expiresAt && new Date(invite.expiresAt) < now;
          if (
            (act.status === "pending" || invite.status === "pending") &&
            (isTimeExpired || invite.status === "expired")
          ) {
            effectiveStatus = "expired";

            if (invite.status !== "expired") {
              await Invite.updateOne(
                { _id: invite._id },
                { $set: { status: "expired", expiredAt: now } },
              );
            }

            if (act.status !== "expired") {
              await KindnessAct.updateOne(
                { _id: act._id },
                { $set: { status: "expired", denialReason: "Invite expired" } },
              );
            }

            // Sync ripples
            await Ripple.updateMany(
              { act: act._id },
              { $set: { status: "denied", updatedAt: now } },
            );
          }
        }

        return {
          ...act,
          status: effectiveStatus,
          inviteCode,
          expiresAt,
        };
      }),
    );

    return res.json({
      acts: actsWithInvites,
      pagination: {
        total,
        page: pageNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (err) {
    console.error("getAllActsAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * DELETE /admin/acts/:id
 */
export const deleteActAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const act = await KindnessAct.findByIdAndDelete(id);
    if (!act) {
      return res.status(404).json({ message: "Act not found" });
    }

    // Clean up associated invite and ripples
    await Invite.deleteMany({ act: id });
    await Ripple.deleteMany({ act: id });

    // Non-fatal admin log
    (async () => {
      try {
        await AdminLog.create({
          adminId: req.user?._id || null,
          actionCode: "ACT_DELETED",
          actionLabel: "Deleted Kindness Act",
          details: `Deleted act ID: ${id} (${act.actType || "Unknown"})`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    res.json({ message: "Act deleted successfully" });
  } catch (err) {
    console.error("deleteActAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * PUT /admin/acts/:id/status
 * Body: { status: 'confirmed' | 'pending' | 'denied' | 'expired' }
 */
export const updateActStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const act = await KindnessAct.findById(id);
    if (!act) {
      return res.status(404).json({ message: "Act not found" });
    }

    const oldStatus = act.status;
    act.status = status;
    await act.save();

    // Sync associated invite status if status changed manually by admin
    await Invite.updateOne(
      { act: id },
      {
        $set: {
          status:
            status === "confirmed"
              ? "redeemed"
              : status === "denied"
                ? "denied"
                : status,
        },
      },
    );

    // Non-fatal admin log
    (async () => {
      try {
        await AdminLog.create({
          adminId: req.user?._id || null,
          actionCode: "ACT_STATUS_UPDATED",
          actionLabel: "Updated Act Status",
          details: `Act ID: ${id}, Old Status: ${oldStatus}, New Status: ${status}`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    res.json({ message: "Act status updated successfully", act });
  } catch (err) {
    console.error("updateActStatusAdmin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
