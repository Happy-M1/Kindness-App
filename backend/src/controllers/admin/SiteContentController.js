// src/controllers/admin/contentController.js
import SiteContent from "../../models/SiteContent.js";
import AdminLog from "../../models/admin/AdminLog.js";

/**
 * GET /admin/site-content
 * Returns all site content (admin).
 */
export const getAllSiteContent = async (req, res) => {
  try {
    const docs = await SiteContent.find().lean();
    return res.json({ items: docs });
  } catch (err) {
    console.error("getAllSiteContent error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * PUT /admin/site-content/:key
 * Upserts a content key. Body: { value: ... }
 */
export const upsertSiteContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (!key) return res.status(400).json({ message: "Missing key" });

    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    // non-fatal admin log
    (async () => {
      try {
        await AdminLog.create({
          actorId: req.user?._id || null,
          actionCode: "SITE_CONTENT_UPDATED",
          actionLabel: "Updated site content",
          targetId: null,
          targetType: "SiteContent",
          targetLabel: key,
          details: `Updated site content key: ${key}`,
        });
      } catch (logErr) {
        console.error("AdminLog create failed (non-fatal):", logErr);
      }
    })();

    return res.json({ item: doc });
  } catch (err) {
    console.error("upsertSiteContent error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
