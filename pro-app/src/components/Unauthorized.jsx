// pro-app/src/components/Unauthorized.jsx
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";

export default function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400 text-2xl">
          <FaShieldAlt />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Access Denied</h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            You do not have the required permissions to view this page. If you
            believe this is a mistake, please contact an administrator.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-purple-900/30"
          >
            <FaArrowLeft className="text-xs" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
