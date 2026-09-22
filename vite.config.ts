import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

const ROUTER_PACKAGES = /@tanstack\/(react-router|router-core|history|react-store|store)\//;

export default defineConfig({
  plugins: [
    tanstackRouter(),
    react(),
    tailwindcss(),
    compression({ algorithm: "gzip", ext: ".gz" }),
    compression({ algorithm: "brotliCompress", ext: ".br" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) {
            return undefined;
          }
          if (ROUTER_PACKAGES.test(id)) return "router";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("zustand")) return "state";
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("/zod/")) {
            return "forms";
          }
          if (id.includes("framer-motion") || id.includes("motion-")) return "animation";
          if (id.includes("@base-ui-components")) return "ui";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("scheduler") ||
            id.includes("/react-is/")
          ) {
            return "vendor";
          }
          return undefined;
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    modulePreload: { polyfill: true },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "zustand", "@tanstack/react-query"],
  },
});
