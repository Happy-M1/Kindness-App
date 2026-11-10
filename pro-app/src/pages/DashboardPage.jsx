// pro-app/src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getMyActs } from "../services/actService.js";
import { FaBell, FaHandHoldingHeart, FaTree } from "react-icons/fa";

const DashboardPage = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPendingActs() {
      try {
        const acts = await getMyActs();
        // Filter acts that are pending
        const pending = acts.filter((act) => act.status === "pending");
        if (isMounted) {
          setPendingCount(pending.length);
        }
      } catch (err) {
        console.error("Failed to fetch pending acts for dashboard:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPendingActs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome Greeting */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            Welcome back,{" "}
            <span className="text-cyan-400">{user?.username}</span>! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Spread kindness, track your impact, and watch the ripples grow.
          </p>
        </div>
      </div>

      {/* Notification Alert Card for Pending Acts */}
      {!loading && pendingCount > 0 && (
        <div className="bg-linear-to-r from-amber-900/40 to-yellow-900/40 border border-amber-500/50 rounded-xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 p-3 rounded-full text-amber-400 relative">
              <FaBell className="text-xl animate-bounce" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                {pendingCount}
              </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Action Required!</h2>
              <p className="text-amber-200/80 text-sm">
                You have {pendingCount} pending kindness act
                {pendingCount > 1 ? "s" : ""} waiting for your confirmation.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/acts"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm transition shadow"
          >
            Review Acts
          </Link>
        </div>
      )}

      {/* Quick Links / Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        <Link
          to="/dashboard/add-act"
          className="bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-pink-500/50 rounded-xl p-5 transition group flex flex-col justify-between"
        >
          <div className="text-pink-400 text-2xl mb-3 group-hover:scale-110 transition-transform">
            <FaHandHoldingHeart />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Give Kindness</h3>
            <p className="text-gray-400 text-xs mt-1">
              Log a new act and generate an invite code.
            </p>
          </div>
        </Link>

        <Link
          to="/dashboard/my-tree"
          className="bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 rounded-xl p-5 transition group flex flex-col justify-between"
        >
          <div className="text-cyan-400 text-2xl mb-3 group-hover:scale-110 transition-transform">
            <FaTree />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">My Ripple Tree</h3>
            <p className="text-gray-400 text-xs mt-1">
              Visualize your personal network graph.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
