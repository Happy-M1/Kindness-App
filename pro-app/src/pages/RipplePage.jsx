
// pro-app/src/pages/RipplePage.jsx
/*
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import ForceGraph2D from "react-force-graph-2d";
import { getGlobalRippleGraph } from "../services/rippleService.js";

const RipplePage = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const imageCacheRef = useRef({});
  const fgRef = useRef();

  useEffect(() => {
    let isMounted = true;

    async function fetchGraph() {
      try {
        const data = await getGlobalRippleGraph();
        if (isMounted) setGraph(data || { nodes: [], edges: [] });

        setTimeout(() => {
          if (fgRef.current) {
            fgRef.current.d3ReheatSimulation();
          }
        }, 200);
      } catch (err) {
        console.error("❌ Failed to fetch ripple graph:", err);
        toast.error("Failed to load ripple graph");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGraph();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-gray-300">
        Loading Ripple Graph...
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen w-full box-border flex flex-col items-center justify-start py-6 px-2 sm:px-6 overflow-x-hidden">
      <div className="w-full max-w-full lg:max-w-7xl mx-auto rounded-lg shadow-lg p-3 sm:p-6 bg-gray-900 border border-gray-800 box-border overflow-hidden">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-blue-400 text-center">
          Ripple Effect Visualization
        </h1>

        <div className="w-full h-125 sm:h-150 rounded-lg bg-black border border-gray-800 relative overflow-hidden">
          <ForceGraph2D
            ref={fgRef}
            graphData={{ nodes: graph.nodes, links: graph.edges }}
            nodeLabel={(node) => `
              👤 ${node.username || "Unknown User"}
              📧 Email: ${node.email || "N/A"}
              📅 Joined: ${node.joinedAt ? new Date(node.joinedAt).toLocaleDateString() : "N/A"}
            `}
            linkLabel={(link) => `
              🤝 Act: ${link.actType || "Unknown"}
              ➡️ From: ${link.from || "?"} → To: ${link.to || "?"}
              📍 Place: ${link.place || "N/A"}
              📌 Status: ${link.status}
            `}
            linkColor={(link) =>
              link.status === "confirmed"
                ? "#22c55e"
                : link.status === "pending"
                  ? "#f59e0b"
                  : "#ef4444"
            }
            linkWidth={(link) => (link.status === "confirmed" ? 2.5 : 1.5)}
            linkCurvature={(link) => {
              const sourceId = typeof link.source === "object" ? link.source?.id : link.source;
              const targetId = typeof link.target === "object" ? link.target?.id : link.target;

              const siblings = graph.edges.filter((e) => {
                const eSrc = typeof e.source === "object" ? e.source?.id : e.source;
                const eTgt = typeof e.target === "object" ? e.target?.id : e.target;
                return (
                  (eSrc === sourceId && eTgt === targetId) ||
                  (eSrc === targetId && eTgt === sourceId)
                );
              });

              if (siblings.length <= 1) return 0;

              const index = siblings.findIndex((e) => {
                const eId = e.id || `${e.source}-${e.target}-${e.actType}`;
                const linkId = link.id || `${link.source}-${link.target}-${link.actType}`;
                return eId === linkId;
              });

              const safeIndex = index !== -1 ? index : siblings.indexOf(link);
              if (safeIndex <= 0) return 0.25;

              if (siblings.length === 2) {
                return safeIndex === 0 ? 0.25 : -0.25;
              }

              const sign = safeIndex % 2 === 0 ? 1 : -1;
              const magnitude = Math.floor(safeIndex / 2) * 0.2 + 0.2;
              return sign * magnitude;
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const size = 32 / globalScale;
              const fallbackUrl =
                "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";
              const url = node.imageUrl || fallbackUrl;

              const cache = imageCacheRef.current;
              if (!cache[url]) {
                const img = new Image();
                img.src = url;
                cache[url] = img;
              }

              const img = cache[url];
              if (img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
                ctx.clip();
                ctx.drawImage(
                  img,
                  node.x - size / 2,
                  node.y - size / 2,
                  size,
                  size
                );
                ctx.restore();
              } else {
                ctx.fillStyle = "#2563eb";
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.font = `${12 / globalScale}px Sans-Serif`;
                ctx.fillText(node.username || "?", node.x + 10, node.y + 3);
              }
            }}
            backgroundColor="#030712"
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            enableNodeDrag={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RipplePage;
*/


