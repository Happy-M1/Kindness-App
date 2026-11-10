// Pro-Admin/src/pages/AuditLogsPage.jsx

import { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaHistory,
  FaShieldAlt,
} from "react-icons/fa";
import api from "../utils/api.js";

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const limit = 10; // Bumped to 10 for a cleaner table layout

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/audit-logs", {
          params: { page, limit, search, action: actionFilter },
        });

        const payload = res?.data ?? res;
        console.debug("GET /admin/audit-logs payload:", payload);

        setLogs(payload?.logs || []);
        setPages(payload?.pagination?.pages || 1);
        setError("");
      } catch (err) {
        console.error("fetch audit logs error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch audit logs",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, search, actionFilter]);

  // Color-coded action badges for system audit events
  const getActionBadge = (actionCode, actionLabel) => {
    const label = actionLabel || actionCode || "UNKNOWN";
    const code = String(actionCode || "").toUpperCase();

    if (code.includes("DELETE")) {
      return (
        <span className="inline-block bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
          {label}
        </span>
      );
    }
    if (code.includes("LOGIN") || code.includes("APPROVED")) {
      return (
        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
          {label}
        </span>
      );
    }
    if (
      code.includes("UPDATE") ||
      code.includes("TOGGLE") ||
      code.includes("DENIED")
    ) {
      return (
        <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
          {label}
        </span>
      );
    }
    return (
      <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            System Audit Logs
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Track administrative actions, security compliance, and platform
            operations.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-950/60 border border-gray-800 rounded-xl text-xs text-gray-400">
          <FaShieldAlt className="text-purple-400" /> Immutable Trail
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-900/60 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by user or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none placeholder-gray-500 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <FaFilter /> Action Filter:
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-950 text-gray-200 border border-gray-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:border-purple-500 shadow-inner cursor-pointer"
          >
            <option value="">All Actions</option>
            <option value="VIEWED_ALL_USERS">Viewed all users</option>
            <option value="USER_ROLE_UPDATED">Updated user role</option>
            <option value="USER_DELETED">Deleted user</option>
            <option value="LOGIN">Login</option>
            <option value="ACT_APPROVED">Act Approved</option>
            <option value="ACT_DENIED">Act Denied</option>
            <option value="USER_TOGGLED">User Status Changed</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-16 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm text-gray-400 animate-pulse shadow-xl">
          Loading security audit trails...
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-sm shadow-lg">
          {error}
        </div>
      )}

      {/* Audit Table Container */}
      {!loading && !error && (
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
              <thead>
                <tr className="bg-gray-950/80 border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Action Event</th>
                  <th className="py-3.5 px-4 font-semibold">User / Admin</th>
                  <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/60">
                {logs.length > 0 ? (
                  logs.map((log) => {
                    const userLabel =
                      log.adminId?.email ||
                      log.adminId?.username ||
                      log.user?.email ||
                      log.user?.username ||
                      "System";

                    return (
                      <tr
                        key={log._id}
                        className="hover:bg-gray-800/40 transition"
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getActionBadge(
                            log.action || log.actionCode,
                            log.actionLabel,
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-200 font-medium whitespace-nowrap">
                          {userLabel}
                        </td>
                        <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "No timestamp"}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer text-xs font-semibold"
                          >
                            <FaEye /> View Payload
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-16 text-gray-500">
                      No audit logs match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {logs.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-950/60 text-xs sm:text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl shadow-sm disabled:opacity-40 hover:bg-gray-800 hover:text-white font-medium transition cursor-pointer"
              >
                Previous
              </button>
              <span className="text-gray-400 font-medium">
                Page <span className="text-white font-bold">{page}</span> of{" "}
                {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl shadow-sm disabled:opacity-40 hover:bg-gray-800 hover:text-white font-medium transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5 text-gray-200">
            <div className="flex justify-between items-start border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FaHistory className="text-purple-400" />
                <h2 className="text-lg font-bold text-white">
                  Log Event Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white p-1 font-bold rounded-lg hover:bg-gray-800 transition cursor-pointer"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                  Action Event
                </p>
                <div className="mt-1">
                  {getActionBadge(
                    selectedLog.action || selectedLog.actionCode,
                    selectedLog.actionLabel,
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
                <div>
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    Actor / Initiator
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    {selectedLog.adminId?.email ||
                      selectedLog.adminId?.username ||
                      selectedLog.user?.email ||
                      selectedLog.user?.username ||
                      "System Automated"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    Recorded At
                  </p>
                  <p className="text-gray-300 font-medium mt-0.5">
                    {selectedLog.createdAt
                      ? new Date(selectedLog.createdAt).toLocaleString()
                      : "No date"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-1">
                  Payload & Metadata Details
                </p>
                <pre className="whitespace-pre-wrap bg-gray-950 text-cyan-300 p-4 rounded-2xl border border-gray-800 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed shadow-inner">
                  {typeof selectedLog.details === "object"
                    ? JSON.stringify(selectedLog.details, null, 2)
                    : selectedLog.details || "No additional payload recorded."}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-800">
              <button
                onClick={() => setSelectedLog(null)}
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

export default AuditLogsPage;
