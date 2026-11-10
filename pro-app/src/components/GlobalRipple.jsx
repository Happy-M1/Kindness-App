


/*
import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { ForceGraph2D } from "react-force-graph";

export default function GlobalRipple() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    async function fetchGraph() {
      const res = await api.get("/ripples/global");
      setGraph(res.data);
    }
    fetchGraph();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Global Ripple</h2>
      <ForceGraph2D
        graphData={{ nodes: graph.nodes, links: graph.edges }}
        nodeLabel="label"
        linkLabel="label"
        linkColor={(link) =>
          link.status === "confirmed" ? "green" : link.status === "pending" ? "orange" : "red"
        }
      />
    </div>
  );
}
*/