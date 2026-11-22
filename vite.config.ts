import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// SITE_BASE is "/" on a host that serves the site at the root (e.g. Firebase),
// and "/carryover/" on GitHub Pages (carryoverapp.github.io/carryover/).
export default defineConfig({
  base: process.env.SITE_BASE ?? "/carryover/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
