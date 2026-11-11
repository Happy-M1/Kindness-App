// src/models/ContactSubmission.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const ContactSubmission = mongoose.model("ContactSubmission", contactSchema);
export default ContactSubmission;
