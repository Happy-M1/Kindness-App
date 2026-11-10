// src/models/KindnessAct.js

import mongoose from "mongoose";

const actSchema = new mongoose.Schema(
  {
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // ✅ extra fields for non-registered receivers
    receiverName: { type: String },
    receiverEmail: { type: String },

    description: { type: String, required: true },
    actType: { type: String, default: "general" },
    value: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "denied"],
      default: "pending",
    },
    media: [{ type: String }],
    ripples: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ripple" }],
    place: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("KindnessAct", actSchema);
