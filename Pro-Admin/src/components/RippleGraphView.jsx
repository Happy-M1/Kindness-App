// Pro-Admin/src/components/RippleGraphView.jsx
import { useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function RippleGraphView({
  graphData,
  heightClass = "h-137.5",
  onNodeClick,
}) {
  const imageCacheRef = useRef({});
  const fgRef = useRef();

  useEffect(() => {
    // Automatically center and fit graph when data changes or mounts
    const timer = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [graphData]);

  // Helper to extract string ID from node or link end
  const getId = (nodeOrId) =>
    typeof nodeOrId === "object" && nodeOrId !== null ? nodeOrId.id : nodeOrId;

  // Custom node canvas renderer with circular avatars
  const renderNodeCanvas = (node, ctx, globalScale) => {
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
      ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
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
  };

  return (
    <div
      className={`w-full ${heightClass} overflow-hidden rounded-xl bg-gray-950 border border-gray-800 relative`}
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={{
          nodes: graphData?.nodes || [],
          links: graphData?.edges || [],
        }}
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
          const sourceId = getId(link.source);
          const targetId = getId(link.target);
          if (!sourceId || !targetId) return 0;

          // Gather all links between these two nodes regardless of direction
          const siblings = (graphData?.edges || []).filter((e) => {
            const eSrc = getId(e.source);
            const eTgt = getId(e.target);
            return (
              (eSrc === sourceId && eTgt === targetId) ||
              (eSrc === targetId && eTgt === sourceId)
            );
          });

          if (siblings.length <= 1) return 0;

          // Sort deterministically by unique link ID
          siblings.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
          const index = siblings.findIndex((e) => e.id === link.id);
          if (index === -1) return 0;

          // Differentiate direction (Forward vs Reverse) so A->B and B->A curve opposite ways
          const isForward = sourceId < targetId;
          const directionSign =
            sourceId === getId(link.source)
              ? isForward
                ? 1
                : -1
              : isForward
                ? -1
                : 1;

          const baseCurvature = 0.25;
          const step = 0.15;
          const magnitude = baseCurvature + Math.floor(index / 2) * step;

          return index % 2 === 0
            ? magnitude * directionSign
            : -magnitude * directionSign;
        }}
        nodeCanvasObject={renderNodeCanvas}
        onNodeClick={onNodeClick}
        backgroundColor="#030712"
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        enableNodeDrag={true}
      />
    </div>
  );
}
