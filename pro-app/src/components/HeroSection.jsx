// pro-app/src/components/HeroSection.jsx
import { useState, useEffect, useMemo } from "react";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import api from "../utils/api.js";

export default function HeroSection() {
  const [content, setContent] = useState({
    title: "Pay It Forward",
    subtitle: "Small acts, big impact",
  });
  const [loading, setLoading] = useState(true);

  // ✅ Stable taglines array
  const taglines = useMemo(
    () => [
      "✨ Your kindness journey starts here ✨",
      "🌍 Join the ripple, inspire the world 🌍",
    ],
    [],
  );

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Typing + fade logic
  useEffect(() => {
    const currentTagline = taglines[currentTaglineIndex];

    if (!isFading && charIndex < currentTagline.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentTagline[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!isFading && charIndex === currentTagline.length) {
      const pause = setTimeout(() => {
        setIsFading(true);
      }, 3000);
      return () => clearTimeout(pause);
    } else if (isFading) {
      const fadeTimeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setIsFading(false);
        setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
      }, 1000);
      return () => clearTimeout(fadeTimeout);
    }
  }, [charIndex, currentTaglineIndex, isFading, taglines]);

  useEffect(() => {
    let mounted = true;
    const fetchContent = async () => {
      try {
        const res = await api.get("/public/site-content", {
          params: { keys: "home.hero" },
        });
        const payload = res?.data ?? res;
        const hero = payload?.["home.hero"] ?? null;
        if (mounted && hero) setContent(hero);
      } catch {
        console.debug("HeroSection: failed to load site content");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-2 sm:px-4 text-center">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl border border-gray-800 w-full overflow-hidden">
        {/* Main Gold-to-Purple Title */}
        <h1 className="text-xl sm:text-base md:text-5xl font-extrabold mb-3 tracking-tight bg-linear-to-r from-amber-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent wrap-break-word w-full">
          {loading ? "Welcome" : content.title}
        </h1>

        <p className="text-gray-400 mb-6 sm:mb-8 text-xs sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed wrap-break-word px-1 w-full">
          {loading ? "Loading..." : content.subtitle}
        </p>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
          <NavLink
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm md:text-base px-5 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-purple-900/30 transition cursor-pointer font-semibold shrink-0"
          >
            <FaUserPlus className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">Get Started / Sign Up</span>
          </NavLink>

          <NavLink
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-600 text-xs sm:text-sm md:text-base px-5 py-2.5 sm:py-3 rounded-xl transition cursor-pointer font-semibold shrink-0"
          >
            <FaSignInAlt className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">Log In</span>
          </NavLink>
        </div>

        {/* Dynamic Typing Tagline */}
        <div className="mt-6 sm:mt-8 min-h-6 flex items-center justify-center w-full">
          <p
            className={`text-amber-400/90 text-[11px] sm:text-xs md:text-sm font-medium italic transition-opacity duration-1000 wrap-break-word px-2 w-full ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {displayText}
            <span className="border-r-2 border-amber-400 animate-pulse ml-0.5 inline-block h-3 sm:h-4 align-middle"></span>
          </p>
        </div>
      </div>
    </section>
  );
}
