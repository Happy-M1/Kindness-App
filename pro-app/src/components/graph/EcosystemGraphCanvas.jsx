// pro-app/src/components/graph/EcosystemGraphCanvas.jsx

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

export default function EcosystemGraphCanvas({ graphData }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomBehaviorRef = useRef(null);
  const svgSelectionRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width || 800);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !graphData.nodes || graphData.nodes.length === 0)
      return;

    const width = svgRef.current.clientWidth || 800;
    const height = 550;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", height);

    svgSelectionRef.current = svg;

    // ✅ Main container group for zoom & pan transformations
    const containerGroup = svg.append("g");

    // ✅ Enable Zoom & Pan
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 6])
      .on("zoom", (event) => {
        containerGroup.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    const defs = containerGroup.append("defs");

    const nodes = graphData.nodes.map((nodeData) => ({ ...nodeData }));
    const links = graphData.edges.map((edgeData, index) => ({
      ...edgeData,
      uniqueIndex: index,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(180),
      )
      .force("charge", d3.forceManyBody().strength(-450))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Draw Curved Links (Edges) with explicit status colors
    const link = containerGroup
      .append("g")
      .selectAll("path")
      .data(links, (d) => d.id)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const status = (d.status || "").toLowerCase();
        if (status === "confirmed") return "#10b981"; // Green
        if (status === "denied" || status === "rejected") return "#ef4444"; // Red
        return "#f59e0b"; // Amber / Pending
      })
      .attr("stroke-opacity", 0.85)
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        setTooltip({
          title: `Kindness Act: ${d.actType || d.type || "General"}`,
          details: [
            `Status: ${d.status || "Pending"}`,
            `Description: ${d.description || "No description provided"}`,
            `Place: ${d.place || "Online"}`,
            `Date: ${d.date ? new Date(d.date).toLocaleDateString() : "N/A"}`,
          ],
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        });
      })
      .on("mouseleave", () => setTooltip(null));

    // Draw Node Groups
    const node = containerGroup
      .append("g")
      .selectAll("g")
      .data(nodes, (d) => d.id)
      .join("g")
      .style("cursor", "grab")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      )
      .on("mousemove", (event, d) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        setTooltip({
          title: `User: ${d.username || d.name || "Member"}`,
          details: [
            `Email: ${d.email || "N/A"}`,
            `Role: ${d.role || "member"}`,
            `Joined: ${d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "N/A"}`,
          ],
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        });
      })
      .on("mouseleave", () => setTooltip(null));

    node.each(function (d) {
      defs
        .append("clipPath")
        .attr("id", `clip-${d.id}`)
        .append("circle")
        .attr("r", 20)
        .attr("cx", 0)
        .attr("cy", 0);
    });

    node
      .append("circle")
      .attr("r", 22)
      .attr("fill", "#1e1b4b")
      .attr("stroke", "#a855f7")
      .attr("stroke-width", 2.5);

    node
      .append("image")
      .attr("xlink:href", (d) => d.imageUrl || DEFAULT_AVATAR)
      .attr("x", -20)
      .attr("y", -20)
      .attr("width", 40)
      .attr("height", 40)
      .attr("clip-path", (d) => `url(#clip-${d.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice");

    node
      .append("text")
      .text((d) => {
        const label = d.username || d.name || "User";
        return label.length > 12 ? label.substring(0, 10) + ".." : label;
      })
      .attr("x", 0)
      .attr("y", 36)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .style("font-size", "11px")
      .style("font-weight", "500");

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const x1 = d.source.x;
        const y1 = d.source.y;
        const x2 = d.target.x;
        const y2 = d.target.y;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dr = Math.sqrt(dx * dx + dy * dy);
        if (dr === 0) return `M ${x1} ${y1} L ${x2} ${y2}`;

        const nx = -dy / dr;
        const ny = dx / dr;

        const offsetMultiplier =
          (d.uniqueIndex % 2 === 0 ? 1 : -1) * (30 + d.uniqueIndex * 15);

        const qx = (x1 + x2) / 2 + nx * offsetMultiplier;
        const qy = (y1 + y2) / 2 + ny * offsetMultiplier;

        return `M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`;
      });

      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  const handleZoomIn = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgSelectionRef.current && zoomBehaviorRef.current) {
      svgSelectionRef.current
        .transition()
        .duration(400)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div
      ref={containerRef}
      className=" relative w-full overflow-hidden bg-gray-950/90 rounded-2xl border border-gray-800 shadow-2xl"
    >
      {/* Floating Zoom Controls Toolbar */}
      <div className="absolute top-2 right-1 z-20 flex items-center gap-2 bg-gray-900/80 backdrop-blur-md border border-gray-700 p-1.5 rounded-xl shadow-lg">
        <button
          onClick={handleZoomIn}
          className="px-3 py-1.5 text-white font-bold bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="px-3 py-1.5 text-white font-bold bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleResetZoom}
          className="  px-1 py-1.5 text-xs text-purple-300 font-bold bg-purple-950/60 hover:bg-purple-900/60 rounded-lg transition border border-purple-800/50"
        >
          Reset ({Math.round(zoomLevel * 100)}%)
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-2 left-1 z-20 hidden sm:flex items-center gap-4 bg-gray-900/80 backdrop-blur-md border border-gray-700 px-3 py-2 rounded-xl text-xs text-gray-300 shadow-lg">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>{" "}
          Confirmed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>{" "}
          Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>{" "}
          Denied
        </span>
      </div>

      <svg
        ref={svgRef}
        className="w-full h-137.5 block cursor-grab active:cursor-grabbing"
      />

      {tooltip && (
        <div
          className="absolute z-50 bg-gray-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-gray-700 text-xs pointer-events-none space-y-1 w-44"
          style={{
            left: Math.min(Math.max(tooltip.x - 120, 10), containerWidth - 270),
            top: Math.max(tooltip.y - 110, 10),
          }}
        >
          <p className="font-bold text-purple-400 border-b border-gray-800 pb-1">
            {tooltip.title}
          </p>
          {tooltip.details.map((detail, idx) => (
            <p key={idx} className="text-gray-300 truncate">
              {detail}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/*
// Pro-Admin/src/components/graph/EcosystemGraphCanvas.jsx

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

export default function EcosystemGraphCanvas({ graphData }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width || 800);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !graphData.nodes || graphData.nodes.length === 0)
      return;

    const width = svgRef.current.clientWidth || 800;
    const height = 550;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", height);

    const defs = svg.append("defs");

    const nodes = graphData.nodes.map((nodeData) => ({ ...nodeData }));
    
    // Attach a static sequential index to every edge to guarantee unique curve separation
    const links = graphData.edges.map((edgeData, index) => ({
      ...edgeData,
      uniqueIndex: index,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(170),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(55));

    // Draw Curved Links (Edges)
    const link = svg
      .append("g")
      .selectAll("path")
      .data(links, (d) => d.id)
      .join("path")
      .attr("fill", "none")
      .attr(
        "stroke",
        (d) => d.color || (d.status === "confirmed" ? "#10b981" : "#f59e0b"),
      )
      .attr("stroke-opacity", 0.9)
      .attr("stroke-width", 3.5)
      .style("cursor", "pointer")
      .on("mousemove", (event, d) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        setTooltip({
          title: `Kindness Act: ${d.actType || d.type || "General"}`,
          details: [
            `Status: ${d.status || "Pending"}`,
            `Description: ${d.description || "No description provided"}`,
            `Place: ${d.place || "Online"}`,
            `Date: ${d.date ? new Date(d.date).toLocaleDateString() : "N/A"}`,
          ],
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        });
      })
      .on("mouseleave", () => setTooltip(null));

    // Draw Node Groups
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes, (d) => d.id)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      )
      .on("mousemove", (event, d) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        setTooltip({
          title: `User: ${d.username || d.name || "Member"}`,
          details: [
            `Email: ${d.email || "N/A"}`,
            `Joined: ${d.joinedAt || d.createdAt ? new Date(d.joinedAt || d.createdAt).toLocaleDateString() : "N/A"}`,
          ],
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        });
      })
      .on("mouseleave", () => setTooltip(null));

    node.each(function (d) {
      defs
        .append("clipPath")
        .attr("id", `clip-${d.id}`)
        .append("circle")
        .attr("r", 20)
        .attr("cx", 0)
        .attr("cy", 0);
    });

    node
      .append("circle")
      .attr("r", 22)
      .attr("fill", "#1e1b4b")
      .attr("stroke", "#60a5fa")
      .attr("stroke-width", 2.5);

    node
      .append("image")
      .attr("xlink:href", (d) => d.imageUrl || DEFAULT_AVATAR)
      .attr("x", -20)
      .attr("y", -20)
      .attr("width", 40)
      .attr("height", 40)
      .attr("clip-path", (d) => `url(#clip-${d.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice");

    node
      .append("text")
      .text((d) => {
        const label = d.username || d.name || "User";
        return label.length > 12 ? label.substring(0, 10) + ".." : label;
      })
      .attr("x", 0)
      .attr("y", 36)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "11px")
      .style("font-weight", "500");

    // ✅ Absolute Index-Based Offsetting (Guarantees every edge has a completely unique path trajectory)
    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const x1 = d.source.x;
        const y1 = d.source.y;
        const x2 = d.target.x;
        const y2 = d.target.y;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dr = Math.sqrt(dx * dx + dy * dy);
        if (dr === 0) return `M ${x1} ${y1} L ${x2} ${y2}`;

        const nx = -dy / dr;
        const ny = dx / dr;

        // Each edge gets a distinct offset magnitude and sign based strictly on its index
        const offsetMultiplier = (d.uniqueIndex % 2 === 0 ? 1 : -1) * (35 + (d.uniqueIndex * 20));

        const qx = (x1 + x2) / 2 + nx * offsetMultiplier;
        const qy = (y1 + y2) / 2 + ny * offsetMultiplier;

        return `M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`;
      });

      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gray-950/80 rounded-2xl"
    >
      <svg
        ref={svgRef}
        className="w-full h-137.5 block cursor-grab active:cursor-grabbing"
      />

      {tooltip && (
        <div
          className="absolute z-50 bg-gray-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-gray-700 text-xs pointer-events-none space-y-1 w-64"
          style={{
            left: Math.min(Math.max(tooltip.x - 120, 10), containerWidth - 270),
            top: Math.max(tooltip.y - 110, 10),
          }}
        >
          <p className="font-bold text-blue-400 border-b border-gray-800 pb-1">
            {tooltip.title}
          </p>
          {tooltip.details.map((detail, idx) => (
            <p key={idx} className="text-gray-300 truncate">
              {detail}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

*/
