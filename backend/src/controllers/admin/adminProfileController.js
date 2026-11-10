// src/controllers/admin/adminProfileController.js
import cloudinary from "../../config/cloudinary.js";
import User from "../../models/user/User.js";
import KindnessAct from "../../models/KindnessAct.js";
import ProfileApprovalRequest from "../../models/admin/ProfileApprovalRequest.js";
import bcrypt from "bcrypt"; // or bcryptjs matching your setup

// 1. Upload Avatar to Cloudinary
export const uploadAdminAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "pro-admin/avatars",
    });

    res.json({ imageUrl: uploadResponse.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res
      .status(500)
      .json({ message: "Cloudinary upload failed", error: err.message });
  }
};

// 2. GET Current Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminUser = await User.findById(req.user._id).select("-password");
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.json(adminUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3. PUT Update Profile (with moderator approval check)
export const updateAdminProfile = async (req, res) => {
  try {
    const { username, email, imageUrl } = req.body;
    const adminUser = await User.findById(req.user._id);

    if (!adminUser) {
      return res
        .status(404)
        .json({ message: "Admin user not found in database." });
    }

    // system_admin updates instantly
    if (adminUser.role === "system_admin") {
      adminUser.username = username || adminUser.username;
      adminUser.email = email || adminUser.email;
      adminUser.imageUrl =
        imageUrl !== undefined ? imageUrl : adminUser.imageUrl;
      await adminUser.save();
      return res.json({
        message: "Profile updated successfully",
        item: adminUser,
        requiresApproval: false,
      });
    }

    // moderator_admin triggers approval request for system_admin
    await ProfileApprovalRequest.create({
      adminId: adminUser._id,
      username,
      email,
      imageUrl,
      role: adminUser.role,
      status: "pending",
    });

    res.json({
      message: "Profile update submitted for System Admin approval.",
      requiresApproval: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
};

// 4. GET Pending Approvals (Protected by systemAdmin middleware)
export const getProfileApprovals = async (req, res) => {
  try {
    const requests = await ProfileApprovalRequest.find({
      status: "pending",
    }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch approvals", error: err.message });
  }
};

// 5. PUT Approve or Reject Request (Protected by systemAdmin middleware)
export const handleProfileApprovalAction = async (req, res) => {
  try {
    const { approved } = req.body;
    const request = await ProfileApprovalRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Approval request not found" });

    if (approved) {
      await User.findByIdAndUpdate(request.adminId, {
        username: request.username,
        email: request.email,
        imageUrl: request.imageUrl,
      });
      request.status = "approved";
    } else {
      request.status = "rejected";
    }

    await request.save();
    res.json({ message: `Request ${request.status} successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to process request", error: err.message });
  }
};

// 6. Ecosystem Graph Dataset
export const getEcosystemGraph = async (req, res) => {
  try {
    const users = await User.find()
      .select("username name email createdAt imageUrl role")
      .lean();
    const acts = await KindnessAct.find()
      .populate("helper", "username name email imageUrl createdAt role")
      .populate("receiver", "username name email imageUrl createdAt role")
      .lean();

    const nodesMap = new Map();

    // 1. Map all registered users first
    users.forEach((u) => {
      const uId = u._id.toString();
      nodesMap.set(uId, {
        id: uId,
        username: u.username || u.name || "User",
        name: u.username || u.name || "User",
        email: u.email,
        createdAt: u.createdAt,
        imageUrl:
          u.imageUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || "User")}`,
        type: "user",
        role: u.role || "member",
      });
    });

    // Create a quick lookup map from email to user ID
    const emailToIdMap = new Map();
    users.forEach((u) => {
      if (u.email)
        emailToIdMap.set(u.email.toLowerCase().trim(), u._id.toString());
    });

    const edges = [];

    // 2. Process all acts into nodes and edges without dropping anything
    acts.forEach((a) => {
      if (!a.helper) return;

      const sourceId = a.helper._id
        ? a.helper._id.toString()
        : a.helper.toString();

      let targetId = null;
      let targetName = a.receiverName || "Receiver";
      let targetEmail = a.receiverEmail || "N/A";
      let targetRole = "member";

      if (a.receiver) {
        targetId =
          typeof a.receiver === "object"
            ? a.receiver._id
              ? a.receiver._id.toString()
              : a.receiver.toString()
            : a.receiver.toString();
        if (typeof a.receiver === "object") {
          targetName = a.receiver.username || a.receiver.name || targetName;
          targetEmail = a.receiver.email || targetEmail;
        }
      } else if (a.receiverEmail) {
        const cleanEmail = a.receiverEmail.toLowerCase().trim();
        targetId = emailToIdMap.has(cleanEmail)
          ? emailToIdMap.get(cleanEmail)
          : cleanEmail;
        targetEmail = cleanEmail;
      }

      if (!targetId) return;

      // Ensure helper node exists
      if (typeof a.helper === "object" && a.helper._id) {
        nodesMap.set(sourceId, {
          id: sourceId,
          username: a.helper.username || a.helper.name || "User",
          name: a.helper.username || a.helper.name || "User",
          email: a.helper.email,
          createdAt: a.helper.createdAt,
          imageUrl:
            a.helper.imageUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(a.helper.username || "User")}`,
          type: "user",
          role: a.helper.role || "member",
        });
      }

      // Ensure target node exists (even if registered via email string)
      if (!nodesMap.has(targetId)) {
        nodesMap.set(targetId, {
          id: targetId,
          username: targetName,
          name: targetName,
          email: targetEmail,
          imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(targetName)}`,
          type: "user",
          //role: a.receiver.role,
          role: targetRole,
        });
      }

      // ✅ Push edge with unique ID so D3 registers every act separately
      edges.push({
        id: a._id.toString(),
        source: sourceId,
        target: targetId,
        actType: a.actType || "general",
        type: a.actType || "general",
        description:
          a.description || a.actDescription || "No description provided",
        place: a.place || "Online",
        date: a.createdAt,
        status: a.status || "pending",
        color: a.status === "confirmed" ? "#10b981" : "#f59e0b",
      });
    });

    // ✅ Explicitly return both nodes AND edges wrapped in an object
    return res.json({
      success: true,
      nodes: Array.from(nodesMap.values()),
      edges,
    });
  } catch (err) {
    console.error("Failed to generate ecosystem graph:", err);
    return res.status(500).json({
      message: "Failed to generate ecosystem graph",
      error: err.message,
    });
  }
};

// 7. Update Admin Password
export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long." });
    }

    // Fetch user with password included (since protect middleware excludes it)
    const adminUser = await User.findById(req.user._id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Hash new password and save
    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Password update error:", err);
    return res
      .status(500)
      .json({ message: "Failed to update password", error: err.message });
  }
};
