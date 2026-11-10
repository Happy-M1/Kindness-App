// Pro-Admin/src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export default function NotFoundPage() {
  const { user } = useAuth();
  const homeTarget = user ? "/" : "/login";

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        {/* Admin Badge Icon */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 text-3xl sm:text-4xl shadow-inner">
          <FaShieldAlt />
        </div>

        {/* 404 Typography */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black bg-linear-to-r from-blue-400 via-indigo-400 to-yellow-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Admin Route Unreachable
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            The administrative endpoint or page you requested does not exist or
            has restricted access.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 border border-gray-700/50 cursor-pointer"
          >
            <FaArrowLeft /> Go Back
          </button>

          <Link
            to={homeTarget}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaHome /> Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
