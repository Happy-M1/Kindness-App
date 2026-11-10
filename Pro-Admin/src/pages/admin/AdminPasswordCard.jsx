
// Pro-Admin/src/components/admin/AdminPasswordCard.jsx
import { useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import { FaLock, FaKey } from "react-icons/fa";

export default function AdminPasswordCard() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setUpdating(true);
    const toastId = toast.loading("Updating password...");
    try {
      const res = await api.put("/admin/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      const message = res?.data?.message || res?.message || "Password updated successfully!";
      toast.update(toastId, { render: message, type: "success", isLoading: false, autoClose: 3000 });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update failed:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update password";
      toast.update(toastId, { render: errMsg, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-800">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
        <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400 text-lg border border-indigo-500/20">
          <FaKey />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Security & Password</h2>
          <p className="text-gray-400 text-xs">Update your account password securely.</p>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        <div>
          <label htmlFor="current-password" className="block text-xs font-semibold text-gray-300 mb-1.5">
            Current Password *
          </label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            value={passwords.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-gray-950/80 border border-gray-800 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-gray-300 mb-1.5">
              New Password *
            </label>
            <input
              id="new-password"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-950/80 border border-gray-800 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-300 mb-1.5">
              Confirm New Password *
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-950/80 border border-gray-800 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={updating}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition shadow-lg cursor-pointer"
          >
            <FaLock /> {updating ? "Updating Password..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

