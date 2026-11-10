// Pro-Admin/src/hooks/useAdminGuard.jsx
import { useAuth } from "../hooks/useAuth.jsx";
import { Navigate } from "react-router-dom";

export const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Show a loader while checking auth state so it doesn't prematurely bounce the user
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">
          Verifying admin clearance...
        </p>
      </div>
    );
  }

  // 2. Check if user is logged in and has appropriate admin roles
  if (
    !user ||
    (user.role !== "system_admin" && user.role !== "moderator_admin")
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
