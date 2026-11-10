// pro-admin/src/pages/AdminEcosystemGraphPage.jsx

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { FaSync, FaUsers, FaNetworkWired } from "react-icons/fa";
import EcosystemGraphCanvas from "../../components/admin/graph/EcosystemGraphCanvas.jsx";
import { getEcosystemGraphService } from "../../services/adminService.js";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AdminEcosystemGraphPage() {
  const { user: currentAdmin } = useAuth();
  const [fullGraph, setFullGraph] = useState({ nodes: [], edges: [] });
  const [viewMode, setViewMode] = useState("global"); // "global" or "user-ripple"
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch the full ecosystem graph cleanly
  const loadData = useCallback(
    async (showLoader = false) => {
      if (showLoader) setLoading(true);
      try {
        const data = await getEcosystemGraphService();
        const nodes = data?.nodes || [];
        const edges = data?.edges || [];

        setFullGraph({ nodes, edges });

        // Default selected user to current admin if available
        if (nodes.length > 0 && !selectedUserId) {
          const adminMatch = nodes.find((n) => n.email === currentAdmin?.email);
          setSelectedUserId(adminMatch ? adminMatch.id : nodes[0].id);
        }
      } catch (err) {
        console.error("Failed to load ecosystem graph", err);
        toast.error("Failed to load ecosystem graph data");
      } finally {
        setLoading(false);
      }
    },
    [currentAdmin, selectedUserId],
  );

  useEffect(() => {
    let isMounted = true;
    async function initFetch() {
      if (isMounted) {
        await loadData(true);
      }
    }
    initFetch();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  // 2. Compute displayedGraph based on whether we are viewing Global or a Specific User's Ripple
  const displayedGraph = useMemo(() => {
    if (viewMode === "global") {
      return fullGraph;
    }

    if (!selectedUserId) return { nodes: [], edges: [] };

    // Filter edges connected to the target user
    const personalEdges = fullGraph.edges.filter((edge) => {
      const sourceId =
        typeof edge.source === "object" ? edge.source?.id : edge.source;
      const targetId =
        typeof edge.target === "object" ? edge.target?.id : edge.target;
      return sourceId === selectedUserId || targetId === selectedUserId;
    });

    // Gather unique node IDs involved in those personal edges
    const nodeIdsInvolved = new Set();
    personalEdges.forEach((edge) => {
      const sourceId =
        typeof edge.source === "object" ? edge.source?.id : edge.source;
      const targetId =
        typeof edge.target === "object" ? edge.target?.id : edge.target;
      if (sourceId) nodeIdsInvolved.add(sourceId);
      if (targetId) nodeIdsInvolved.add(targetId);
    });

    nodeIdsInvolved.add(selectedUserId);

    // Filter nodes down to connected participants
    const personalNodes = fullGraph.nodes.filter((node) =>
      nodeIdsInvolved.has(node.id),
    );

    return {
      nodes: personalNodes,
      edges: personalEdges,
    };
  }, [viewMode, fullGraph, selectedUserId]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header & Admin Controls Bar */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex flex-col lg:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            {viewMode === "global"
              ? "Admin Platform Ecosystem"
              : "User Ripple Inspector"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Real-time D3 force-directed network mapping platform users and
            kindness acts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* User Selector Dropdown (Active only in user-ripple mode) */}
          {viewMode === "user-ripple" && (
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-gray-950 text-gray-200 border border-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-500"
            >
              {fullGraph.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.username || n.name} ({n.email || "No email"})
                </option>
              ))}
            </select>
          )}

          {/* Mode Toggle Buttons */}
          <div className="flex items-center bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setViewMode("global")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                viewMode === "global"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Global Ecosystem
            </button>
            <button
              onClick={() => setViewMode("user-ripple")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                viewMode === "user-ripple"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Inspect User Ripple
            </button>
          </div>

          <button
            onClick={() => loadData(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FaSync className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900/60 backdrop-blur-md p-5 rounded-2xl border border-gray-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl text-xl border border-blue-500/20">
            <FaUsers />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {viewMode === "global"
                ? "Total Ecosystem Users (Nodes)"
                : "Connected Users in Ripple"}
            </p>
            <p className="text-2xl font-extrabold text-white">
              {displayedGraph.nodes.length}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-md p-5 rounded-2xl border border-gray-800 flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl text-xl border border-yellow-500/20">
            <FaNetworkWired />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {viewMode === "global"
                ? "Total Acts & Ripples (Edges)"
                : "Connected Acts in Ripple"}
            </p>
            <p className="text-2xl font-extrabold text-white">
              {displayedGraph.edges.length}
            </p>
          </div>
        </div>
      </div>

      {/* Graph Display Area */}
      {loading ? (
        <div className="text-white text-center py-20 bg-gray-950/90 rounded-2xl border border-gray-800 animate-pulse">
          Loading Ecosystem Dataset...
        </div>
      ) : (
        <EcosystemGraphCanvas graphData={displayedGraph} />
      )}
    </div>
  );
}
