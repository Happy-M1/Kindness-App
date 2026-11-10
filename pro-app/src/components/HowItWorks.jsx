// pro-app/src/components/HowItWorks.jsx
import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { FaHandHoldingHeart, FaGift, FaShareAlt } from "react-icons/fa";

export default function HowItWorks() {
  const [blocks, setBlocks] = useState([
    {
      title: "Pledge",
      body: "Make a pledge to help someone in need within the community.",
    },
    {
      title: "Donate",
      body: "Give what you can — your time, resources, or specialized skills.",
    },
    {
      title: "Share",
      body: "Share your impact journey and inspire others to take action.",
    },
  ]);

  const icons = [
    <FaHandHoldingHeart key="1" />,
    <FaGift key="2" />,
    <FaShareAlt key="3" />,
  ];

  useEffect(() => {
    let mounted = true;
    const fetchBlocks = async () => {
      try {
        const res = await api.get("/public/site-content", {
          params: { keys: "home.howItWorks" },
        });
        const payload = res?.data ?? res;
        const data = payload?.["home.howItWorks"];
        if (mounted && Array.isArray(data) && data.length) setBlocks(data);
      } catch {
        console.debug("HowItWorks: failed to load content");
      }
    };
    fetchBlocks();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-2 sm:px-4">
      <div className="text-center w-full max-w-xl mx-auto mb-8 space-y-1.5">
        <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight bg-linear-to-r from-amber-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent wrap-break-word">
          How It Works
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-400 px-1 leading-relaxed wrap-break-word">
          Three simple steps to create lasting positive impact.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="bg-gray-900/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-xl w-full flex flex-col space-y-3 overflow-hidden"
          >
            <div className="w-6 h-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-sm shrink-0">
              {icons[i] || <FaHandHoldingHeart />}
            </div>
            <div className="w-full space-y-1">
              <h3 className="font-bold text-white text-xs sm:text-sm wrap-break-word">
                {b.title}
              </h3>
              <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed wrap-break-word w-full">
                {b.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
