// Pro-App/src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export default function NotFoundPage() {
  const { user } = useAuth();
  const homeTarget = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        {/* Animated Badge Icon */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 text-3xl sm:text-4xl shadow-inner animate-bounce">
          <FaExclamationTriangle />
        </div>

        {/* 404 Display & Typography */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            The page or ripple network you are looking for doesn't exist or has
            been moved.
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
            className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-purple-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaHome /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
