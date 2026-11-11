// src/controllers/admin/testimonialController.js
import Testimonial from "../../models/Testimonial.js";
import AdminLog from "../../models/admin/AdminLog.js";

/**
 * GET /admin/testimonials?page=&limit=
 */
export const getTestimonialsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const total = await Testimonial.countDocuments();
    const items = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    return res.json({
      items,
      pagination: {
        total,
        page: pageNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (err) {
    console.error("getTestimonialsAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * POST /admin/testimonials
 * Body: { name, quote, avatarUrl, approved }
 */
export const createTestimonial = async (req, res) => {
  try {
    const { name, quote, avatarUrl, approved = false } = req.body;
    const doc = await Testimonial.create({ name, quote, avatarUrl, approved });

    (async () => {
      try {
        await AdminLog.create({
          actorId: req.user?._id || null,
          actionCode: "TESTIMONIAL_CREATED",
          actionLabel: "Created testimonial",
          targetId: doc._id,
          targetType: "Testimonial",
          targetLabel: doc.name,
          details: `Created testimonial by ${doc.name}`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    return res.json({ item: doc });
  } catch (err) {
    console.error("createTestimonial error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * PUT /admin/testimonials/:id/approve
 */
export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Testimonial.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true },
    ).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });

    (async () => {
      try {
        await AdminLog.create({
          actorId: req.user?._id || null,
          actionCode: "TESTIMONIAL_APPROVED",
          actionLabel: "Approved testimonial",
          targetId: doc._id,
          targetType: "Testimonial",
          targetLabel: doc.name,
          details: `Approved testimonial ${doc._id}`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    return res.json({ item: doc });
  } catch (err) {
    console.error("approveTestimonial error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * DELETE /admin/testimonials/:id
 */
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Testimonial.findByIdAndDelete(id).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });

    (async () => {
      try {
        await AdminLog.create({
          actorId: req.user?._id || null,
          actionCode: "TESTIMONIAL_DELETED",
          actionLabel: "Deleted testimonial",
          targetId: doc._id,
          targetType: "Testimonial",
          targetLabel: doc.name,
          details: `Deleted testimonial ${doc._id}`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteTestimonial error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
