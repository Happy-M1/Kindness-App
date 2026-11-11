// backend/src/models/admin/ProfileApprovalRequest.js
import mongoose from "mongoose";

const profileApprovalSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  role: { type: String, default: "moderator_admin" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("ProfileApprovalRequest", profileApprovalSchema);