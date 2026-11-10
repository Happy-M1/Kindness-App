// Pro-Admin/src/components/layout/AdminLayout.jsx

import { useState, useEffect, useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { logout } from "../../utils/logout.js";
import Background from "./Background.jsx";
import AdminLogoSvg from "../AdminLogoSvg.jsx";
import { parseUserPayload } from "../../utils/parseUser.js";
import { getAdminProfileService } from "../../services/adminService.js";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    username: "Admin",
    imageUrl: "",
    role: "admin",
  });

  useEffect(() => {
    let mounted = true;
    async function fetchAdminData() {
      try {
        const rawData = await getAdminProfileService();
        const parsed = parseUserPayload(rawData);
        if (mounted) {
          setAdminProfile(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        if (mounted) {
          setAdminProfile({ username: "Admin", imageUrl: "", role: "admin" });
        }
      }
    }
    fetchAdminData();

    const handleProfileUpdateEvent = (e) => {
      if (e.detail && mounted) {
        setAdminProfile((prev) => ({
          ...prev,
          username: e.detail.username || prev.username,
          imageUrl:
            e.detail.imageUrl !== undefined ? e.detail.imageUrl : prev.imageUrl,
        }));
      } else {
        fetchAdminData();
      }
    };

    window.addEventListener("adminProfileUpdated", handleProfileUpdateEvent);

    return () => {
      mounted = false;
      window.removeEventListener(
        "adminProfileUpdated",
        handleProfileUpdateEvent,
      );
    };
  }, []);

  const avatarUrl = useMemo(() => {
    const src = adminProfile.imageUrl;
    if (!src) return DEFAULT_AVATAR;
    return `${src}?t=${new Date().getTime()}`;
  }, [adminProfile.imageUrl]);

  useEffect(() => {
    const faviconSvg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%231e1b4b" stroke="%233b82f6" stroke-width="8"/><text x="50" y="65" font-size="50" text-anchor="middle" fill="%23fbbf24">⭐</text></svg>`;
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/svg+xml";
    link.rel = "icon";
    link.href = faviconSvg;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  const isSystemAdmin = adminProfile.role === "system_admin";

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/contact-submissions", label: "Contacts" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/acts", label: "Acts" },
    { to: "/admin/ripple", label: "Ripple Oversight" },
    { to: "/admin/logs", label: "Logs" },
    { to: "/admin/site-content", label: "Content" },
    { to: "/admin/testimonials", label: "Testimonials" },
    { to: "/admin/profile", label: "Profile" },
    ...(isSystemAdmin ? [{ to: "/admin/approvals", label: "Approvals" }] : []),
    { to: "/admin/ecosystem-graph", label: "Ecosystem Graph" },
    { to: "/admin/impact-stories", label: "Impact Stories" },
  ];

  return (
    <Background>
      <div className="min-h-screen flex flex-col text-white selection:bg-blue-500 selection:text-white">
        <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md text-white shadow-lg z-50 border-b border-gray-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <NavLink
                to="/admin/dashboard"
                className="flex items-center gap-3 shrink-0 group"
              >
                <div className="perspective-1000 w-9 h-9 sm:w-10 sm:h-10">
                  <div className="w-full h-full relative transform-style-3d animate-coin-spin shadow-lg rounded-full">
                    <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-yellow-400/80 bg-indigo-950 backface-hidden shadow-[0_0_10px_rgba(234,179,8,0.4)] flex items-center justify-center">
                      <AdminLogoSvg className="w-full h-full drop-shadow-md" />
                    </div>
                    <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-blue-400/80 bg-gray-900 backface-hidden rotate-y-180 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                      <img
                        src={avatarUrl}
                        alt="Admin Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  Pro-Admin Portal
                </span>
              </NavLink>

              <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 text-xs sm:text-sm font-medium">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `transition-colors relative py-1 ${
                        isActive
                          ? "text-blue-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:w-full after:animate-pulse"
                          : "hover:text-blue-300 text-gray-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:w-0 hover:after:w-full"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={logout}
                  className="ml-3 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition text-xs font-semibold border border-red-500/30 shadow-sm"
                >
                  Logout
                </button>
              </div>

              <div className="lg:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/65 focus:outline-none transition"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          <div
            className={`lg:hidden fixed top-14 sm:top-16 right-0 bottom-0 w-3/5 sm:w-1/2 bg-gray-950/98 backdrop-blur-2xl border-l border-gray-800 shadow-2xl z-50 p-4 pb-24 space-y-2 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Admin Menu
            </div>
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl text-sm transition relative ${
                    isActive
                      ? "text-blue-400 font-semibold bg-blue-500/15 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "text-gray-300 hover:bg-gray-900 hover:text-white"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-800 mb-8">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition text-sm font-semibold border border-red-500/30 shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-14 sm:pt-24 pb-12 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </Background>
  );
}
