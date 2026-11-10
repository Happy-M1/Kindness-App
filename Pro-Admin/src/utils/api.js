// Pro-Admin/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    // ✅ Do NOT redirect if it's a 401 from the login endpoint itself
    const isLoginRoute =
      requestUrl.includes("/login") || requestUrl.includes("/auth");

    if (status === 401 && !isLoginRoute) {
      window.location.href = "/login";
    }

    return Promise.reject(error.response?.data || error.message || error);
  },
);

export default api;
