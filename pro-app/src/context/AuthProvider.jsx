// pro-app/src/context/AuthProvider.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext.js";
import api from "../utils/api.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.user || res);
      } catch {
        setUser(null);
        // ✅ If they were on a protected dashboard route when session expired, redirect to login
        if (location.pathname.startsWith("/dashboard")) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [location.pathname, navigate]);

  const register = async (formData) => {
    await api.post("/auth/register", formData);
    const loginRes = await api.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    setUser(loginRes.user || loginRes);
    navigate("/dashboard");
    return loginRes;
  };

  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);
    setUser(res.user || res);
    navigate("/dashboard");
    return res;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, register, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
