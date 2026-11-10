// pro-app/vite.config.js
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // ✅ loadEnv gives you access to .env values without using process
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: parseInt(env.VITE_PORT) || 5173, // ✅ dynamic port
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
          timeout: 300000, // 👈 Increase proxy timeout to 5 minutes (300000ms)
          proxyTimeout: 300000,
        },
      },
    },
  };
});
