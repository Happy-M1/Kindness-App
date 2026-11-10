// src/models/SiteContent.js
import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g., "home.hero"
    value: { type: mongoose.Schema.Types.Mixed, required: true }, // string or object
  },
  { timestamps: true }
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);
export default SiteContent;
