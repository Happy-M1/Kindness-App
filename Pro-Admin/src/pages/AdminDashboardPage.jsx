// Pro-Admin/src/pages/AdminDashboardPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardStatCard from "../components/DashboardStatCard.jsx";
import {
  FaUsers,
  FaClipboardList,
  FaShieldAlt,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";
import { parseUserPayload } from "../utils/parseUser.js";
import { getDashboardDataService } from "../services/adminService.js";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLogs: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        const { usersPayload, logsPayload, profilePayload } =
          await getDashboardDataService();
        const parsedProfile = parseUserPayload(profilePayload);

        if (isMounted) {
          setStats({
            totalUsers: usersPayload?.pagination?.total || 0,
            totalLogs: logsPayload?.pagination?.total || 0,
          });
          setRecentLogs(logsPayload?.logs || []);
          if (parsedProfile?.username) {
            setAdminName(parsedProfile.username);
          }
        }
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    // Listen for real-time profile name updates
    const handleProfileUpdateEvent = (e) => {
      if (e.detail?.username && isMounted) {
        setAdminName(e.detail.username);
      }
    };
    window.addEventListener("adminProfileUpdated", handleProfileUpdateEvent);

    return () => {
      isMounted = false;
      window.removeEventListener(
        "adminProfileUpdated",
        handleProfileUpdateEvent,
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading dashboard overview...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Welcome back,{" "}
          <span className="text-blue-400 font-semibold">{adminName}</span> 👋
        </p>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardStatCard
          icon={<FaUsers />}
          label="Total Users"
          value={stats.totalUsers}
          colorClass="bg-blue-500/10 text-blue-600"
        />

        <DashboardStatCard
          icon={<FaClipboardList />}
          label="Audit Logs"
          value={stats.totalLogs}
          colorClass="bg-purple-500/10 text-purple-600"
        />

        <DashboardStatCard
          icon={<FaShieldAlt />}
          label="System Status"
          value={
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              Operational
            </span>
          }
          colorClass="bg-green-500/10 text-green-600"
          valueTextColor="text-green-600 text-base sm:text-lg"
        />

        {/* Quick Content Link Card */}
        <Link
          to="/admin/site-content"
          className="bg-linear-to-br from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white p-4 sm:p-5 rounded-2xl shadow-sm transition flex flex-col justify-between min-w-37.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">
              Configuration
            </span>
            <FaFileAlt className="text-base opacity-80" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-xs sm:text-sm">
              Manage Site Content
            </span>
            <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
          <h2 className="font-bold text-gray-900 text-base sm:text-lg">
            Recent Admin Activity
          </h2>
          <Link
            to="/admin/logs"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
          >
            View all logs <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600">
                <th className="py-3 px-4 font-semibold rounded-l-xl">Action</th>
                <th className="py-3 px-4 font-semibold">Admin / User</th>
                <th className="py-3 px-4 font-semibold rounded-r-xl">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => {
                  const userLabel =
                    log.adminId?.email ||
                    log.adminId?.username ||
                    log.user?.email ||
                    log.user?.username ||
                    "System";
                  const actionLabel =
                    log.actionLabel ||
                    log.action ||
                    log.actionCode ||
                    "Unknown";
                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        {actionLabel}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 truncate max-w-50">
                        {userLabel}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-10 text-gray-400 text-sm"
                  >
                    No recent audit activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
