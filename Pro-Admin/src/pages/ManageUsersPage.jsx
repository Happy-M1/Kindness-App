// Pro-Admin/src/pages/ManageUsersPage.jsx

import { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  updateUserRole,
} from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { FaTrash, FaSearch, FaEye, FaTimes, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // "", "user", "moderator_admin", "system_admin"
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const limit = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const payload = await getUsers({
          page: currentPage,
          limit,
          search,
          role: roleFilter,
        });

        if (isMounted) {
          setUsers(payload?.users || []);
          setPages(payload?.pagination?.pages || 1);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to fetch users");
          toast.error("Failed to load users");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, search, roleFilter]);

  const handleDelete = async (id, role) => {
    if (role === "system_admin" && currentUser?.role !== "system_admin") {
      toast.error("You cannot delete a System Admin!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (selectedUser?._id === id) setSelectedUser(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (id, newRole, targetRole) => {
    if (targetRole === "system_admin" && currentUser?.role !== "system_admin") {
      toast.error("Only a System Admin can modify System Admin accounts.");
      return;
    }

    try {
      await updateUserRole(id, newRole);
      toast.success("User role updated successfully!");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      toast.error(err?.message || "Failed to update role");
    }
  };

  const isSystemAdminUser = currentUser?.role === "system_admin";

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Manage Users & Admins
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Monitor platform members, assign administrative roles, and secure
            access hierarchies.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-950/60 border border-gray-800 rounded-xl text-xs text-gray-400">
          <FaShieldAlt className="text-purple-400" /> RBAC Control
        </div>
      </div>

      {/* Filter Bar & Tabs */}
      <div className="bg-gray-900/60 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search username or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-950 text-gray-200 border border-gray-700 rounded-xl text-xs sm:text-sm focus:border-purple-500 outline-none placeholder-gray-500 shadow-inner"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => {
              setRoleFilter("");
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              roleFilter === ""
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-950 text-gray-300 border border-gray-800 hover:bg-gray-800"
            }`}
          >
            All Members
          </button>
          <button
            onClick={() => {
              setRoleFilter("user");
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              roleFilter === "user"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-950 text-gray-300 border border-gray-800 hover:bg-gray-800"
            }`}
          >
            Users Only
          </button>
          <button
            onClick={() => {
              setRoleFilter("moderator_admin");
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              roleFilter === "moderator_admin"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-950 text-gray-300 border border-gray-800 hover:bg-gray-800"
            }`}
          >
            Junior Admins
          </button>
          {isSystemAdminUser && (
            <button
              onClick={() => {
                setRoleFilter("system_admin");
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                roleFilter === "system_admin"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-purple-950/40 text-purple-300 border border-purple-800/50 hover:bg-purple-900/40"
              }`}
            >
              System Admins
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 bg-gray-900/60 rounded-2xl border border-gray-800 text-sm text-gray-400 animate-pulse shadow-xl">
          Loading users dataset...
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-sm shadow-lg">
          {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
              <thead>
                <tr className="bg-gray-950/80 border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {users.length > 0 ? (
                  users.map((u) => {
                    const isSystemAdminRow = u.role === "system_admin";
                    const isJuniorAdmin =
                      currentUser?.role === "moderator_admin";
                    const restricted = isJuniorAdmin && isSystemAdminRow;

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-800/40 transition"
                      >
                        <td className="py-3.5 px-4 flex items-center gap-3 whitespace-nowrap">
                          <img
                            src={u.imageUrl || DEFAULT_AVATAR}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-gray-700 shadow-sm"
                          />
                          <span className="font-semibold text-white">
                            {u.username}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={u.role || "user"}
                            disabled={restricted}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value, u.role)
                            }
                            className={`border rounded-xl px-3 py-1.5 text-xs font-semibold outline-none transition cursor-pointer shadow-sm ${
                              u.role === "system_admin"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                : u.role === "moderator_admin"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : "bg-gray-800 text-gray-300 border-gray-700"
                            } disabled:opacity-40`}
                          >
                            <option
                              value="user"
                              className="bg-gray-900 text-gray-200"
                            >
                              User
                            </option>
                            <option
                              value="moderator_admin"
                              className="bg-gray-900 text-gray-200"
                            >
                              Junior Admin
                            </option>
                            {isSystemAdminUser && (
                              <option
                                value="system_admin"
                                className="bg-gray-900 text-gray-200"
                              >
                                System Admin
                              </option>
                            )}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="text-blue-400 hover:text-blue-300 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {!restricted ? (
                              <button
                                onClick={() => handleDelete(u._id, u.role)}
                                className="text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs italic px-2 py-1">
                                Protected
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-16 text-gray-500 text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {!loading && users.length > 0 && (
              <div className="flex justify-between items-center text-xs sm:text-sm bg-gray-950/60 p-4 border-t border-gray-800">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl shadow-sm disabled:opacity-40 hover:bg-gray-800 hover:text-white font-medium transition cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-gray-400 font-medium">
                  Page{" "}
                  <span className="text-white font-bold">{currentPage}</span> of{" "}
                  {pages}
                </span>
                <button
                  disabled={currentPage === pages}
                  onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl shadow-sm disabled:opacity-40 hover:bg-gray-800 hover:text-white font-medium transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ View Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 relative space-y-5 text-gray-200">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-gray-800">
              <img
                src={selectedUser.imageUrl || DEFAULT_AVATAR}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 shadow-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedUser.username}
                </h3>
                <p className="text-xs text-gray-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm bg-gray-950 p-4 rounded-2xl border border-gray-800">
              <div className="flex justify-between py-1.5 border-b border-gray-800/60">
                <span className="text-gray-400 font-medium">User ID:</span>
                <span className="text-cyan-300 font-mono text-[11px]">
                  {selectedUser._id}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-800/60 items-center">
                <span className="text-gray-400 font-medium">
                  Security Role:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedUser.role === "system_admin"
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : selectedUser.role === "moderator_admin"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {selectedUser.role}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400 font-medium">
                  Account Created:
                </span>
                <span className="text-gray-200">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
