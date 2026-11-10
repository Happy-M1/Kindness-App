// pro-app/src/components/HomeNavbar.jsx

import { Link } from "react-router-dom";

export default function HomeNavbar() {
  return (
    <header className="w-full bgwhite/20 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">
          PayItForward
        </Link>

        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <Link to="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </Link>
          <Link to="/terms" className="text-gray-700 hover:text-gray-900">
            Terms
          </Link>
          <Link
            to="/login"
            className="ml-4 px-3 py-1 border rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign in
          </Link>
        </nav>

        <div className="sm:hidden">
          <Link to="/menu" className="text-gray-700">
            Menu
          </Link>
        </div>
      </div>
    </header>
  );
}
