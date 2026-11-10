// Pro-Admin/src/pages/RippleOversightPage.jsx
import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { toast } from "react-toastify";
import RippleGraphView from "../components/RippleGraphView.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ParticipantCard from "../components/ParticipantCard.jsx";
import {
  FaGlobe,
  FaNetworkWired,
  FaUserCheck,
  FaSearch,
  FaTimes,
  FaTree,
} from "react-icons/fa";

export default function RippleOversightPage() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [stats, setStats] = useState({ totalActs: 0, totalConnections: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [userGraph, setUserGraph] = useState({ nodes: [], edges: [] });
  const [loadingUserTree, setLoadingUserTree] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchGlobalGraph() {
      try {
        const res = await api.get("/admin/ripple/global");
        const payload = res?.data ?? res;
        if (isMounted) {
          setGraph({
            nodes: payload?.nodes || [],
            edges: payload?.edges || [],
          });
          setStats(
            payload?.stats || {
              totalActs: 0,
              totalConnections: (payload?.edges || []).length,
            },
          );
        }
      } catch (err) {
        console.error("Failed to load global admin graph:", err);
        toast.error("Failed to load global ripple network");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchGlobalGraph();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenUserTree = async (user) => {
    setSelectedUser(user);
    setLoadingUserTree(true);
    try {
      const res = await api.get(`/admin/ripple/user/${user.id}`);
      const payload = res?.data ?? res;
      setUserGraph({
        nodes: payload?.nodes || [],
        edges: payload?.edges || [],
      });
    } catch (err) {
      console.error("Failed to fetch user ripple tree:", err);
      toast.error("Failed to load individual user tree");
    } finally {
      setLoadingUserTree(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading global ripple network analytics...
      </div>
    );
  }

  const filteredNodes = (graph?.nodes || []).filter(
    (n) =>
      n.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          Ripple Oversight & Analytics
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Monitor real-time kindness propagation, audit network connections, and
          inspect user trees.
        </p>
      </div>

      {/* Metrics Cards Grid (Responsive min-width 150px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <MetricCard
          icon={<FaGlobe />}
          label="Total Acts Tracked"
          value={stats.totalActs || graph?.edges?.length || 0}
          colorClass="bg-blue-500/10 text-blue-600"
        />
        <MetricCard
          icon={<FaNetworkWired />}
          label="Active Participants"
          value={graph?.nodes?.length || 0}
          colorClass="bg-emerald-500/10 text-emerald-600"
        />
        <MetricCard
          icon={<FaUserCheck />}
          label="Network Connections"
          value={graph?.edges?.length || 0}
          colorClass="bg-purple-500/10 text-purple-600"
        />
      </div>

      {/* Global Force Graph View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
            <FaNetworkWired className="text-blue-600" /> Global Kindness Force
            Graph
          </h2>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-100">
            Interactive 2D Matrix
          </span>
        </div>

        <RippleGraphView
          graphData={graph}
          heightClass="h-137.5"
          onNodeClick={handleOpenUserTree}
        />

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
          💡 Click any participant node in the graph above to inspect their
          personal tree drilldown.
        </div>
      </div>

      {/* Participant Directory Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-gray-900 text-base sm:text-lg">
              Participant Directory
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any user to audit their specific chain reaction network.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <ParticipantCard
              key={node.id}
              node={node}
              onClick={handleOpenUserTree}
            />
          ))}
          {filteredNodes.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full text-center py-8">
              No participants found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Single User Graph Drilldown Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    selectedUser.imageUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(selectedUser.username)
                  }
                  alt={selectedUser.username}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-100"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {selectedUser.username}&apos;s Ripple Tree
                  </h3>
                  <p className="text-xs text-gray-500">
                    Individual network connection drilldown
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            {loadingUserTree ? (
              <p className="text-center py-16 text-gray-400 text-sm">
                Rendering user tree graph...
              </p>
            ) : userGraph?.nodes?.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <FaTree className="text-3xl mx-auto mb-2 text-gray-300" />
                No kindness acts recorded for this user yet.
              </div>
            ) : (
              <RippleGraphView graphData={userGraph} heightClass="h-100" />
            )}

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition"
              >
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
// Pro-Admin/src/pages/RippleOversightPage.jsx
import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { toast } from "react-toastify";
import RippleGraphView from "../components/RippleGraphView.jsx";
import {
  FaGlobe,
  FaNetworkWired,
  FaUserCheck,
  FaSearch,
  FaTimes,
  FaTree,
} from "react-icons/fa";

export default function RippleOversightPage() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [stats, setStats] = useState({ totalActs: 0, totalConnections: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Single user drilldown modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userGraph, setUserGraph] = useState({ nodes: [], edges: [] });
  const [loadingUserTree, setLoadingUserTree] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchGlobalGraph() {
      try {
        const res = await api.get("/admin/ripple/global");
        const payload = res?.data ?? res;
        if (isMounted) {
          setGraph({
            nodes: payload?.nodes || [],
            edges: payload?.edges || [],
          });
          setStats(
            payload?.stats || {
              totalActs: 0,
              totalConnections: (payload?.edges || []).length,
            },
          );
        }
      } catch (err) {
        console.error("Failed to load global admin graph:", err);
        toast.error("Failed to load global ripple network");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchGlobalGraph();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenUserTree = async (user) => {
    setSelectedUser(user);
    setLoadingUserTree(true);
    try {
      const res = await api.get(`/admin/ripple/user/${user.id}`);
      const payload = res?.data ?? res;
      setUserGraph({
        nodes: payload?.nodes || [],
        edges: payload?.edges || [],
      });
    } catch (err) {
      console.error("Failed to fetch user ripple tree:", err);
      toast.error("Failed to load individual user tree");
    } finally {
      setLoadingUserTree(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading global ripple network analytics...
      </div>
    );
  }

  const filteredNodes = (graph?.nodes || []).filter(
    (n) =>
      n.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner *}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          Ripple Oversight & Analytics
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Monitor real-time kindness propagation, audit network connections, and inspect user trees.
        </p>
      </div>

      {/* Metrics Cards *}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3.5 sm:p-4 rounded-xl text-blue-600 text-xl sm:text-2xl shrink-0">
            <FaGlobe />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Total Acts Tracked
            </p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
              {stats.totalActs || graph?.edges?.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80 flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3.5 sm:p-4 rounded-xl text-emerald-600 text-xl sm:text-2xl shrink-0">
            <FaNetworkWired />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Active Participants
            </p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
              {graph?.nodes?.length || 0}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3.5 sm:p-4 rounded-xl text-purple-600 text-xl sm:text-2xl shrink-0">
            <FaUserCheck />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Network Connections
            </p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
              {graph?.edges?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Global Force Graph View *}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
            <FaNetworkWired className="text-blue-600" /> Global Kindness Force Graph
          </h2>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-100">
            Interactive 2D Matrix
          </span>
        </div>

        <RippleGraphView graphData={graph} heightClass="h-137.5" onNodeClick={(node) => handleOpenUserTree(node)} />

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
          💡 Click any participant node in the graph above to inspect their personal tree drilldown.
        </div>
      </div>

      {/* Participant Directory *}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-gray-900 text-base sm:text-lg">
              Participant Directory
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any user to audit their specific chain reaction network.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleOpenUserTree(node)}
              className="bg-white border border-gray-200/80 rounded-xl p-4 flex items-center justify-between shadow-2xs cursor-pointer hover:border-blue-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <img
                  src={
                    node.imageUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(node.username)
                  }
                  alt={node.username}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shrink-0 group-hover:border-blue-400 transition"
                />
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition">
                    {node.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {node.email}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-lg border border-blue-100 shrink-0">
                View Tree
              </span>
            </div>
          ))}
          {filteredNodes.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full text-center py-8">
              No participants found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Single User Graph Drilldown Modal *}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    selectedUser.imageUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(selectedUser.username)
                  }
                  alt={selectedUser.username}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-100"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {selectedUser.username}&apos;s Ripple Tree
                  </h3>
                  <p className="text-xs text-gray-500">
                    Individual network connection drilldown
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            {loadingUserTree ? (
              <p className="text-center py-16 text-gray-400 text-sm">
                Rendering user tree graph...
              </p>
            ) : userGraph?.nodes?.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <FaTree className="text-3xl mx-auto mb-2 text-gray-300" />
                No kindness acts recorded for this user yet.
              </div>
            ) : (
              <RippleGraphView graphData={userGraph} heightClass="h-100" />
            )}

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition"
              >
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
*/
