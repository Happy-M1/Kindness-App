// Pro-Admin/src/pages/admin/ContactSubmissions.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import ContactCard from "../../components/ContactCard.jsx";
import { FaEnvelope, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ContactSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/contacts", {
          params: { page, limit: 10 },
        });
        const payload = res?.data ?? res;
        if (mounted) {
          setItems(payload?.items || []);
          setPages(payload?.pagination?.pages || 1);
        }
      } catch (err) {
        console.error("fetch contacts admin error:", err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load contacts",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchContacts();
    return () => {
      mounted = false;
    };
  }, [page]);

  const markHandled = async (id, handled) => {
    try {
      const res = await api.put(`/admin/contacts/${id}/handle`, { handled });
      const payload = res?.data ?? res;
      const updated = payload?.item || payload;
      setItems((prev) => prev.map((it) => (it._id === id ? updated : it)));
      toast.success(handled ? "Marked as handled" : "Marked as unhandled");
    } catch (err) {
      console.error("handle contact error:", err);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading contact submissions...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Contact Submissions
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Review inquiries and messages submitted by users and visitors.
          </p>
        </div>
        <div className="bg-blue-500/10 p-3 sm:p-4 rounded-2xl text-blue-400 text-2xl hidden sm:block border border-blue-500/20">
          <FaEnvelope />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {items.map((c) => (
          <ContactCard key={c._id} contact={c} onToggleHandled={markHandled} />
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <FaEnvelope className="text-3xl mx-auto mb-2 text-gray-300" />
            No contact submissions found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 text-xs sm:text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition"
          >
            <FaChevronLeft className="text-[10px]" /> Previous
          </button>
          <span className="font-semibold text-gray-600">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition"
          >
            Next <FaChevronRight className="text-[10px]" />
          </button>
        </div>
      )}
    </div>
  );
}
