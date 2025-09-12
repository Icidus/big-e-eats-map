// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  // Use '/' locally, '/big-e-eats-map/' in production (Pages)
  base: mode === "production" ? "/big-e-eats-map/" : "/",

  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));