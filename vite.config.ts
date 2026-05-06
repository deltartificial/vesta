import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "gzip", ext: ".gz" }),
    compression({ algorithm: "brotliCompress", ext: ".br" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
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
    include: ["react", "react-dom"],
  },
});
