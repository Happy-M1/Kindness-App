// pro-app/src/components/layout/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Coin from "../Coin.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/impact-stories", label: "Impact Stories" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/terms", label: "Terms" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  const privateLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/profile", label: "Profile" },
    { to: "/dashboard/acts", label: "Acts" },
    { to: "/dashboard/add-act", label: "Add Act" },
    { to: "/impact-stories", label: "Impact Stories" },

    { to: "/dashboard/ecosystem", label: "Ecosystem" },
  ];

  const links = !user ? publicLinks : privateLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 dark:bg-gray-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          {/* Logo / Rotating Coin */}
          <NavLink to={user ? "/dashboard" : "/"} className="flex items-center">
            <Coin />
            <span className="ml-2 text-xs  hover:text-blue-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:w-0 hover:after:w-full">
              PayItForward
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-row space-x-4 text-sm md:text-base lg:text-lg">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/dashboard"}
                className={({ isActive }) =>
                  `transition-colors relative ${
                    isActive
                      ? "text-blue-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:animate-pulse after:w-full"
                      : "hover:text-blue-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:w-0 hover:after:w-full"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
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

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed top-12 right-0 w-3/4 sm:w-1/2 bg-gray-800 dark:bg-gray-900 shadow-lg z-50 px-2 pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/dashboard"}
              className={({ isActive }) =>
                `block px-2 py-2 rounded transition relative ${
                  isActive
                    ? "text-blue-400 font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:animate-pulse after:w-full"
                    : "hover:text-blue-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:w-0 hover:after:w-full"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
