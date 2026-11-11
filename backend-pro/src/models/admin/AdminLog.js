// src/models/admin/AdminLog.js
import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    // New stable code (machine-friendly)
    actionCode: { type: String, required: true, index: true },
    // Human readable label
    actionLabel: { type: String, required: true },
    // Keep old field for now to avoid breaking anything during migration
    action: { type: String },
    details: { type: String },
  },
  { timestamps: true },
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;

/**
 🔑 Why These Models
User → core identity, role-based access.

Token → refresh token storage for secure sessions.

AdminLog → optional, but helps track admin actions (like deleting users, updating roles).
 */
