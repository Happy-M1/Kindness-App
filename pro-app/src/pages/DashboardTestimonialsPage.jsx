// pro-app/src/pages/DashboardTestimonialsPage.jsx

import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { toast } from "react-toastify";
import { FaQuoteLeft, FaPlus } from "react-icons/fa";

const DashboardTestimonialsPage = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
  let isMounted = true;

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/public/testimonials");
      const payload = res?.data ?? res;
      if (isMounted) {
        setTestimonials(payload?.testimonials || []);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchTestimonials();

  return () => {
    isMounted = false;
  };
}, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) return toast.error("Please enter your story.");

    setSubmitting(true);
    try {
      await api.post("/public/testimonials", {
        name: user?.username || "Community Member",
        quote: quote.trim(),
        avatarUrl: user?.imageUrl || "",
        approved: false, // Requires admin review
      });
      toast.success("Testimonial submitted successfully! Pending admin approval.");
      setQuote("");
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800/60 border border-gray-700 p-6 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaQuoteLeft className="text-cyan-400" /> Community Testimonials
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Read inspiring stories from fellow members or share your own kindness journey.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 shadow"
        >
          <FaPlus /> Share Your Story
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading stories...</p>
      ) : testimonials.length === 0 ? (
        <div className="bg-gray-800/40 border border-gray-700 p-8 rounded-xl text-center text-gray-400">
          No testimonials published yet. Be the first to share!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-gray-800/60 border border-gray-700 p-5 rounded-xl shadow flex flex-col justify-between">
              <p className="text-gray-300 text-sm italic mb-4">“{t.quote}”</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-700/60">
                <img
                  src={t.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(t.name)}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <h4 className="text-white text-sm font-semibold">{t.name}</h4>
                  <p className="text-gray-500 text-xs">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h2 className="text-lg font-bold text-white">Share Your Kindness Story</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <img
                  src={user?.imageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.username)}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">Posting as {user?.username}</p>
                  <p className="text-xs text-cyan-400">Your profile photo will be attached automatically.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Your Testimonial</label>
                <textarea
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="How has Pro-App impacted your life or community?"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-sm text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-cyan-500 text-gray-950 font-semibold rounded-lg text-sm hover:bg-cyan-400 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTestimonialsPage;