// pro-app/src/components/Background.jsx

import { assets } from "../assets/assets";

const colors = ["gold", "silver", "white"];
const sizes = ["sm", "md", "lg"];

const stars = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}vw`,
  delay: `${Math.random() * 5}s`,
  duration: `${4 + Math.random() * 4}s`,
  color: colors[Math.floor(Math.random() * colors.length)],
  size: sizes[Math.floor(Math.random() * sizes.length)],
}));

export default function Background({ children }) {
  return (
    <div className=" relative min-h-screen overflow-x-hidden">
      {/* Starfall background (fixed) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star ${star.color} ${star.size}`}
            style={{
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Coin background (fixed) */}
      <div
        className="fixed inset-0 animate-pulseGlow overflow-hidden -z-10 pointer-events-none"
        style={{ perspective: "1000px" }}
      >
        <div
          className="absolute inset-0 transform-style-preserve-3d transition-transform duration-700 ease-in-out animate-spinCoin
                     scale-90 sm:scale-95 md:scale-100 lg:scale-md xl:scale-lg
                     translate-y-6 sm:translate-y-8 md:translate-y-10"
        >
          <div className="  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={assets.GoldCoinFront}
              alt="Coin Front"
              className="block w-18 h-18 sm:w-10 sm:h-10 md:w-96 md:h-96 lg:w-md lg:h-112 xl:w-lg xl:h-128
                         object-cover rounded-full border-4 border-yellow-600 shadow-inner inset-0"
            />
            <img
              src={assets.GoldCoinBack}
              alt="Coin Back"
              className="block w-18 h-18 sm:w-10 sm:h-10 md:w-96 md:h-96 lg:w-md lg:h-112 xl:w-lg xl:h-128
                         object-cover rounded-full border-4 border-yellow-600 shadow-inner
                         transform rotate-y-180 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      {/* Scrollable page content */}
      <div className="relative z-0 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}
