// backend/src/controllers/impactStoryController.js
import ImpactStory from "../models/ImpactStory.js";
import cloudinary from "../config/cloudinary.js";
import { logInfo, logError } from "../utils/logger.js";

// Helper to upload buffer using chunked stream for reliable video processing
const uploadVideoToCloudinary = (fileBuffer, userId, stage) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "impact_stories",
        resource_type: "video",
        public_id: `story_${userId}_${stage}_${Date.now()}`,
        chunk_size: 6000000, // 6MB chunks for faster video processing
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Submit a new impact story with optional video files (User)
// @route   POST /api/impact-stories
export const createStory = async (req, res) => {
  try {
    // Increase response timeout allowance for large video payloads
    req.setTimeout(300000); // 5 minutes max

    logInfo(
      `Impact story submission request by user ${req.user?._id}`,
      req.requestId,
    );

    if (!req.body) {
      return res.status(400).json({ message: "Invalid request body format." });
    }

    const { type, title, description, beginningUrl, progressUrl, endingUrl } =
      req.body;

    if (!title || !description || !type) {
      return res
        .status(400)
        .json({ message: "Type, title, and description are required." });
    }

    let startVideo = beginningUrl || "";
    let progressVideo = progressUrl || "";
    let endingVideo = endingUrl || "";

    // Process file uploads concurrently using Promise.all if attached via multer
    if (req.files) {
      const uploadPromises = [];
      const stagesMap = [];

      if (req.files.beginning && req.files.beginning[0]) {
        uploadPromises.push(
          uploadVideoToCloudinary(
            req.files.beginning[0].buffer,
            req.user._id,
            "beginning",
          ),
        );
        stagesMap.push("beginning");
      }
      if (req.files.progress && req.files.progress[0]) {
        uploadPromises.push(
          uploadVideoToCloudinary(
            req.files.progress[0].buffer,
            req.user._id,
            "progress",
          ),
        );
        stagesMap.push("progress");
      }
      if (req.files.ending && req.files.ending[0]) {
        uploadPromises.push(
          uploadVideoToCloudinary(
            req.files.ending[0].buffer,
            req.user._id,
            "ending",
          ),
        );
        stagesMap.push("ending");
      }

      if (uploadPromises.length > 0) {
        const uploadedUrls = await Promise.all(uploadPromises);
        stagesMap.forEach((stage, idx) => {
          if (stage === "beginning") startVideo = uploadedUrls[idx];
          if (stage === "progress") progressVideo = uploadedUrls[idx];
          if (stage === "ending") endingVideo = uploadedUrls[idx];
        });
      }
    }

    const newStory = await ImpactStory.create({
      user: req.user._id,
      type,
      title,
      description,
      status: "pending", // Pending admin review
      proofVideos: {
        beginning: startVideo,
        progress: progressVideo,
        ending: endingVideo,
      },
    });

    logInfo(`Impact story ${newStory._id} created successfully`, req.requestId);

    res.status(201).json({
      message: "Story submitted successfully and is pending admin review.",
      item: newStory,
    });
  } catch (error) {
    logError(`Create impact story failed: ${error.message}`, req.requestId);
    res
      .status(500)
      .json({
        message: "Server error while submitting story.",
        error: error.message,
      });
  }
};

// @desc    Get approved public impact stories
// @route   GET /api/impact-stories/public
export const getPublicStories = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const query = { status: "approved" };

    // Only filter by type if provided, non-empty, and not "all"
    if (type && type.trim() !== "" && type !== "all") {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const stories = await ImpactStory.find(query)
      .populate("user", "username email imageUrl avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ImpactStory.countDocuments(query);

    res.json({
      stories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    logError(
      `Get public impact stories failed: ${error.message}`,
      req.requestId,
    );
    res
      .status(500)
      .json({
        message: "Failed to fetch public stories.",
        error: error.message,
      });
  }
};

// @desc    Get all stories for Admin moderation
// @route   GET /api/admin/impact-stories
export const getAdminStories = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const stories = await ImpactStory.find(query)
      .populate("user", "username email imageUrl avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ImpactStory.countDocuments(query);

    res.json({
      stories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    logError(
      `Get admin impact stories failed: ${error.message}`,
      req.requestId,
    );
    res
      .status(500)
      .json({
        message: "Failed to fetch admin stories.",
        error: error.message,
      });
  }
};

// @desc    Approve or update story status (Admin)
// @route   PUT /api/admin/impact-stories/:id/status
export const updateStoryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "denied", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updated = await ImpactStory.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Story not found." });
    }

    res.json({ message: `Story status updated to ${status}`, item: updated });
  } catch (error) {
    logError(`Update story status failed: ${error.message}`, req.requestId);
    res
      .status(500)
      .json({
        message: "Failed to update story status.",
        error: error.message,
      });
  }
};

// @desc    Delete impact story (Admin or Author)
// @route   DELETE /api/impact-stories/:id
export const deleteStory = async (req, res) => {
  try {
    const story = await ImpactStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found." });
    }

    const isAdmin =
      req.user.role === "system_admin" || req.user.role === "admin";
    if (!isAdmin && story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    await story.deleteOne();
    res.json({ message: "Impact story deleted successfully." });
  } catch (error) {
    logError(`Delete impact story failed: ${error.message}`, req.requestId);
    res
      .status(500)
      .json({ message: "Failed to delete story.", error: error.message });
  }
};
