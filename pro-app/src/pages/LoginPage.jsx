// pro-app/src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await login(formData);
      setMessage(res.message || "Login successful!");

      // ✅ redirect based on role
      const role = res.user?.role;
      if (
        role === "admin" ||
        role === "system_admin" ||
        role === "moderator_admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-transparent flex items-center justify-center min-h-[50vh] px-2 mt-16">
      <div className="w-full max-w-md bg-white p-2 rounded border border-gray-200/80 shadow-xl space-y-2">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to continue your kindness journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-gray-700 text-xs font-bold uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-1.5 top-3.5 text-gray-400 text-xs md:text-sm" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full pl-6 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-base outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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
              <FaLock className="absolute left-1.5 top-3.5 text-gray-400 text-sm" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-6 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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

          {/* Status Message */}
          {message && (
            <div
              className={`p-3 border rounded-xl text-xs text-center font-medium ${
                message.toLowerCase().includes("success")
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/10 transition cursor-pointer text-sm"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold sm:text-base hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
