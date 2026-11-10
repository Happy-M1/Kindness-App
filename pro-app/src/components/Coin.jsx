// src/components/Coin.jsx

import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { assets } from "../assets/assets";

export default function Coin() {
  const { user } = useAuth();

  // Use the canonical image field (imageUrl / profileUrl) and cache-bust when it changes
  const avatarUrl = useMemo(() => {
    const src = user?.imageUrl || user?.profileUrl || null;
    if (!src) return assets.GoldCoinFront;
    return `${src}?t=${new Date().getTime()}`;
  }, [user?.imageUrl, user?.profileUrl]);

  return (
    <div
      className="relative w-8 h-8 cursor-pointer animate-pulseGlow rounded-full overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 spin-slow spin-fast spin-tilt transform-style-preserve-3d">
        {/* Front face: Profile picture if available */}
        <img
          src={avatarUrl}
          alt="Front Face"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = assets.GoldCoinFront;
          }}
          className="rounded-full overflow-hidden absolute inset-0 w-full h-full backface-hidden object-cover"
        />

        {/* Back face: Logo / Coin */}
        <img
          src={assets.GoldCoinFront}
          alt="Back Face"
          className="rounded-full overflow-hidden absolute inset-0 w-full h-full backface-hidden transform rotate-y-180 object-cover"
        />
      </div>
    </div>
  );
}
