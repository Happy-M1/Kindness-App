// src/models/Invite.js

import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    inviter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    act: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KindnessAct",
    },
    receiverEmail: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    receiverName: { type: String },

    status: {
      type: String,
      enum: ["pending", "redeemed", "expired", "denied"],
      default: "pending",
    },
    redeemedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    redeemedAt: { type: Date },
    expiresAt: { type: Date },
    deniedAt: { type: Date },
    denialReason: { type: String },
  },
  { timestamps: true },
);

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
