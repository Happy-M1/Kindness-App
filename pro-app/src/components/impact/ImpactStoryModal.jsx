
// pro-app/src/components/impact/ImpactStoryModal.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa";
import { createImpactStory } from "../../services/impactStoryService.js";

export default function ImpactStoryModal({ isOpen, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "request_help",
  });

  const [files, setFiles] = useState({
    beginning: null,
    progress: null,
    ending: null,
  });

  if (!isOpen) return null;

  const handleFileChange = (stage, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        toast.warn("File is larger than 25MB. Consider trimming it for faster upload.");
      }
      setFiles((prev) => ({ ...prev, [stage]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);

      if (files.beginning) formData.append("beginning", files.beginning);
      if (files.progress) formData.append("progress", files.progress);
      if (files.ending) formData.append("ending", files.ending);

      await createImpactStory(formData);

      toast.success("Story submitted successfully! Pending admin approval.");
      setForm({ title: "", description: "", type: "request_help" });
      setFiles({ beginning: null, progress: null, ending: null });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submit story error:", err);
      toast.error(err?.response?.data?.message || "Failed to submit story.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 text-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-white bg-linear-to-r from-amber-400 to-purple-400 bg-clip-text truncate">
            Share Your Impact Story
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="w-full">
            <label className="block font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
              Story Type *
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-gray-950 text-gray-200 border border-gray-700 rounded-xl p-2.5 outline-none focus:border-purple-500 cursor-pointer text-xs"
            >
              <option value="request_help">Asking for Help (Demonstrate Situation)</option>
              <option value="offer_help">Offering Help (What You Have to Offer)</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Providing winter supplies"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-950 text-gray-200 border border-gray-700 rounded-xl p-2.5 outline-none focus:border-purple-500 placeholder-gray-500 text-xs sm:text-sm"
              required
            />
          </div>

          <div className="w-full">
            <label className="block font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Describe your situation..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-950 text-gray-200 border border-gray-700 rounded-xl p-2.5 outline-none focus:border-purple-500 placeholder-gray-500 leading-relaxed text-xs sm:text-sm wrap-break-word"
              required
            />
          </div>

          {/* 3-Stage Proof Video Uploads */}
          <div className="space-y-3 bg-gray-950 p-3 sm:p-4 rounded-2xl border border-gray-800 w-full overflow-hidden">
            <p className="font-bold text-gray-300 flex items-center gap-2 text-xs sm:text-sm">
              <FaCamera className="text-purple-400 shrink-0" /> 3-Stage Video Proof
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed">
              Keep videos under 25MB for fast uploads.
            </p>

            {/* Stages Loop */}
            {[
              { key: "beginning", label: "1. Beginning (Initial State / Need)" },
              { key: "progress", label: "2. Progress (In Action)" },
              { key: "ending", label: "3. Ending (Outcome / Result)" },
            ].map((stageObj) => (
              <div key={stageObj.key} className="space-y-1 w-full">
                <label className="block text-[10px] uppercase font-semibold text-gray-400 truncate">
                  {stageObj.label}
                </label>
                <div className="flex items-center gap-2 w-full">
                  <label className="flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 border border-gray-700 hover:border-purple-500 rounded-xl text-xs text-gray-300 cursor-pointer transition">
                    <FaUpload className="text-purple-400 shrink-0" />
                    <span className="truncate">
                      {files[stageObj.key] ? files[stageObj.key].name : "Choose file..."}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      capture="environment"
                      onChange={(e) => handleFileChange(stageObj.key, e)}
                      className="hidden"
                    />
                  </label>
                  {files[stageObj.key] && (
                    <button
                      type="button"
                      onClick={() => setFiles((p) => ({ ...p, [stageObj.key]: null }))}
                      className="text-rose-400 hover:text-rose-300 p-1.5 text-xs shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-gray-800 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-semibold transition cursor-pointer shadow-lg shadow-purple-900/30 text-xs flex items-center justify-center"
            >
              {submitting ? "Uploading videos..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
