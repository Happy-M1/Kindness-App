// src/controllers/admin/contactController.js
import ContactSubmission from "../../models/ContactSubmission.js";
import AdminLog from "../../models/admin/AdminLog.js";

/**
 * GET /admin/contacts?page=&limit=
 */
export const getContactsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const total = await ContactSubmission.countDocuments();
    const items = await ContactSubmission.find()
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
    console.error("getContactsAdmin error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * PUT /admin/contacts/:id/handle
 * Body: { handled: true }
 */
export const handleContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { handled = true } = req.body;
    const doc = await ContactSubmission.findByIdAndUpdate(
      id,
      { handled },
      { new: true },
    ).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });

    (async () => {
      try {
        await AdminLog.create({
          actorId: req.user?._id || null,
          actionCode: "CONTACT_HANDLED",
          actionLabel: "Handled contact submission",
          targetId: doc._id,
          targetType: "ContactSubmission",
          targetLabel: doc.email,
          details: `Marked contact ${doc._id} as handled=${handled}`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    return res.json({ item: doc });
  } catch (err) {
    console.error("handleContact error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
