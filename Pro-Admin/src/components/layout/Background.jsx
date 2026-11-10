// Pro-Admin/src/components/layout/Background.jsx
import { useMemo } from "react";

const stars = Array.from({ length: 35 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}vw`,
  size: `${Math.random() * 2 + 1}px`,
  duration: `${6 + Math.random() * 6}s`,
  delay: `${Math.random() * 5}s`,
  opacity: Math.random() * 0.7 + 0.3,
}));

export default function Background({ children }) {
  const memoizedStars = useMemo(() => stars, []);

  return (
    <div className="min-h-screen w-full relative bg-gray-950 text-white overflow-x-hidden">
      {/* 🌌 Fixed Atmospheric Space Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-linear-to-b from-gray-950 via-slate-950 to-black">
        {/* Soft Drifting Nebula Clouds */}
        <div className="absolute -top-40 -left-40 w-96.5 h-96.5 bg-blue-900/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-40 w-125 h-125 bg-indigo-950/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-40 left-1/4 w-112.5 h-112.5 bg-yellow-900/10 rounded-full blur-3xl animate-float-slow" />

        {/* Falling Star Particles */}
        {memoizedStars.map((star) => (
          <div
            key={star.id}
            className="star-particle"
            style={{
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: star.duration,
              animationDelay: star.delay,
              opacity: star.opacity,
            }}
          />
        ))}

        {/* Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,7,18,0.7)_100%)]" />
      </div>

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}
