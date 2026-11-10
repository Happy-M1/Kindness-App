// pro-app/src/pages/UserEcosystemGraphPage.jsx

import { useEffect, useState, useMemo } from "react";
import EcosystemGraphCanvas from "../components/graph/EcosystemGraphCanvas.jsx";
import { getEcosystemGraph } from "../services/rippleService.js";
import { useAuth } from "../hooks/useAuth.js";

export default function UserEcosystemGraphPage() {
  const { user } = useAuth();
  const [fullGraph, setFullGraph] = useState({ nodes: [], edges: [] });
  const [viewMode, setViewMode] = useState("global"); // "global" or "personal"
  const [loading, setLoading] = useState(true);

  // 1. Fetch the full ecosystem graph once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await getEcosystemGraph();
        if (isMounted) {
          setFullGraph({
            nodes: data?.nodes || [],
            edges: data?.edges || [],
          });
        }
      } catch (err) {
        console.error("Failed to load ecosystem graph", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Compute displayedGraph efficiently using useMemo (eliminates cascading render warnings)
  const displayedGraph = useMemo(() => {
    if (viewMode === "global") {
      return fullGraph;
    }

    if (!user) return { nodes: [], edges: [] };

    const currentUserId = user._id || user.id;
    const currentUserEmail = (user.email || "").toLowerCase().trim();

    // Filter edges connected to the current user
    const personalEdges = fullGraph.edges.filter((edge) => {
      const sourceId =
        typeof edge.source === "object" ? edge.source?.id : edge.source;
      const targetId =
        typeof edge.target === "object" ? edge.target?.id : edge.target;
      return sourceId === currentUserId || targetId === currentUserId;
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

    nodeIdsInvolved.add(currentUserId);

    // Filter nodes down to connected participants
    const personalNodes = fullGraph.nodes.filter((node) => {
      return (
        nodeIdsInvolved.has(node.id) ||
        (node.email && node.email.toLowerCase().trim() === currentUserEmail)
      );
    });

    return {
      nodes: personalNodes,
      edges: personalEdges,
    };
  }, [viewMode, fullGraph, user]);

  return (
    <div className="w-full max-w-7xl mx-auto p-2 space-y-4">
      {/* Header & Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-gray-900 border border-gray-800 p-4 rounded-2xl shadow-lg">
        <h1 className=" sm:text-2xl font-extrabold text-purple-400">
          {viewMode === "global"
            ? "Platform Ecosystem Overview"
            : "Your Personal Ripple Network"}
        </h1>

        {/* Toggle Buttons */}
        <div className="flex items-center bg-gray-950 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setViewMode("global")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === "global"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Global Ecosystem
          </button>
          <button
            onClick={() => setViewMode("personal")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === "personal"
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Personal Ripple
          </button>
        </div>
      </div>

      {/* Graph Display Area */}
      {loading ? (
        <div className="text-white text-center py-20 bg-gray-950/90 rounded-2xl border border-gray-800 animate-pulse">
          Loading Graph Data...
        </div>
      ) : (
        <EcosystemGraphCanvas graphData={displayedGraph} />
      )}
    </div>
  );
}
