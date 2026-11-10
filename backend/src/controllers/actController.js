// backend/src/controllers/actController.js
import KindnessAct from "../models/KindnessAct.js";
import Invite from "../models/Invite.js";
import Ripple from "../models/Ripple.js";
import User from "../models/user/User.js";

export const getMyActs = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch current logged-in user email
    const currentUser = await User.findById(userId);
    const userEmail = currentUser?.email
      ? currentUser.email.toLowerCase().trim()
      : "";

    // 2. Find pending invites addressed to this user's email
    const pendingInvites = userEmail
      ? await Invite.find({
          receiverEmail: { $regex: new RegExp(`^${userEmail}$`, "i") },
          status: "pending",
        })
      : [];
    const actIdsFromInvites = pendingInvites.map((inv) => inv.act);

    // 3. Find acts where the user has an associated Ripple
    const userRipples = await Ripple.find({ user: userId });
    const actIdsFromRipples = userRipples.map((r) => r.act);

    // 4. Combine all Act IDs where user is helper, confirmed receiver, targeted invitee, or ripple holder
    const acts = await KindnessAct.find({
      $or: [
        { helper: userId },
        { receiver: userId },
        { receiverEmail: { $regex: new RegExp(`^${userEmail}$`, "i") } },
        { _id: { $in: actIdsFromInvites } },
        { _id: { $in: actIdsFromRipples } },
      ],
    })
      .populate("helper", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: -1 });

    const now = new Date();

    // 5. Attach invite codes and auto-expire acts whose invite deadlines have passed
    const actsWithInvites = await Promise.all(
      acts.map(async (act) => {
        let inviteCode = null;
        let expiresAt = null;
        let effectiveStatus = act.status;

        const invite = await Invite.findOne({ act: act._id });
        if (invite) {
          inviteCode = invite.code;
          expiresAt = invite.expiresAt;

          // Check for expiration if act or invite is still pending
          const isTimeExpired =
            invite.expiresAt && new Date(invite.expiresAt) < now;
          if (
            (act.status === "pending" || invite.status === "pending") &&
            (isTimeExpired || invite.status === "expired")
          ) {
            effectiveStatus = "expired";

            // Persist expiration status to DB if not already updated
            if (invite.status !== "expired") {
              invite.status = "expired";
              invite.expiredAt = now;
              await invite.save();
            }

            if (act.status !== "expired") {
              act.status = "expired";
              act.denialReason = "Invite expired";
              await act.save();
            }

            // Sync giver and receiver ripples to reflect expired state
            await Ripple.updateMany(
              { act: act._id },
              { $set: { status: "denied", updatedAt: now } },
            );
          }
        }

        return {
          ...act.toObject(),
          status: effectiveStatus,
          inviteCode,
          expiresAt,
        };
      }),
    );

    res.json({ success: true, acts: actsWithInvites });
  } catch (err) {
    console.error("Error fetching acts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch acts" });
  }
};
