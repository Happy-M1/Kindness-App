// Pro-Admin/src/pages/admin/AdminApprovalsPage.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import { FaClipboardCheck, FaCheck, FaTimes } from "react-icons/fa";

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approvals safely self-contained inside useEffect to avoid linter warnings
  useEffect(() => {
    let mounted = true;

    async function loadApprovals() {
      try {
        const res = await api.get("/admin/profile-approvals");
        const payload = res?.data ?? res;
        if (mounted) {
          setRequests(payload?.requests || payload || []);
        }
      } catch (error) {
        console.error("Failed to fetch approval queue:", error);
        toast.error("Failed to load approval requests");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadApprovals();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAction = async (id, approved) => {
    try {
      await api.put(`/admin/profile-approvals/${id}`, { approved });
      setRequests((prev) => prev.filter((req) => req._id !== id));
      toast.success(
        approved ? "Profile request approved!" : "Profile request rejected.",
      );
    } catch (error) {
      console.error("Approval action error:", error);
      toast.error("Failed to process request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading approval queue...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Admin Approval Queue
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Review and authorize profile update requests from lower-tier
            administrators.
          </p>
        </div>
        <div className="bg-purple-500/10 p-3 sm:p-4 rounded-2xl text-purple-400 text-2xl hidden sm:block border border-purple-500/20">
          <FaClipboardCheck />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id || req.adminId}
            className="bg-gray-900/60 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  req.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(req.username || "Admin")}`
                }
                alt="Requested Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">
                    {req.username}
                  </span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                    {req.role || "Admin"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Email: <span className="text-gray-200">{req.email}</span>
                </p>
                <p className="text-[10px] text-gray-500">
                  Requested:{" "}
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleString()
                    : "Recently"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleAction(req._id || req.adminId, true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                <FaCheck /> Approve
              </button>
              <button
                onClick={() => handleAction(req._id || req.adminId, false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-gray-900/40 rounded-2xl border border-gray-800 shadow-xl">
            <FaClipboardCheck className="text-3xl mx-auto mb-2 text-gray-600" />
            No pending admin approval requests.
          </div>
        )}
      </div>
    </div>
  );
}
