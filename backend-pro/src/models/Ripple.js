// src/models/Ripple.js
import mongoose from "mongoose";

const rippleSchema = new mongoose.Schema(
  {
    act: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KindnessAct",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ripple",
      default: null,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ripple" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "denied"],
      default: "pending",
    },
    depth: { type: Number },
    branchIndex: { type: Number },
    place: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Ripple", rippleSchema);
