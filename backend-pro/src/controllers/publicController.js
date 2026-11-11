// src/controllers/publicController.js
import SiteContent from "../models/SiteContent.js";
import Testimonial from "../models/Testimonial.js";
import ContactSubmission from "../models/ContactSubmission.js";

/**
 * GET /public/site-content?keys=home.hero,home.howItWorks
 * Returns an object keyed by content key.
 */
export const getSiteContent = async (req, res) => {
  try {
    const keys = (req.query.keys || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      return res.json({});
    }

    const docs = await SiteContent.find({ key: { $in: keys } }).lean();
    const result = {};
    docs.forEach((d) => {
      result[d.key] = d.value;
    });

    return res.json(result);
  } catch (err) {
    console.error("getSiteContent error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /public/testimonials
 * Returns approved testimonials sorted newest first.
 */
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ testimonials });
  } catch (err) {
    console.error("getTestimonials error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * POST /public/contact
 * Stores a contact submission. Non-fatal email sending can be added later.
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doc = await ContactSubmission.create({ name, email, message });
    //return res.json({ success: true, id: doc._id });
    // Use 201 for successful resource creation
    return res.status(201).json({ success: true, id: doc._id, item: doc });
  } catch (err) {
    console.error("submitContact error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * POST /public/testimonials
 * Submits a new testimonial for admin approval.
 */
export const submitTestimonial = async (req, res) => {
  try {
    const { name, quote, avatarUrl } = req.body;
    if (!quote) {
      return res.status(400).json({ message: "Quote is required" });
    }

    const doc = await Testimonial.create({
      name: name || "Community Member",
      quote,
      avatarUrl: avatarUrl || "",
      approved: false, // Default to pending review
    });

    return res.status(201).json({ success: true, item: doc });
  } catch (err) {
    console.error("submitTestimonial error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
