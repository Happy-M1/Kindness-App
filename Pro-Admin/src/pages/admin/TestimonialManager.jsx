// Pro-Admin/src/pages/admin/TestimonialManager.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import TestimonialCard from "../../components/TestimonialCard.jsx";
import {
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUpload,
  FaLink,
} from "react-icons/fa";

export default function TestimonialManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [creating, setCreating] = useState(false);
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"
  const [form, setForm] = useState({
    name: "",
    quote: "",
    avatarUrl: "",
    avatarFile: null,
    approved: false,
  });

  useEffect(() => {
    let mounted = true;
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/testimonials", {
          params: { page, limit: 10 },
        });
        const payload = res?.data ?? res;
        if (mounted) {
          setItems(payload?.items || []);
          setPages(payload?.pagination?.pages || 1);
        }
      } catch (err) {
        console.error("fetch testimonials admin error:", err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load testimonials",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTestimonials();
    return () => {
      mounted = false;
    };
  }, [page]);

  const approve = async (id) => {
    try {
      await api.put(`/admin/testimonials/${id}/approve`);
      setItems((prev) =>
        prev.map((p) => (p._id === id ? { ...p, approved: true } : p)),
      );
      toast.success("Testimonial approved successfully");
    } catch (err) {
      console.error("approve error:", err);
      toast.error("Failed to approve testimonial");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete testimonial?")) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
      toast.success("Testimonial deleted");
    } catch (err) {
      console.error("delete testimonial error:", err);
      toast.error("Failed to delete testimonial");
    }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      toast.error("Name and quote are required");
      return;
    }
    setCreating(true);
    try {
      let finalAvatarUrl = form.avatarUrl;

      // If uploading an image file from device, handle via FormData if endpoint expects multipart, or send URL/base64
      if (uploadMode === "file" && form.avatarFile) {
        const formData = new FormData();
        formData.append("image", form.avatarFile);
        // Optional upload endpoint if your backend supports direct media uploads
        const uploadRes = await api.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalAvatarUrl = uploadRes?.url || uploadRes?.data?.url || "";
      }

      const payloadData = {
        name: form.name,
        quote: form.quote,
        avatarUrl: finalAvatarUrl,
        approved: form.approved,
      };

      const res = await api.post("/admin/testimonials", payloadData);
      const payload = res?.data ?? res;
      const created = payload?.item || payload;
      setItems((prev) => [created, ...prev]);
      setForm({
        name: "",
        quote: "",
        avatarUrl: "",
        avatarFile: null,
        approved: false,
      });
      toast.success("Testimonial created successfully");
    } catch (err) {
      console.error("create testimonial error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to create testimonial",
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading testimonials dataset...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12 p-4 sm:p-6 text-gray-200">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Testimonials Manager
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Review, approve, or publish user testimonials across the platform.
          </p>
        </div>
        <div className="bg-purple-500/10 p-3 sm:p-4 rounded-2xl text-purple-400 text-2xl hidden sm:block border border-purple-500/20 shadow-inner">
          <FaQuoteLeft />
        </div>
      </div>

      {/* Create Testimonial Form Container */}
      <div className="bg-gray-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 space-y-4">
        <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2 border-b border-gray-800 pb-3">
          <FaPlus className="text-purple-400 text-sm" /> Create New Testimonial
        </h2>
        <form onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="testimonial-name"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Name *
              </label>
              <input
                id="testimonial-name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Author name"
                className="w-full px-4 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-sm outline-none focus:border-purple-500 transition shadow-inner placeholder-gray-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Avatar (Optional)
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition cursor-pointer ${
                      uploadMode === "url"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <FaLink /> URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition cursor-pointer ${
                      uploadMode === "file"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <FaUpload /> Device File
                  </button>
                </div>
              </div>

              {uploadMode === "url" ? (
                <input
                  id="testimonial-avatar"
                  name="avatarUrl"
                  value={form.avatarUrl}
                  onChange={(e) =>
                    setForm({ ...form, avatarUrl: e.target.value })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-sm outline-none focus:border-purple-500 transition shadow-inner placeholder-gray-500"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, avatarFile: e.target.files[0] || null })
                  }
                  className="w-full px-3 py-2 bg-gray-950 text-gray-300 border border-gray-700 rounded-xl text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 outline-none cursor-pointer"
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="testimonial-quote"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
            >
              Quote *
            </label>
            <textarea
              id="testimonial-quote"
              name="quote"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              rows={3}
              placeholder="What did they say about the platform?"
              className="w-full px-4 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-sm outline-none focus:border-purple-500 transition shadow-inner placeholder-gray-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="testimonial-approved"
                name="approved"
                checked={form.approved}
                onChange={(e) =>
                  setForm({ ...form, approved: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 bg-gray-950 border-gray-700 rounded focus:ring-purple-500 cursor-pointer"
              />
              <label
                htmlFor="testimonial-approved"
                className="text-sm font-medium text-gray-300 cursor-pointer"
              >
                Approve immediately
              </label>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-950/30 cursor-pointer"
            >
              {creating ? "Creating..." : "Create Testimonial"}
            </button>
          </div>
        </form>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {items.map((t) => (
          <TestimonialCard
            key={t._id}
            testimonial={t}
            onApprove={approve}
            onDelete={remove}
          />
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl">
            <FaQuoteLeft className="text-3xl mx-auto mb-2 text-gray-600" />
            No testimonials found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-between items-center bg-gray-900/60 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-800 text-xs sm:text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-4 py-2 bg-gray-950 border border-gray-700 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-300 transition cursor-pointer"
          >
            <FaChevronLeft className="text-[10px]" /> Previous
          </button>
          <span className="font-semibold text-gray-400">
            Page <span className="text-white font-bold">{page}</span> of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="flex items-center gap-1 px-4 py-2 bg-gray-950 border border-gray-700 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-300 transition cursor-pointer"
          >
            Next <FaChevronRight className="text-[10px]" />
          </button>
        </div>
      )}
    </div>
  );
}
