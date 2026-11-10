// Pro-Admin/src/components/AdminLogoSvg.jsx
export default function AdminLogoSvg({ className = "w-full h-full" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        {/* Cosmic Nebula Background Gradient */}
        <radialGradient id="nebulaBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="70%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#030712" />
        </radialGradient>

        {/* Shimmering Golden Gradient */}
        <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Orbit Ring Gradient */}
        <linearGradient id="orbitGlow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.9" />
        </linearGradient>

        {/* Neon Glow Filters */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Circular Shield with Animated Glow Border */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#nebulaBg)"
        stroke="#3b82f6"
        strokeWidth="2.5"
      >
        <animate
          attributeName="stroke-opacity"
          values="0.4;1;0.4"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="0.75"
        strokeDasharray="3 3"
        opacity="0.6"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="-360 50 50"
          dur="25s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Rotating Orbital Ring */}
      <g>
        <ellipse
          cx="50"
          cy="50"
          rx="32"
          ry="14"
          fill="none"
          stroke="url(#orbitGlow)"
          strokeWidth="2"
          transform="rotate(-30 50 50)"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="15s"
          repeatCount="indefinite"
          additive="sum"
        />
      </g>

      {/* Central Starburst / Admin Emblem with Pulsing Glow */}
      <g filter="url(#intenseGlow)">
        <path
          d="M50 16 C50 35 35 50 16 50 C35 50 50 65 50 84 C50 65 65 50 84 50 C65 50 50 35 50 16 Z"
          fill="url(#goldGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.85;1;0.85"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <polygon
          points="50,36 57,50 50,64 43,50"
          fill="#ffffff"
          opacity="0.95"
        />
      </g>

      {/* Circulating & Shining Golden Stars */}
      <g>
        {/* Golden Star 1 */}
        <circle cx="28" cy="32" r="2.5" fill="#fef08a" filter="url(#neonGlow)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="2;3.5;2"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Golden Star 2 */}
        <circle cx="72" cy="68" r="2" fill="#fef08a" filter="url(#neonGlow)">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="3;1.5;3"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Orbit Rotation for the Stars */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="8s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}
