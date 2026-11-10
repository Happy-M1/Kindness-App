// Pro-Admin/src/pages/ManageActsPage.jsx
import { useEffect, useState } from "react";
import { getActs, deleteAct, updateActStatus } from "../services/actService.js";
import { FaTrash, FaSearch, FaEye, FaFilter, FaClock } from "react-icons/fa";

const ManageActsPage = () => {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actTypeFilter, setActTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedAct, setSelectedAct] = useState(null);
  const limit = 10;

  useEffect(() => {
    const fetchActs = async () => {
      setLoading(true);
      try {
        const payload = await getActs({
          page: currentPage,
          limit,
          search,
          status: statusFilter,
          actType: actTypeFilter,
        });

        setActs(payload?.acts || []);
        setPages(payload?.pagination?.pages || 1);
        setError("");
      } catch (err) {
        console.error("Fetch acts error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch acts",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActs();

    // Re-check expiration every 30 seconds
    const interval = setInterval(() => {
      setActs((prev) => [...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, search, statusFilter, actTypeFilter]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this kindness act? This action cannot be undone.",
      )
    )
      return;
    try {
      await deleteAct(id);
      setActs((prev) => prev.filter((a) => a._id !== id));
      if (selectedAct?._id === id) setSelectedAct(null);
    } catch (err) {
      console.error("Delete act error:", err);
      alert(err?.response?.data?.message || "Failed to delete act");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateActStatus(id, newStatus);
      setActs((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
      if (selectedAct?._id === id) {
        setSelectedAct((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.response?.data?.message || "Failed to update act status");
    }
  };

  const getStatusBadge = (status) => {
    const formattedStatus = status?.toLowerCase() || "";
    switch (formattedStatus) {
      case "confirmed":
        return (
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
            Pending
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
            <FaClock className="text-[10px]" /> Expired
          </span>
        );
      case "denied":
        return (
          <span className="inline-block bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
            Denied
          </span>
        );
      default:
        return (
          <span className="inline-block bg-gray-800 text-gray-300 border border-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold capitalize">
            {status || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Manage Kindness Acts
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Review, filter, and moderate acts of kindness recorded across the
            platform.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-900/60 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search description, place, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none placeholder-gray-500 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <FaFilter /> Filters:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-950 text-gray-200 border border-gray-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:border-purple-500 shadow-inner cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="denied">Denied</option>
          </select>

          <select
            value={actTypeFilter}
            onChange={(e) => {
              setActTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-950 text-gray-200 border border-gray-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:border-purple-500 shadow-inner cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="donation">Donation</option>
            <option value="mentorship">Mentorship</option>
            <option value="volunteering">Volunteering</option>
            <option value="gift">Gift</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-16 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm text-gray-400 animate-pulse shadow-xl">
          Loading kindness acts dataset...
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-sm shadow-lg">
          {error}
        </div>
      )}

      {/* Acts Table Container */}
      {!loading && !error && (
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
              <thead>
                <tr className="bg-gray-950/80 border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Description</th>
                  <th className="py-3.5 px-4 font-semibold">Giver (Helper)</th>
                  <th className="py-3.5 px-4 font-semibold">Receiver Email</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/60">
                {acts.length > 0 ? (
                  acts.map((act) => {
                    const expiryTime =
                      act.expiresAt ||
                      act.inviteExpiresAt ||
                      act.invite?.expiresAt;
                    const isExpired = expiryTime
                      ? new Date().getTime() > new Date(expiryTime).getTime()
                      : false;
                    const effectiveStatus =
                      act.status === "pending" && isExpired
                        ? "expired"
                        : act.status;

                    return (
                      <tr
                        key={act._id}
                        className="hover:bg-gray-800/40 transition"
                      >
                        <td className="py-4 px-4 capitalize font-bold text-purple-400 whitespace-nowrap">
                          {act.actType || "General"}
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate text-gray-200">
                          {act.description || "No description"}
                        </td>
                        <td className="py-4 px-4 text-gray-300 whitespace-nowrap">
                          {act.helper?.username ||
                            act.helper?.email ||
                            "Anonymous"}
                        </td>
                        <td className="py-4 px-4 text-gray-300 whitespace-nowrap">
                          {act.receiverEmail || act.receiver?.email || "N/A"}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={effectiveStatus?.toLowerCase() || "pending"}
                            onChange={(e) =>
                              handleStatusChange(act._id, e.target.value)
                            }
                            className="bg-gray-950 text-gray-200 border border-gray-700 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-purple-500 shadow-sm cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="expired">Expired</option>
                            <option value="denied">Denied</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedAct({
                                  ...act,
                                  status: effectiveStatus,
                                })
                              }
                              className="text-blue-400 hover:text-blue-300 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDelete(act._id)}
                              className="text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
                              title="Delete Act"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-gray-500">
                      No kindness acts match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {acts.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-950/60 text-xs sm:text-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl shadow-sm disabled:opacity-40 hover:bg-gray-800 hover:text-white font-medium transition cursor-pointer"
              >
                Previous
              </button>
              <span className="text-gray-400 font-medium">
                Page <span className="text-white font-bold">{currentPage}</span>{" "}
                of {pages}
              </span>
              <button
                disabled={currentPage === pages}
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl shadow-sm disabled:opacity-40 hover:bg-gray-800 hover:text-white font-medium transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Act Detail Modal */}
      {selectedAct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 text-gray-200">
            <div className="flex justify-between items-start border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-white">Act Details</h2>
              <button
                onClick={() => setSelectedAct(null)}
                className="text-gray-400 hover:text-white p-1 font-bold rounded-lg hover:bg-gray-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                  Type & Status
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="capitalize font-bold text-purple-400">
                    {selectedAct.actType}
                  </span>
                  {getStatusBadge(selectedAct.status)}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                  Description
                </p>
                <p className="text-gray-300 bg-gray-950 p-3.5 rounded-2xl border border-gray-800 mt-1.5 whitespace-pre-wrap leading-relaxed">
                  {selectedAct.description || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
                <div>
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    Giver / Helper
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    {selectedAct.helper?.username || "N/A"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {selectedAct.helper?.email}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    Receiver
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    {selectedAct.receiver?.username ||
                      selectedAct.receiverName ||
                      selectedAct.recipient?.name ||
                      (selectedAct.receiverEmail
                        ? "Unregistered Recipient"
                        : "N/A")}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {selectedAct.receiver?.email ||
                      selectedAct.receiverEmail ||
                      "No email linked"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    Place / Context
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    {selectedAct.place || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    Value
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    {selectedAct.value || "N/A"}
                  </p>
                </div>
              </div>

              {selectedAct.inviteCode && (
                <div className="bg-cyan-950/40 p-3.5 rounded-2xl border border-cyan-800/40">
                  <p className="font-semibold text-cyan-400 uppercase tracking-wider text-[10px]">
                    Pending Invite Code
                  </p>
                  <p className="font-mono text-cyan-300 font-bold mt-0.5">
                    {selectedAct.inviteCode}
                  </p>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                  Created At
                </p>
                <p className="text-gray-300 mt-1">
                  {selectedAct.createdAt
                    ? new Date(selectedAct.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-800">
              <button
                onClick={() => setSelectedAct(null)}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageActsPage;
