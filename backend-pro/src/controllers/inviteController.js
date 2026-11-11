// src/controllers/inviteController.js

import Invite from "../models/Invite.js";
import KindnessAct from "../models/KindnessAct.js";
import Ripple from "../models/Ripple.js";
import User from "../models/user/User.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Create a new invite (with act + ripples)
// @route   POST /api/invites
export const createInvite = async (req, res) => {
  try {
    const { actDescription, actType, place, receiverEmail, value, media } =
      req.body;
    console.log("➡️ CreateInvite called by user:", req.user?._id);
    console.log("📩 Create request payload:", {
      actDescription,
      actType,
      place,
      receiverEmail,
      value,
      media,
    });

    if (!receiverEmail) {
      console.warn("🚫 Invite creation blocked: missing receiverEmail");
      return res
        .status(400)
        .json({ success: false, message: "Receiver email is required" });
    }

    const cleanReceiverEmail = receiverEmail
      ? receiverEmail.toLowerCase().trim()
      : "";

    const act = await KindnessAct.create({
      description: actDescription,
      actType,
      place,
      value,
      media,
      receiverEmail: cleanReceiverEmail, // 👈 Save it here!
      helper: req.user._id,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("✅ Act created:", {
      id: act._id.toString(),
      status: act.status,
    });

    // ✅ Generate short invite code
    const code = uuidv4().slice(0, 8);
    console.log("🔑 Generated invite code:", code);

    // ✅ Set expiry (24h)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    console.log("⏳ Invite expiry set:", expiry);

    // ✅ Create invite linked to act
    const invite = await Invite.create({
      code,
      act: act._id,
      inviter: req.user._id,
      receiverEmail,
      status: "pending",
      expiresAt: expiry,
    });
    console.log("✅ Invite created:", {
      id: invite._id.toString(),
      code: invite.code,
      status: invite.status,
    });

    // ✅ Ensure giver ripple exists
    const giverRipple = await Ripple.findOneAndUpdate(
      { act: act._id, user: req.user._id },
      { $set: { status: "pending", parent: null } },
      { upsert: true, returnDocument: "after" },
    );
    console.log("🔄 Giver ripple upserted:", giverRipple?._id);

    // ✅ Ensure receiver ripple exists (pending)
    const receiver = await User.findOne({ email: receiverEmail });
    if (receiver) {
      const receiverRipple = await Ripple.findOneAndUpdate(
        { act: act._id, user: receiver._id },
        { $set: { status: "pending", parent: req.user._id } },
        { upsert: true, returnDocument: "after" },
      );
      console.log("🔄 Receiver ripple upserted:", receiverRipple?._id);
    } else {
      console.warn("⚠️ No user found for receiverEmail:", receiverEmail);
    }

    // ✅ Inspect DB state after creation
    const ripples = await Ripple.find({ act: act._id });
    console.log(
      "📊 Ripples after creation:",
      ripples.map((r) => ({
        id: r._id.toString(),
        user: r.user.toString(),
        status: r.status,
      })),
    );

    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      invite: {
        code: invite.code,
        expiresAt: invite.expiresAt,
        act: act._id,
        status: invite.status,
      },
    });
  } catch (err) {
    console.error("❌ Invite creation error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create invite" });
  }
};

