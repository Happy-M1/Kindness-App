// pro-app/src/components/testimonials/TestimonialModal.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { submitTestimonial } from "../../services/testimonialService.js";

export default function TestimonialModal({ user, isOpen, onClose }) {
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) {
      toast.error("Please enter your testimonial story.");
      return;
    }

    setSubmitting(true);
    try {
      await submitTestimonial({
        name: user?.username || user?.name || "Community Member",
        quote: quote.trim(),
        avatarUrl: user?.imageUrl || user?.avatarUrl || "",
        approved: false,
      });

      toast.success(
        "Thank you! Your testimonial was submitted for admin review.",
      );
      setQuote("");
      onClose();
    } catch (err) {
      console.error("Submit testimonial error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to submit testimonial.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-4 space-y-3 text-gray-200">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2.5">
          <h3 className="text-sm sm:text-base font-bold bg-linear-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent truncate">
            Submit Testimonial
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 text-[11px] sm:text-xs"
        >
          <div className="flex items-center gap-2.5 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/40 w-full overflow-hidden">
            <img
              src={
                user?.imageUrl ||
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}`
              }
              alt="Profile Avatar"
              className="w-8 h-8 rounded-full object-cover border border-purple-800 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-[11px] truncate">
                {user?.username || user?.name || "Community Member"}
              </p>
              <p className="text-[10px] text-purple-300/70 truncate">
                Linked to account
              </p>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Your Story *
            </label>
            <textarea
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="How has Pro-App inspired kindness?"
              className="w-full bg-gray-950 text-gray-200 border border-gray-700 rounded-xl p-2.5 outline-none focus:border-purple-500 placeholder-gray-500 leading-relaxed text-[11px] sm:text-xs wrap-break-word"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-gray-800 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg font-semibold transition shadow-md"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
