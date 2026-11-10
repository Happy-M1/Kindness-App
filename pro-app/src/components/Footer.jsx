// pro-app/src/components/Footer.jsx

import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="bg-gray-800 dark:bg-gray-900 text-gray-400 
                 py-4 sm:py-6 mt-8 sm:mt-12 text-center"
      data-testid="footer"
    >
      <div className="flex flex-col sm:flex-row text-xs justify-center items-center gap-2 sm:gap-6">
        {[
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
          { to: "/privacy", label: "Privacy" },
          { to: "/terms", label: "Terms" },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative transition-colors 
               text-xs sm:text-sm md:text-base 
               ${
                 isActive
                   ? "text-blue-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:animate-pulse after:transition-all after:duration-300"
                   : "hover:text-yellow-500 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-linear-to-r after:from-blue-400 after:to-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
               }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-500">
        © {new Date().getFullYear()} Kindness Ripple. All rights reserved.
      </p>
    </footer>
  );
}