// @desc    Redeem an invite
// @route   POST /api/invites/accept
export const redeemInvite = async (req, res) => {
  try {
    console.log("➡️ RedeemInvite called by user:", req.user?._id);

    const { code, receiverEmail } = req.body;
    console.log("📩 Redeem request payload:", { code, receiverEmail });

    const invite = await Invite.findOne({ code });
    if (!invite) {
      console.warn("⚠️ No invite found for code:", code);
      return res
        .status(400)
        .json({ success: false, message: "Invalid invite code" });
    }
    console.log("📄 Invite found:", {
      code: invite.code,
      status: invite.status,
      receiverEmail: invite.receiverEmail,
      expiresAt: invite.expiresAt,
    });

    if (invite.status !== "pending") {
      console.warn("⚠️ Invite not pending:", invite.status);
      return res
        .status(400)
        .json({ success: false, message: "Invite is not pending" });
    }

    // ✅ check expiry
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      console.warn("⚠️ Invite expired at:", invite.expiresAt);
      invite.status = "expired";
      await invite.save();
      return res
        .status(400)
        .json({ success: false, message: "Invite has expired" });
    }

    // ✅ restrict redemption to intended receiver
    const effectiveEmail = receiverEmail || req.user?.email;
    console.log("👤 Effective email for redemption:", effectiveEmail);

    if (invite.receiverEmail && invite.receiverEmail !== effectiveEmail) {
      console.warn(
        "🚫 Redemption blocked. Invite receiver:",
        invite.receiverEmail,
        "Attempted by:",
        effectiveEmail,
      );
      return res.status(403).json({
        success: false,
        message: "This invite is not assigned to your account",
      });
    }

    // ✅ mark invite as redeemed
    invite.status = "redeemed";
    invite.redeemedBy = req.user?._id;
    invite.redeemedAt = new Date();
    await invite.save();
    console.log("✅ Invite redeemed:", invite._id);

    // ✅ confirm act + update ripples
    if (invite.act) {
      const act = await KindnessAct.findById(invite.act);
      if (act) {
        act.status = "confirmed";
        act.confirmedAt = new Date();
        act.receiver = req.user?._id;
        await act.save();
        console.log("✅ Act confirmed:", act._id);

        // Update giver ripple
        const giverUpdate = await Ripple.updateOne(
          { act: act._id, user: act.helper },
          { $set: { status: "confirmed", updatedAt: new Date() } },
        );
        console.log("🔄 Giver ripple update result:", giverUpdate);

        // Update or create receiver ripple
        const receiverRipple = await Ripple.findOneAndUpdate(
          { act: act._id, user: req.user?._id },
          {
            $set: {
              status: "confirmed",
              updatedAt: new Date(),
              parent: act.helper,
            },
          },
          { upsert: true, returnDocument: "after" },
        );
        console.log("🔄 Receiver ripple upserted:", receiverRipple?._id);

        // Inspect DB state after redeem
        const ripples = await Ripple.find({ act: act._id });
        console.log(
          "📊 Ripples after redeem:",
          ripples.map((r) => ({
            id: r._id.toString(),
            user: r.user.toString(),
            status: r.status,
          })),
        );
      }
    }

    res.json({
      success: true,
      message: "Invite redeemed successfully",
      invite: {
        code: invite.code,
        act: invite.act,
        status: invite.status,
        redeemedAt: invite.redeemedAt,
      },
    });
  } catch (err) {
    console.error("❌ Invite redemption error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to redeem invite" });
  }
};

