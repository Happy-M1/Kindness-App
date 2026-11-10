// pro-app/src/utils/api.js
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

    // ✅ Do NOT force-redirect on 401 for session checks or public auth routes
    if (status === 401 && !requestUrl.includes("/auth/me")) {
      window.location.href = "/login";
    }

    return Promise.reject(error.response?.data || error.message || error);
  },
);

export default api;
