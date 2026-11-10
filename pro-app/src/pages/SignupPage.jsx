// pro-app/src/pages/SignupPage.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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
      const res = await register(formData);
      setMessage(res.message || "Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] px-2 bg-transparent mt-16">
      <div className="w-full max-w-md bg-white p-2 rounded border border-gray-200/80 shadow-xl space-y-2">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-base font-bold tracking-tight text-gray-900">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500">
            Join our kindness community and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-gray-700 text-xs font-bold sm:font-light uppercase tracking-wider"
            >
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-1.5 top-3.5 text-gray-400 text-sm" />
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="johndoe"
                className="w-full pl-6 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-gray-700 text-xs font-bold uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-1.5 top-3.5 text-gray-400 text-sm" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="john@example.com"
                className="w-full pl-6 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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
                autoComplete="new-password"
                minLength={6}
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md shadow-blue-600/10 transition cursor-pointer text-sm"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
