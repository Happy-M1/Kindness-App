// models/ImpactStory.js
import mongoose from "mongoose";

const impactStorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["request_help", "offer_help"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    proofVideos: {
      beginning: { type: String, default: "" }, // URL to start/initial situation
      progress: { type: String, default: "" },  // URL to middle/development
      ending: { type: String, default: "" },     // URL to resolution/final outcome
    },
  },
  { timestamps: true }
);

export default mongoose.model("ImpactStory", impactStorySchema);