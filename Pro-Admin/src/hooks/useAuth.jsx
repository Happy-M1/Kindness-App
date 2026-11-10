// Pro-Admin/src/hooks/useAuth.jsx
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("adminUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("adminUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return { user };
};