// @desc    Deny an invite
// @route   POST /api/invites/deny
export const denyInvite = async (req, res) => {
  try {
    const { code, reason } = req.body;
    console.log("➡️ DenyInvite called by user:", req.user?._id);
    console.log("📩 Deny request payload:", { code, reason });

    const invite = await Invite.findOne({ code });
    if (!invite || invite.status !== "pending") {
      console.warn("⚠️ No invite found for code:", code);
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired invite" });
    }
    console.log("📄 Invite found:", {
      code: invite.code,
      status: invite.status,
      receiverEmail: invite.receiverEmail,
    });

    if (invite.status !== "pending") {
      console.warn("⚠️ Invite not pending:", invite.status);
      return res
        .status(400)
        .json({ success: false, message: "Invite is not pending" });
    }

    // Mark invite as denied
    invite.status = "denied";
    invite.denialReason = reason || "No reason provided";
    invite.deniedAt = new Date();
    await invite.save();
    console.log("✅ Invite denied:", invite._id);

    // Update act status
    if (invite.act) {
      const act = await KindnessAct.findById(invite.act);
      if (act) {
        act.status = "denied";
        act.denialReason = reason || "No reason provided";
        act.deniedAt = new Date();
        await act.save();
        console.log("✅ Act denied:", act._id);

        // Update giver ripple
        const giverUpdate = await Ripple.updateOne(
          { act: act._id, user: act.helper },
          { $set: { status: "denied", updatedAt: new Date() } },
        );
        console.log("🔄 Giver ripple update result:", giverUpdate);

        // Update receiver ripple if user exists
        if (invite.receiverEmail) {
          const receiverUser = await User.findOne({
            email: invite.receiverEmail,
          });
          if (receiverUser) {
            const receiverRipple = await Ripple.findOneAndUpdate(
              { act: act._id, user: receiverUser._id },
              {
                $set: {
                  status: "denied",
                  updatedAt: new Date(),
                  parent: act.helper,
                },
              },
              { upsert: true, returnDocument: "after" },
            );
            console.log("🔄 Receiver ripple upserted:", receiverRipple?._id);
          } else {
            console.warn(
              "⚠️ No user found for receiverEmail:",
              invite.receiverEmail,
            );
          }
        }
      }
    }

    // ✅ Inspect DB state after denial
    const ripples = await Ripple.find({ act: invite.act });
    console.log(
      "📊 Ripples after denial:",
      ripples.map((r) => ({
        id: r._id.toString(),
        user: r.user.toString(),
        status: r.status,
      })),
    );

    res.json({ success: true, message: "Invite denied successfully" });
  } catch (err) {
    console.error("Invite denial error:", err);
    res.status(500).json({ success: false, message: "Failed to deny invite" });
  }
};

// @desc    Expire an invite (admin action)
// @route   POST /api/invites/expire
export const expireInvite = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("➡️ ExpireInvite called by admin:", req.user?._id);
    console.log("📩 Expire request payload:", { code });

    const invite = await Invite.findOne({ code });
    if (!invite) {
      console.warn("⚠️ No invite found for code:", code);
      return res
        .status(400)
        .json({ success: false, message: "Invalid invite code" });
    }
    console.log("📄 Invite found:", {
      code: invite.code,
      status: invite.status,
      receiverEmail: invite.receiverEmail,
    });

    if (invite.status !== "pending") {
      console.warn("⚠️ Invite not pending:", invite.status);
      return res
        .status(400)
        .json({ success: false, message: "Invite is not pending" });
    }

    // ✅ Mark invite as expired
    invite.status = "expired";
    invite.expiredAt = new Date();
    await invite.save();
    console.log("✅ Invite expired:", invite._id);

    // ✅ Update act status
    if (invite.act) {
      const act = await KindnessAct.findById(invite.act);
      if (act) {
        act.status = "denied";
        act.denialReason = "Invite expired by admin";
        act.deniedAt = new Date();
        await act.save();
        console.log("✅ Act marked denied due to expiry:", act._id);

        // Update giver ripple
        const giverUpdate = await Ripple.updateOne(
          { act: act._id, user: act.helper },
          { $set: { status: "denied", updatedAt: new Date() } },
        );
        console.log("🔄 Giver ripple update result:", giverUpdate);

        // Update or create receiver ripple
        if (invite.receiverEmail) {
          const receiverUser = await User.findOne({
            email: invite.receiverEmail,
          });
          if (receiverUser) {
            const receiverRipple = await Ripple.findOneAndUpdate(
              { act: act._id, user: receiverUser._id },
              {
                $set: {
                  status: "denied",
                  updatedAt: new Date(),
                  parent: act.helper,
                },
              },
              { upsert: true, returnDocument: "after" },
            );
            console.log("🔄 Receiver ripple upserted:", receiverRipple?._id);
          } else {
            console.warn(
              "⚠️ No user found for receiverEmail:",
              invite.receiverEmail,
            );
          }
        }
      }
    }

    // ✅ Inspect DB state after expiry
    const ripples = await Ripple.find({ act: invite.act });
    console.log(
      "📊 Ripples after expiry:",
      ripples.map((r) => ({
        id: r._id.toString(),
        user: r.user.toString(),
        status: r.status,
      })),
    );

    res.json({ success: true, message: "Invite expired successfully" });
  } catch (err) {
    console.error("❌ Expire invite error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to expire invite" });
  }
};
