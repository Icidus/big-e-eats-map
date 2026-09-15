// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  // Served from the domain root by default (Cloudflare Pages, local dev). GitHub Pages sets
  // BASE_PATH=/big-e-eats-map/ in its workflow because it hosts the site under the repo name.
  base: process.env.BASE_PATH ?? "/",

  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));