
// Pro-Admin/src/pages/admin/ManageImpactStories.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import { FaVideo, FaCheck, FaTimes, FaSearch, FaEye, FaShieldAlt } from "react-icons/fa";

export default function ManageImpactStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAdminStories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/impact-stories", {
          params: { page, limit: 10, status: statusFilter, search },
        });
        const payload = res?.data ?? res;
        if (mounted) {
          setStories(payload?.stories || []);
        }
      } catch (err) {
        console.error("fetch admin impact stories error:", err);
        toast.error("Failed to load impact stories for moderation.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAdminStories();
    return () => { mounted = false; };
  }, [page, statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/impact-stories/${id}/status`, { status: newStatus });
      setStories((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
      if (selectedStory?._id === id) {
        setSelectedStory((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Story status updated to ${newStatus}`);
    } catch (err) {
      console.error("update status error:", err);
      toast.error("Failed to update story status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await api.delete(`/admin/impact-stories/${id}`);
      setStories((prev) => prev.filter((s) => s._id !== id));
      if (selectedStory?._id === id) setSelectedStory(null);
      toast.success("Story deleted successfully.");
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Failed to delete story.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full font-semibold">Approved</span>;
      case "denied":
        return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs rounded-full font-semibold">Denied</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs rounded-full font-semibold">Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 pb-12 text-gray-200">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Manage Impact Stories & Proof
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Moderate community requests, offers, and verify 3-stage video proof before publishing.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-950/60 border border-gray-800 rounded-xl text-xs text-gray-400">
          <FaShieldAlt className="text-purple-400" /> Moderation Queue
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-900/60 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search titles or descriptions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-gray-950 text-gray-200 border border-gray-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:border-purple-500 cursor-pointer shadow-inner w-full md:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm text-gray-400 animate-pulse shadow-xl">
          Loading impact stories queue...
        </div>
      )}

      {/* Stories Table */}
      {!loading && (
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
              <thead>
                <tr className="bg-gray-950/80 border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold">Author</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {stories.length > 0 ? (
                  stories.map((story) => (
                    <tr key={story._id} className="hover:bg-gray-800/40 transition">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          story.type === "request_help" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {story.type === "request_help" ? "Asking Help" : "Offering Help"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-white max-w-xs truncate">{story.title}</td>
                      <td className="py-4 px-4 text-gray-300 whitespace-nowrap">{story.user?.username || story.user?.email || "Unknown"}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(story.status)}</td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedStory(story)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
                            title="Review 3-Stage Proof"
                          >
                            <FaEye />
                          </button>
                          {story.status !== "approved" && (
                            <button
                              onClick={() => handleStatusChange(story._id, "approved")}
                              className="text-emerald-400 hover:text-emerald-300 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                          )}
                          {story.status !== "denied" && (
                            <button
                              onClick={() => handleStatusChange(story._id, "denied")}
                              className="text-amber-400 hover:text-amber-300 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition cursor-pointer"
                              title="Deny"
                            >
                              <FaTimes />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(story._id)}
                            className="text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
                            title="Delete"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-gray-500">No impact stories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal with 3-Stage Proof Inspection */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-5 text-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-800 pb-3">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  selectedStory.type === "request_help" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  {selectedStory.type === "request_help" ? "Asking for Help" : "Offering Help"}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedStory.title}</h2>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Description</p>
                <p className="text-gray-300 bg-gray-950 p-3.5 rounded-2xl border border-gray-800 mt-1.5 leading-relaxed">
                  {selectedStory.description}
                </p>
              </div>

              {/* 3-Stage Proof Review Box */}
              <div className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <p className="font-bold text-gray-300 flex items-center gap-2">
                  <FaVideo className="text-purple-400" /> 3-Stage Verification Proof
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">1. Beginning</p>
                    {selectedStory.proofVideos?.beginning ? (
                      <a href={selectedStory.proofVideos.beginning} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-xs break-all font-mono">
                        View Initial Video →
                      </a>
                    ) : (
                      <span className="text-gray-500 italic text-xs">Not provided</span>
                    )}
                  </div>

                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">2. Progress</p>
                    {selectedStory.proofVideos?.progress ? (
                      <a href={selectedStory.proofVideos.progress} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-xs break-all font-mono">
                        View Progress Video →
                      </a>
                    ) : (
                      <span className="text-gray-500 italic text-xs">Not provided</span>
                    )}
                  </div>

                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">3. Ending</p>
                    {selectedStory.proofVideos?.ending ? (
                      <a href={selectedStory.proofVideos.ending} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-xs break-all font-mono">
                        View Resolution Video →
                      </a>
                    ) : (
                      <span className="text-gray-500 italic text-xs">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div className="flex items-center gap-2">
                {selectedStory.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(selectedStory._id, "approved")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Approve Story
                  </button>
                )}
                {selectedStory.status !== "denied" && (
                  <button
                    onClick={() => handleStatusChange(selectedStory._id, "denied")}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Deny
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

