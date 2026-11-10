// Pro-Admin/src/pages/AdminLoginPage.jsx
import { useState } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🍪 Backend sets HttpOnly cookies automatically; returns { message, user }
      const loginResponse = await api.post("/auth/login", formData);
      const { user } = loginResponse;

      if (user.role !== "system_admin" && user.role !== "moderator_admin") {
        setError("Access denied: Admins only");
        return;
      }

      // Store non-sensitive user metadata for UI rendering (tokens are safe in cookies)
      localStorage.setItem("adminUser", JSON.stringify(user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="bg-amber-400 flex items-center justify-center min-h-[85vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Admin Login
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to access your administrative dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-gray-700 text-xs font-bold uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-xs font-bold uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/10 transition cursor-pointer text-sm"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
